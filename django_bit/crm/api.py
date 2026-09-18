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
