from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Contact
from .serializers import ContactSerializer, ContactStageSerializer


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')
        user = authenticate(request, email=email, password=password)
        if user is None:
            return Response(
                {'detail': 'Correo o contraseña incorrectos.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
            },
        })


class ContactListCreateAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        contacts = Contact.objects.filter(user=request.user).order_by('-created_at')
        return Response(ContactSerializer(contacts, many=True).data)

    def post(self, request):
        serializer = ContactSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        contact = serializer.save()
        return Response(ContactSerializer(contact).data, status=status.HTTP_201_CREATED)


class PublicCaptureAPIView(APIView):
    """
    Endpoint de captura pública para prospectos (solo POST permitido sin autenticación).
    La lectura de contactos requiere estrictamente autenticación mediante Token.
    """
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        contacts = Contact.objects.filter(user=request.user).order_by('-created_at')
        return Response(ContactSerializer(contacts, many=True).data)

    def post(self, request):
        nombre = request.data.get('nombre', '').strip() or 'Contacto WhatsApp / Interesado'
        email = request.data.get('email', '').strip()
        telefono = request.data.get('telefono', '').strip()
        empresa = request.data.get('empresa', '').strip()
        cargo = request.data.get('cargo', '').strip()
        origen = request.data.get('origen', '').strip() or 'Compartido por WhatsApp'
        notas = request.data.get('notas', '') or request.data.get('mensaje', '')

        from django.contrib.auth import get_user_model
        User = get_user_model()
        owner = User.objects.filter(is_superuser=True).first() or User.objects.first()

        contact = Contact.objects.create(
            user=owner,
            nombre=nombre,
            email=email,
            telefono=telefono,
            whatsapp=telefono if 'whatsapp' in origen.lower() else '',
            empresa=empresa,
            cargo=cargo,
            origen=origen,
            notas=notas,
            estado=Contact.Stage.NUEVO,
        )

        return Response(ContactSerializer(contact).data, status=status.HTTP_201_CREATED)


class ContactDetailAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, request, contact_id):
        return get_object_or_404(Contact, id=contact_id, user=request.user)

    def get(self, request, contact_id):
        contact = self.get_object(request, contact_id)
        return Response(ContactSerializer(contact).data)

    def patch(self, request, contact_id):
        contact = self.get_object(request, contact_id)
        serializer = ContactSerializer(
            contact,
            data=request.data,
            partial=True,
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        contact = serializer.save()
        return Response(ContactSerializer(contact).data)

    def delete(self, request, contact_id):
        contact = self.get_object(request, contact_id)
        contact.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ContactStageAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, contact_id):
        contact = get_object_or_404(Contact, id=contact_id, user=request.user)
        serializer = ContactStageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        stage_mapping = {
            'Nuevo': Contact.Stage.NUEVO,
            'Contactado': Contact.Stage.CONTACTADO,
            'En negociación': Contact.Stage.INTERESADO,
            'Ganado': Contact.Stage.CLIENTE,
            'Perdido': Contact.Stage.NUEVO,
        }
        contact.estado = stage_mapping[serializer.validated_data['estatus']]
        contact.save(update_fields=['estado', 'updated_at'])
        return Response(ContactSerializer(contact).data)


class ProfileAPIView(APIView):
    """
    Gestión del perfil del usuario propietario.
    - GET: Permitido para cualquier visitante (AllowAny) para que al compartir
      el enlace o escanear la tarjeta BIT se vea el perfil real del propietario.
    - PUT: Requiere obligatoriamente autenticación mediante Token de sesión (IsAuthenticated).
    """
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        from users.models import Profile
        from django.contrib.auth import get_user_model
        User = get_user_model()

        if request.user and request.user.is_authenticated:
            target_user = request.user
        else:
            target_user = User.objects.filter(is_superuser=True).first() or User.objects.first()

        if not target_user:
            return Response({'error': 'No hay un perfil configurado en el sistema.'}, status=status.HTTP_404_NOT_FOUND)

        profile, _ = Profile.objects.get_or_create(user=target_user)
        extra = profile.links if isinstance(profile.links, dict) else {}

        return Response({
            'nombre': profile.nombre or target_user.email.split('@')[0],
            'cargo': profile.cargo or extra.get('cargo', ''),
            'tagline': extra.get('tagline', profile.cargo or ''),
            'empresa': profile.empresa or extra.get('empresa', ''),
            'ubicacion': extra.get('ubicacion', ''),
            'descripcion': profile.descripcion or extra.get('descripcion', ''),
            'telefono': profile.telefono or extra.get('telefono', ''),
            'email': profile.email or target_user.email,
            'whatsapp': profile.whatsapp or extra.get('whatsapp', ''),
            'avatarUrl': profile.fotografia_url or profile.avatar_display_url,
            'coverUrl': extra.get('coverUrl', ''),
            'redesSociales': profile.redes_sociales or {},
            'sections': extra.get('sections', None),
        })

    def put(self, request):
        from users.models import Profile
        profile, _ = Profile.objects.get_or_create(user=request.user)
        data = request.data
        if 'nombre' in data and data['nombre'] is not None:
            profile.nombre = str(data['nombre']).strip()
        if 'cargo' in data and data['cargo'] is not None:
            profile.cargo = str(data['cargo']).strip()
        if 'empresa' in data and data['empresa'] is not None:
            profile.empresa = str(data['empresa']).strip()
        if 'descripcion' in data and data['descripcion'] is not None:
            profile.descripcion = str(data['descripcion']).strip()
        if 'telefono' in data and data['telefono'] is not None:
            profile.telefono = str(data['telefono']).strip()
        if 'email' in data and data['email'] is not None:
            profile.email = str(data['email']).strip()
        if 'whatsapp' in data and data['whatsapp'] is not None:
            profile.whatsapp = str(data['whatsapp']).strip()
        if 'avatarUrl' in data and data['avatarUrl'] is not None:
            profile.fotografia_url = str(data['avatarUrl']).strip()
        if 'redesSociales' in data and isinstance(data['redesSociales'], dict):
            profile.redes_sociales = data['redesSociales']

        current_extra = profile.links if isinstance(profile.links, dict) else {}
        if 'coverUrl' in data and data['coverUrl'] is not None:
            current_extra['coverUrl'] = data['coverUrl']
        if 'tagline' in data and data['tagline'] is not None:
            current_extra['tagline'] = data['tagline']
        if 'ubicacion' in data and data['ubicacion'] is not None:
            current_extra['ubicacion'] = data['ubicacion']
        if 'sections' in data and data['sections'] is not None:
            current_extra['sections'] = data['sections']
        profile.links = current_extra

        profile.save()
        return Response({'status': 'ok', 'detail': 'Perfil actualizado con éxito.'})


# Alias de compatibilidad para evitar errores de importación
PublicProfileAPIView = ProfileAPIView

