from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from crm.models import Contact

User = get_user_model()

class CRMApiSecurityTests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(email='api_a@bit.cards', password='passA123!')
        self.user_b = User.objects.create_user(email='api_b@bit.cards', password='passB123!')
        self.contact_a = Contact.objects.create(
            user=self.user_a,
            nombre='Contacto API A',
            email='api_a@test.com',
        )
        self.contact_b = Contact.objects.create(
            user=self.user_b,
            nombre='Contacto API B',
            email='api_b@test.com',
        )

    def authenticate_as_a(self):
        response = self.client.post(reverse('crm:api_login'), {
            'email': 'api_a@bit.cards',
            'password': 'passA123!',
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {response.data['token']}")

    def authenticate_as_b(self):
        response = self.client.post(reverse('crm:api_login'), {
            'email': 'api_b@bit.cards',
            'password': 'passB123!',
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {response.data['token']}")

    # =========================================================================
    # 1. PRUEBAS DE AUTENTICACIÓN Y TOKENS
    # =========================================================================
    def test_login_returns_token(self):
        """El login con credenciales válidas debe retornar un token de autenticación."""
        response = self.client.post(reverse('crm:api_login'), {
            'email': 'api_a@bit.cards',
            'password': 'passA123!',
        }, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)

    def test_unauthenticated_request_rejected(self):
        """Cualquier petición sin token a endpoints protegidos debe recibir HTTP 401 Unauthorized."""
        response = self.client.get(reverse('crm:api_contacts'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_credentials_rejected(self):
        """Intento de inicio de sesión con contraseña equivocada debe retornar 401."""
        response = self.client.post(reverse('crm:api_login'), {
            'email': 'api_a@bit.cards',
            'password': 'wrong_password',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # =========================================================================
    # 2. PRUEBAS DE AISLAMIENTO MULTI-TENANT (IDOR / PRIVACIDAD DE DATOS)
    # =========================================================================
    def test_contacts_are_strictly_isolated_by_owner(self):
        """El Usuario A NUNCA puede listar ni ver los contactos del Usuario B."""
        self.authenticate_as_a()
        response = self.client.get(reverse('crm:api_contacts'))

        self.assertEqual(response.status_code, 200)
        contact_names = [item['nombre'] for item in response.data]
        self.assertIn('Contacto API A', contact_names)
        self.assertNotIn('Contacto API B', contact_names)

    def test_create_contact_assigns_authenticated_owner(self):
        """Los contactos creados por el Usuario A se asocian de forma estricta a su ID."""
        self.authenticate_as_a()
        response = self.client.post(reverse('crm:api_contacts'), {
            'nombre': 'Nuevo contacto API',
            'email': 'nuevo@test.com',
            'empresa': 'BIT',
        }, format='json')

        self.assertEqual(response.status_code, 201)
        created = Contact.objects.get(email='nuevo@test.com')
        self.assertEqual(created.user, self.user_a)
        self.assertEqual(response.data['estatus'], 'Nuevo')

    def test_idor_prevent_viewing_other_user_contact(self):
        """Intento de acceder directamente al detalle del contacto de otro usuario debe retornar 404."""
        self.authenticate_as_a()
        response = self.client.get(
            reverse('crm:api_contact_detail', kwargs={'contact_id': self.contact_b.id})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_idor_prevent_modifying_other_user_contact(self):
        """El Usuario A NO puede modificar la etapa ni datos del contacto de Usuario B."""
        self.authenticate_as_a()
        response = self.client.patch(
            reverse('crm:api_contact_stage', kwargs={'contact_id': self.contact_b.id}),
            {'estatus': 'Ganado'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Verificar que el contacto B no fue alterado
        self.contact_b.refresh_from_db()
        self.assertEqual(self.contact_b.estado, Contact.Stage.NUEVO)

    def test_idor_prevent_deleting_other_user_contact(self):
        """El Usuario A NO puede eliminar los contactos de Usuario B."""
        self.authenticate_as_a()
        response = self.client.delete(
            reverse('crm:api_contact_detail', kwargs={'contact_id': self.contact_b.id})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Contact.objects.filter(id=self.contact_b.id).exists())
