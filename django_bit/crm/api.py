from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Contact
from .serializers import ContactSerializer, ContactStageSerializer
from users.models import Profile


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = (request.data.get('email') or request.data.get('username') or '').strip()
        password = request.data.get('password', '')

        if not identifier or not password:
            return Response(
                {'detail': 'Ingresa tu correo o usuario y contraseña.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        User = get_user_model()
        user = None

        # 1. Intentar autenticación estándar con email
        user = authenticate(request, email=identifier, password=password)

        # 2. Si falla, intentar pasando como username
        if user is None:
            user = authenticate(request, username=identifier, password=password)

        # 3. Verificación directa contra el modelo User de forma insensible a mayúsculas
        if user is None:
            try:
                candidate = User.objects.filter(email__iexact=identifier).first()
                if candidate and candidate.check_password(password) and candidate.is_active:
                    user = candidate
            except Exception:
                user = None

        if user is None:
            return Response(
                {'detail': 'Credenciales incorrectas. Verifica tu correo y contraseña.'},
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


class ProfileAPIView(APIView):
    """
    Endpoint para consultar y actualizar el perfil del usuario (fotos, textos, redes).
    GET es público (para que cualquier cliente vea el perfil en vivo).
    PATCH requiere autenticación (sólo el propietario puede modificarlo).
    """
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_authenticators(self):
        if self.request.method == 'GET':
            return []
        return [TokenAuthentication()]

    def _get_owner_profile(self, request):
        User = get_user_model()
        if request.user and request.user.is_authenticated:
            user = request.user
        else:
            # Buscar el superusuario principal o el primer usuario del sistema
            user = User.objects.filter(is_superuser=True).first() or User.objects.first()

        if not user:
            return None, None

        profile, _ = Profile.objects.get_or_create(user=user)
        return user, profile

    def get(self, request):
        user, profile = self._get_owner_profile(request)
        if not profile:
            return Response({'detail': 'No hay perfil configurado aún.'}, status=status.HTTP_200_OK)

        # Extraer metadatos guardados en links/redes_sociales
        metadata = profile.redes_sociales.get('_bit_meta', {}) if isinstance(profile.redes_sociales, dict) else {}
        clean_socials = {k: v for k, v in profile.redes_sociales.items() if not k.startswith('_')} if isinstance(profile.redes_sociales, dict) else {}

        return Response({
            'id': str(user.id),
            'email': profile.email or user.email,
            'nombre': profile.nombre or '',
            'cargo': profile.cargo or '',
            'empresa': profile.empresa or '',
            'descripcion': profile.descripcion or '',
            'avatarUrl': profile.fotografia_url or (profile.fotografia.url if profile.fotografia else ''),
            'coverUrl': metadata.get('coverUrl', ''),
            'tagline': metadata.get('tagline', ''),
            'telefono': profile.telefono or '',
            'whatsapp': profile.whatsapp or '',
            'ubicacion': metadata.get('ubicacion', ''),
            'quote': metadata.get('quote', ''),
            'redesSociales': clean_socials,
            'sections': metadata.get('sections', None),
        })

    def patch(self, request):
        user = request.user
        profile, _ = Profile.objects.get_or_create(user=user)
        data = request.data

        if 'nombre' in data:
            profile.nombre = data['nombre']
        if 'cargo' in data:
            profile.cargo = data['cargo']
        if 'empresa' in data:
            profile.empresa = data['empresa']
        if 'descripcion' in data:
            profile.descripcion = data['descripcion']
        if 'avatarUrl' in data:
            profile.fotografia_url = data['avatarUrl']
        if 'telefono' in data:
            profile.telefono = data['telefono']
        if 'whatsapp' in data:
            profile.whatsapp = data['whatsapp']
        if 'email' in data:
            profile.email = data['email']

        # Almacenar redes y metadatos complementarios en redes_sociales JSON
        current_socials = dict(profile.redes_sociales) if isinstance(profile.redes_sociales, dict) else {}
        if 'redesSociales' in data and isinstance(data['redesSociales'], dict):
            # Preservar _bit_meta
            meta = current_socials.get('_bit_meta', {})
            current_socials = dict(data['redesSociales'])
            current_socials['_bit_meta'] = meta

        meta = current_socials.get('_bit_meta', {})
        if 'coverUrl' in data:
            meta['coverUrl'] = data['coverUrl']
        if 'tagline' in data:
            meta['tagline'] = data['tagline']
        if 'ubicacion' in data:
            meta['ubicacion'] = data['ubicacion']
        if 'quote' in data:
            meta['quote'] = data['quote']
        if 'sections' in data:
            meta['sections'] = data['sections']

        current_socials['_bit_meta'] = meta
        profile.redes_sociales = current_socials
        profile.save()

        # Retornar perfil actualizado
        clean_socials = {k: v for k, v in profile.redes_sociales.items() if not k.startswith('_')}
        return Response({
            'id': str(user.id),
            'email': profile.email or user.email,
            'nombre': profile.nombre,
            'cargo': profile.cargo,
            'empresa': profile.empresa,
            'descripcion': profile.descripcion,
            'avatarUrl': profile.fotografia_url,
            'coverUrl': meta.get('coverUrl', ''),
            'tagline': meta.get('tagline', ''),
            'telefono': profile.telefono,
            'whatsapp': profile.whatsapp,
            'ubicacion': meta.get('ubicacion', ''),
            'quote': meta.get('quote', ''),
            'redesSociales': clean_socials,
            'sections': meta.get('sections', None),
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
    Endpoint público para capturar y sincronizar prospectos desde WhatsApp, NFC o dispositivos.
    No requiere autenticación previa para ver/guardar prospectos del perfil BIT.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        owner = User.objects.filter(is_superuser=True).first() or User.objects.first()
        if owner:
            contacts = Contact.objects.filter(user=owner).order_by('-created_at')
        else:
            contacts = Contact.objects.all().order_by('-created_at')
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
