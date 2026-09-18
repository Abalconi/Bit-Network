from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from crm.models import Contact

User = get_user_model()

class CRMApiTests(APITestCase):
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

    def test_login_returns_token(self):
        response = self.client.post(reverse('crm:api_login'), {
            'email': 'api_a@bit.cards',
            'password': 'passA123!',
        }, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)

    def test_contacts_are_isolated_by_authenticated_user(self):
        self.authenticate_as_a()
        response = self.client.get(reverse('crm:api_contacts'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual([item['nombre'] for item in response.data], ['Contacto API A'])

    def test_create_contact_assigns_authenticated_owner(self):
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

    def test_stage_update_cannot_touch_another_user_contact(self):
        self.authenticate_as_a()
        response = self.client.patch(
            reverse('crm:api_contact_stage', kwargs={'contact_id': self.contact_b.id}),
            {'estatus': 'Ganado'},
            format='json',
        )

        self.assertEqual(response.status_code, 404)
