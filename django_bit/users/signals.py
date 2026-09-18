from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Profile

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """
    Crea automáticamente una instancia Profile al registrarse un nuevo User.
    """
    if created:
        Profile.objects.create(user=instance, email=instance.email)
    else:
        if hasattr(instance, 'profile'):
            instance.profile.save()
