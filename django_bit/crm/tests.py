from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from crm.models import Contact
from bits.models import BIT

User = get_user_model()

class CRMIsolationAndStageTests(TestCase):
    def setUp(self):
        self.client = Client()
        
        # Usuario A (Propietario 1)
        self.user_a = User.objects.create_user(email='user_a@bit.cards', password='passA123!')
        self.contact_a = Contact.objects.create(
            user=self.user_a,
            nombre='Contacto Privado A',
            email='lead_a@test.com',
            estado=Contact.Stage.NUEVO
        )

        # Usuario B (Propietario 2)
        self.user_b = User.objects.create_user(email='user_b@bit.cards', password='passB123!')
        self.contact_b = Contact.objects.create(
            user=self.user_b,
            nombre='Contacto Privado B',
            email='lead_b@test.com',
            estado=Contact.Stage.NUEVO
        )

    def test_dashboard_strict_data_isolation(self):
        """User A solo ve sus propios contactos, nunca los de User B."""
        self.client.force_login(self.user_a)
        response = self.client.get(reverse('crm:dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Contacto Privado A')
        self.assertNotContains(response, 'Contacto Privado B')

    def test_update_contact_stage_htmx(self):
        """User A puede actualizar el estado de su contacto vía HTMX."""
        self.client.force_login(self.user_a)
        url = reverse('crm:update_stage', kwargs={'contact_id': self.contact_a.id})
        response = self.client.post(url, {'stage': Contact.Stage.PROPUESTA})
        self.assertEqual(response.status_code, 200)

        self.contact_a.refresh_from_db()
        self.assertEqual(self.contact_a.estado, Contact.Stage.PROPUESTA)

    def test_prevent_modifying_other_user_contact(self):
        """User B NO puede modificar los contactos de User A (retorna 404 por get_object_or_404(user=request.user))."""
        self.client.force_login(self.user_b)
        url = reverse('crm:update_stage', kwargs={'contact_id': self.contact_a.id})
        response = self.client.post(url, {'stage': Contact.Stage.CLIENTE})
        self.assertEqual(response.status_code, 404)

        # El contacto permanece intacto
        self.contact_a.refresh_from_db()
        self.assertEqual(self.contact_a.estado, Contact.Stage.NUEVO)
