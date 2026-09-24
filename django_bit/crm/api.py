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
    Requiere obligatoriamente autenticación mediante Token de sesión.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from users.models import Profile
        profile, _ = Profile.objects.get_or_create(user=request.user)
        return Response({
            'nombre': profile.nombre or request.user.email.split('@')[0],
            'cargo': profile.cargo,
            'empresa': profile.empresa,
            'descripcion': profile.descripcion,
            'telefono': profile.telefono,
            'email': profile.email or request.user.email,
            'whatsapp': profile.whatsapp,
            'avatarUrl': profile.avatar_display_url,
            'redesSociales': profile.redes_sociales or {},
        })

    def put(self, request):
        from users.models import Profile
        profile, _ = Profile.objects.get_or_create(user=request.user)
        data = request.data
        if 'nombre' in data:
            profile.nombre = data['nombre']
        if 'cargo' in data:
            profile.cargo = data['cargo']
        if 'empresa' in data:
            profile.empresa = data['empresa']
        if 'descripcion' in data:
            profile.descripcion = data['descripcion']
        if 'telefono' in data:
            profile.telefono = data['telefono']
        if 'email' in data:
            profile.email = data['email']
        if 'whatsapp' in data:
            profile.whatsapp = data['whatsapp']
        if 'avatarUrl' in data:
            profile.fotografia_url = data['avatarUrl']
        if 'redesSociales' in data:
            profile.redes_sociales = data['redesSociales']
        profile.save()
        return Response({'status': 'ok', 'detail': 'Perfil actualizado con éxito.'})
