from django.db import models
from django.conf import settings
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from .utils import generate_public_token


class BIT(models.Model):
    """
    Representa un dispositivo físico NFC 'BIT'.
    Mapeo indirecto de seguridad:
    Hardware ID (BIT-000001) ──> Token público NanoID (8F3K2x9Z) ──> Propietario (User) ──> Perfil
    """
    class Status(models.TextChoices):
        UNASSIGNED = 'Unassigned', _('Sin Asignar')
        ACTIVE = 'Active', _('Activo')
        INACTIVE = 'Inactive', _('Inactivo')

    id_interno = models.CharField(
        _('ID Hardware Interno'),
        max_length=50,
        unique=True,
        help_text=_('Identificador serial de fabricación. Ej: BIT-000001')
    )
    token_publico = models.CharField(
        _('Token Público NanoID'),
        max_length=12,
        unique=True,
        db_index=True,
        help_text=_('Token Base62 aleatorio de 8 a 10 caracteres grabado en el chip NFC / QR')
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='bits',
        verbose_name=_('Usuario Propietario')
    )
    status = models.CharField(
        _('Estado del Dispositivo'),
        max_length=20,
        choices=Status.choices,
        default=Status.UNASSIGNED,
        db_index=True
    )
    created_at = models.DateTimeField(_('Fecha de Creación'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Última Actualización'), auto_now=True)

    class Meta:
        verbose_name = _('Dispositivo BIT')
        verbose_name_plural = _('Dispositivos BIT')
        ordering = ['-created_at']

    def __str__(self):
        owner = self.user.email if self.user else "Sin asignar"
        return f"{self.id_interno} [{self.token_publico}] — {owner} ({self.get_status_display()})"

    def save(self, *args, **kwargs):
        """
        Garantiza que el token público se asigne antes de guardar si viene vacío.
        """
        if not self.token_publico:
            # Bucle para garantizar unicidad en caso infrecuente de colisión
            while True:
                token = generate_public_token(length=8)
                if not BIT.objects.filter(token_publico=token).exists():
                    self.token_publico = token
                    break
        super().save(*args, **kwargs)

    def get_public_url(self) -> str:
        """Retorna la ruta pública relativa /b/<token>/."""
        return reverse('bits:public_profile', kwargs={'token': self.token_publico})

    def get_full_public_url(self, request=None) -> str:
        """Retorna la URL absoluta para ser programada en el chip NFC."""
        rel_url = self.get_public_url()
        if request:
            return request.build_absolute_uri(rel_url)
        base_domain = getattr(settings, 'APP_URL', 'https://bit.cards')
        return f"{base_domain.rstrip('/')}{rel_url}"
