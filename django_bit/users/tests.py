from django.test import TestCase
from django.contrib.auth import get_user_model
from users.models import Profile

User = get_user_model()

class UserModelTests(TestCase):
    def test_create_user_with_email(self):
        user = User.objects.create_user(email='test@example.com', password='strongpassword123')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('strongpassword123'))
        self.assertFalse(user.is_staff)
        self.assertTrue(user.is_active)

    def test_create_user_without_email_raises_error(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email='', password='password123')

    def test_email_normalization(self):
        user = User.objects.create_user(email='test@EXAMPLE.COM', password='password123')
        self.assertEqual(user.email, 'test@example.com')

    def test_profile_auto_created_via_signal(self):
        user = User.objects.create_user(email='founder@bit.cards', password='password123')
        self.assertTrue(hasattr(user, 'profile'))
        self.assertIsInstance(user.profile, Profile)
        self.assertEqual(user.profile.user, user)
