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
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')
        user = authenticate(request, email=email, password=password) or authenticate(request, username=email, password=password)
        if user is None:
            # Fallback a búsqueda directa case-insensitive
            try:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                candidate = User.objects.filter(email__iexact=email).first()
                if candidate and candidate.check_password(password):
                    user = candidate
            except Exception:
                pass

        if user is None:
            return Response(
                {'detail': 'Correo o contraseña incorrectos.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token, _ = Token.objects.get_or_create(user=user)
        from users.models import Profile
        profile, _ = Profile.objects.get_or_create(user=user)
        extra = profile.links if isinstance(profile.links, dict) else {}

        # Determinar estado de suscripción
        # Superadmin siempre tiene acceso ilimitado garantizado
        is_super = user.is_superuser
        sub_status = 'active' if is_super else extra.get('subscription_status', 'inactive')
        sub_plan = 'superadmin' if is_super else extra.get('subscription_plan', None)

        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'is_superuser': is_super,
                'subscription_status': sub_status,
                'subscription_plan': sub_plan,
            },
        })


class RegisterAPIView(APIView):
    """
    Registro y auto-activación de un nuevo cliente BIT.
    Crea la cuenta de usuario en Supabase con su perfil inicial completamente limpio.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        from django.contrib.auth import get_user_model
        from users.models import Profile
        User = get_user_model()

        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')
        nombre = request.data.get('nombre', '').strip()

        if not email or '@' not in email:
            return Response({'detail': 'Por favor ingresa un correo electrónico válido.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not password or len(password) < 6:
            return Response({'detail': 'La contraseña debe tener al menos 6 caracteres.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'detail': 'Ya existe una cuenta registrada con este correo. Por favor inicia sesión.'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear nuevo usuario en Supabase
        user = User.objects.create_user(email=email, password=password)
        
        # Crear perfil limpio sin datos precargados para el nuevo cliente
        profile = Profile.objects.create(
            user=user,
            nombre=nombre,
            cargo='',
            empresa='',
            descripcion='',
            fotografia_url='',
            telefono='',
            email=email,
            whatsapp='',
            redes_sociales={},
            links={
                'coverUrl': '',
                'tagline': '',
                'ubicacion': '',
                'sections': {
                    'sobreMi': {
                        'titulo': 'Sobre mí',
                        'subtitulo': 'Conoce más sobre mi trayectoria',
                        'contenido': '',
                        'skills': []
                    },
                    'miTrabajo': {
                        'titulo': 'Mi trabajo',
                        'subtitulo': 'Servicios y proyectos',
                        'proyectos': []
                    },
                    'contactame': {
                        'titulo': 'Contáctame',
                        'subtitulo': 'Hablemos, estoy disponible',
                        'disponible': True,
                        'mensaje': 'Escríbeme o llámame para coordinar una reunión.'
                    }
                }
            }
        )

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'status': 'ok',
            'detail': '¡Cuenta de Bit activada con éxito!',
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'is_superuser': False,
                'subscription_status': 'inactive',
                'subscription_plan': None,
            },
            'profile': {
                'nombre': profile.nombre,
                'cargo': '',
                'tagline': '',
                'empresa': '',
                'ubicacion': '',
                'descripcion': '',
                'telefono': '',
                'email': user.email,
                'whatsapp': '',
                'avatarUrl': '',
                'coverUrl': '',
                'redesSociales': {},
                'sections': profile.links.get('sections')
            }
        }, status=status.HTTP_201_CREATED)


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
        avatar = extra.get('avatarUrl') or profile.fotografia_url or profile.avatar_display_url

        is_super = target_user.is_superuser
        sub_status = 'active' if is_super else extra.get('subscription_status', 'inactive')
        sub_plan = 'superadmin' if is_super else extra.get('subscription_plan', None)

        return Response({
            'nombre': profile.nombre or '',
            'cargo': profile.cargo or extra.get('cargo', ''),
            'tagline': extra.get('tagline', profile.cargo or ''),
            'empresa': profile.empresa or extra.get('empresa', ''),
            'ubicacion': extra.get('ubicacion', ''),
            'descripcion': profile.descripcion or extra.get('descripcion', ''),
            'telefono': extra.get('telefono') or profile.telefono or '',
            'email': profile.email or target_user.email,
            'whatsapp': extra.get('whatsapp') or profile.whatsapp or '',
            'avatarUrl': avatar,
            'coverUrl': extra.get('coverUrl', ''),
            'redesSociales': profile.redes_sociales or {},
            'sections': extra.get('sections', None),
            'subscription_status': sub_status,
            'subscription_plan': sub_plan,
            'is_superuser': is_super,
        })

    def put(self, request):
        from users.models import Profile
        profile, _ = Profile.objects.get_or_create(user=request.user)
        data = request.data
        current_extra = profile.links if isinstance(profile.links, dict) else {}

        if 'nombre' in data and data['nombre'] is not None:
            profile.nombre = str(data['nombre']).strip()
        if 'cargo' in data and data['cargo'] is not None:
            profile.cargo = str(data['cargo']).strip()
        if 'empresa' in data and data['empresa'] is not None:
            profile.empresa = str(data['empresa']).strip()
        if 'descripcion' in data and data['descripcion'] is not None:
            profile.descripcion = str(data['descripcion']).strip()
        if 'email' in data and data['email'] is not None:
            profile.email = str(data['email']).strip()

        if 'telefono' in data and data['telefono'] is not None:
            raw_tel = str(data['telefono']).strip()
            profile.telefono = raw_tel[:30]
            current_extra['telefono'] = raw_tel

        if 'whatsapp' in data and data['whatsapp'] is not None:
            raw_wa = str(data['whatsapp']).strip()
            profile.whatsapp = raw_wa[:30]
            current_extra['whatsapp'] = raw_wa

        if 'avatarUrl' in data and data['avatarUrl'] is not None:
            raw_avatar = str(data['avatarUrl']).strip()
            if (raw_avatar.startswith('http://') or raw_avatar.startswith('https://')) and len(raw_avatar) <= 200:
                profile.fotografia_url = raw_avatar
                current_extra['avatarUrl'] = raw_avatar
            else:
                profile.fotografia_url = ''
                current_extra['avatarUrl'] = raw_avatar

        if 'redesSociales' in data and isinstance(data['redesSociales'], dict):
            profile.redes_sociales = data['redesSociales']

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

        extra = profile.links if isinstance(profile.links, dict) else {}
        avatar = extra.get('avatarUrl') or profile.fotografia_url or profile.avatar_display_url

        return Response({
            'status': 'ok',
            'detail': 'Perfil actualizado con éxito en Supabase.',
            'profile': {
                'nombre': profile.nombre or '',
                'cargo': profile.cargo or extra.get('cargo', ''),
                'tagline': extra.get('tagline', profile.cargo or ''),
                'empresa': profile.empresa or extra.get('empresa', ''),
                'ubicacion': extra.get('ubicacion', ''),
                'descripcion': profile.descripcion or extra.get('descripcion', ''),
                'telefono': extra.get('telefono') or profile.telefono or '',
                'email': profile.email or request.user.email,
                'whatsapp': extra.get('whatsapp') or profile.whatsapp or '',
                'avatarUrl': avatar,
                'coverUrl': extra.get('coverUrl', ''),
                'redesSociales': profile.redes_sociales or {},
                'sections': extra.get('sections', None),
            }
        })


# Alias de compatibilidad para evitar errores de importación
PublicProfileAPIView = ProfileAPIView


class SubscriptionAPIView(APIView):
    """
    Gestión de la suscripción del usuario.
    Permite consultar el estado actual y activar el plan de Recurrente.
    El superadmin siempre tiene acceso ilimitado 'active'.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from users.models import Profile
        profile, _ = Profile.objects.get_or_create(user=request.user)
        extra = profile.links if isinstance(profile.links, dict) else {}

        is_super = request.user.is_superuser
        sub_status = 'active' if is_super else extra.get('subscription_status', 'inactive')
        sub_plan = 'superadmin' if is_super else extra.get('subscription_plan', None)
        valid_until = extra.get('subscription_valid_until', None)

        return Response({
            'status': sub_status,
            'plan': sub_plan,
            'is_superuser': is_super,
            'valid_until': valid_until,
            'can_access_crm': is_super or sub_status == 'active',
            'pricing': {
                'monthly': {'price_gtq': 39.99, 'period': 'mensual'},
                'annual': {'price_gtq': 420.00, 'period': 'anual', 'savings_gtq': 59.88}
            }
        })

    def post(self, request):
        """
        Activación de suscripción tras pago en Recurrente (o simulación/webhook).
        """
        from users.models import Profile
        profile, _ = Profile.objects.get_or_create(user=request.user)
        extra = profile.links if isinstance(profile.links, dict) else {}

        plan = request.data.get('plan', 'monthly') # 'monthly' o 'annual'
        action = request.data.get('action', 'activate') # 'activate' o 'cancel'

        if action == 'cancel' and not request.user.is_superuser:
            extra['subscription_status'] = 'inactive'
            extra['subscription_plan'] = None
        else:
            extra['subscription_status'] = 'active'
            extra['subscription_plan'] = 'anual' if plan == 'annual' else 'mensual'

        profile.links = extra
        profile.save()

        return Response({
            'status': 'ok',
            'subscription_status': 'active' if request.user.is_superuser else extra.get('subscription_status'),
            'subscription_plan': 'superadmin' if request.user.is_superuser else extra.get('subscription_plan'),
            'detail': 'Suscripción actualizada con éxito en Supabase.'
        })


class RecurrenteWebhookAPIView(APIView):
    """
    Webhook receptor de eventos de pago de Recurrente.
    Al recibir 'payment.success' o 'subscription.created', activa automáticamente el CRM para el cliente.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        from django.contrib.auth import get_user_model
        from users.models import Profile
        User = get_user_model()

        data = request.data
        # Recurrente envía los datos del checkout o suscripción
        email = data.get('customer_email') or data.get('email') or (data.get('customer', {}).get('email') if isinstance(data.get('customer'), dict) else None)

        if not email:
            return Response({'status': 'ignored', 'reason': 'No email found in payload'}, status=status.HTTP_200_OK)

        user = User.objects.filter(email=email.strip().lower()).first()
        if user:
            profile, _ = Profile.objects.get_or_create(user=user)
            extra = profile.links if isinstance(profile.links, dict) else {}
            extra['subscription_status'] = 'active'
            extra['subscription_plan'] = 'anual' if '420' in str(data) else 'mensual'
            profile.links = extra
            profile.save()
            return Response({'status': 'ok', 'detail': f'CRM activado para {user.email}'}, status=status.HTTP_200_OK)

        return Response({'status': 'user_not_found', 'email': email}, status=status.HTTP_200_OK)


