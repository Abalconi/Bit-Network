from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from bits.models import BIT
from bits.utils import generate_public_token, BASE62_ALPHABET
from crm.models import ContactExchange, Contact, AnalyticsEvent

User = get_user_model()

class BITTokenAndSecurityTests(TestCase):
    def test_token_generator_format_and_length(self):
        token = generate_public_token(length=8)
        self.assertEqual(len(token), 8)
        self.assertTrue(all(char in BASE62_ALPHABET for char in token))

    def test_token_uniqueness(self):
        tokens = {generate_public_token(length=8) for _ in range(100)}
        self.assertEqual(len(tokens), 100, "Los tokens generados deben ser únicos y sin colisiones")

    def test_bit_model_auto_generates_token(self):
        bit = BIT.objects.create(id_interno='BIT-TEST-001')
        self.assertIsNotNone(bit.token_publico)
        self.assertEqual(len(bit.token_publico), 8)
        self.assertEqual(bit.status, BIT.Status.UNASSIGNED)


class PublicProfileAndExchangeFlowTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.owner = User.objects.create_user(email='carlos@empresa.com', password='pass1234Secure!')
        self.owner.profile.nombre = 'Carlos Mendoza'
        self.owner.profile.empresa = 'InnovaTech'
        self.owner.profile.cargo = 'CTO'
        self.owner.profile.telefono = '+34611223344'
        self.owner.profile.save()

        self.bit = BIT.objects.create(
            id_interno='BIT-000001',
            user=self.owner,
            status=BIT.Status.ACTIVE
        )

    def test_public_profile_view_records_analytics(self):
        url = reverse('bits:public_profile', kwargs={'token': self.bit.token_publico})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Carlos Mendoza')
        self.assertContains(response, 'InnovaTech')

        # Verifica que se haya registrado el evento de telemetría PROFILE_VIEWED
        self.assertTrue(
            AnalyticsEvent.objects.filter(
                bit=self.bit,
                event_type=AnalyticsEvent.EventType.PROFILE_VIEWED
            ).exists()
        )

    def test_htmx_contact_exchange_success_and_crm_creation(self):
        url = reverse('bits:exchange_contact', kwargs={'token': self.bit.token_publico})
        post_data = {
            'nombre': 'Elena Gómez',
            'email': 'elena@startups.com',
            'telefono': '+34655443322',
            'empresa': 'Venture Co',
            'cargo': 'Managing Director',
            'notas': 'Interesada en asociarnos.',
            'consent_accepted': 'true',
        }

        response = self.client.post(url, post_data)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '¡Contacto Enviado con Éxito!')
        self.assertContains(response, 'Elena Gómez')

        # 1. Verifica creación inmutable de ContactExchange
        exchange = ContactExchange.objects.filter(bit=self.bit).first()
        self.assertIsNotNone(exchange)
        self.assertEqual(exchange.visitor_data['nombre'], 'Elena Gómez')
        self.assertTrue(exchange.consent_accepted)

        # 2. Verifica creación automática de Contact en el CRM del propietario del BIT
        contact = Contact.objects.filter(user=self.owner, email='elena@startups.com').first()
        self.assertIsNotNone(contact)
        self.assertEqual(contact.nombre, 'Elena Gómez')
        self.assertEqual(contact.empresa, 'Venture Co')
        self.assertEqual(contact.estado, Contact.Stage.NUEVO)
        self.assertIn('BIT-000001', contact.origen)

    def test_exchange_requires_consent_and_contact_info(self):
        url = reverse('bits:exchange_contact', kwargs={'token': self.bit.token_publico})
        # Envío sin consentimiento
        post_data = {
            'nombre': 'Persona Sin Consentimiento',
            'email': 'noconsent@test.com',
            'consent_accepted': 'false',
        }
        response = self.client.post(url, post_data)
        self.assertEqual(response.status_code, 422)
        self.assertContains(response, 'Debes aceptar los términos')

    def test_download_vcard(self):
        url = reverse('bits:download_vcard', kwargs={'token': self.bit.token_publico})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'text/vcard; charset=utf-8')
        self.assertIn('Carlos Mendoza', response.content.decode('utf-8'))
