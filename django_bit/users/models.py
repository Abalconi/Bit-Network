from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    """
    Manager personalizado para el modelo User donde el email es el identificador único
    en lugar del clásico username.
    """
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('El correo electrónico es obligatorio'))
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('El superusuario debe tener is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('El superusuario debe tener is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Modelo de Usuario base del sistema BIT.
    Utiliza email único como identificador de autenticación principal.
    """
    email = models.EmailField(
        _('correo electrónico'),
        unique=True,
        db_index=True,
        max_length=255,
        error_messages={
            'unique': _("Ya existe un usuario registrado con este correo electrónico."),
        }
    )
    is_staff = models.BooleanField(
        _('es staff'),
        default=False,
        help_text=_('Indica si el usuario puede iniciar sesión en el sitio de administración.')
    )
    is_active = models.BooleanField(
        _('activo'),
        default=True,
        help_text=_('Indica si esta cuenta debe ser tratada como activa.')
    )
    date_joined = models.DateTimeField(_('fecha de registro'), default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _('Usuario')
        verbose_name_plural = _('Usuarios')
        ordering = ['-date_joined']

    def __str__(self):
        return self.email


class Profile(models.Model):
    """
    Perfil público del usuario propietario de uno o varios BITs.
    Relación estricta 1:1 con User.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name=_('Usuario')
    )
    nombre = models.CharField(_('Nombre completo'), max_length=150, blank=True)
    cargo = models.CharField(_('Cargo / Puesto'), max_length=150, blank=True)
    empresa = models.CharField(_('Empresa u Organización'), max_length=150, blank=True)
    descripcion = models.TextField(_('Biografía / Descripción'), blank=True)
    fotografia = models.ImageField(
        _('Fotografía de perfil'),
        upload_to='profiles/avatars/',
        blank=True,
        null=True
    )
    fotografia_url = models.URLField(
        _('URL de Fotografía alternativa'),
        blank=True,
        help_text=_('URL directa opcional si no se sube archivo local')
    )
    telefono = models.CharField(_('Teléfono'), max_length=30, blank=True)
    email = models.EmailField(_('Email público de contacto'), blank=True)
    whatsapp = models.CharField(_('WhatsApp con prefijo internacional'), max_length=30, blank=True)
    
    # Redes sociales estructuradas en formato JSON
    # Ej: {"linkedin": "https://linkedin.com/in/...", "twitter": "...", "github": "..."}
    redes_sociales = models.JSONField(
        _('Redes sociales'),
        default=dict,
        blank=True,
        help_text=_('Mapeo de clave/url para redes sociales')
    )

    # Enlaces de interés o portafolio en formato JSON
    # Ej: [{"title": "Web corporativa", "url": "https://..."}, ...]
    links = models.JSONField(
        _('Enlaces adicionales'),
        default=list,
        blank=True,
        help_text=_('Lista de enlaces destacados y portafolio')
    )

    created_at = models.DateTimeField(_('Creado en'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Actualizado en'), auto_now=True)

    class Meta:
        verbose_name = _('Perfil')
        verbose_name_plural = _('Perfiles')

    def __str__(self):
        return f"Perfil de {self.nombre or self.user.email}"

    @property
    def avatar_display_url(self):
        """Retorna la URL accesible de la fotografía o un fallback."""
        if self.fotografia:
            return self.fotografia.url
        if self.fotografia_url:
            return self.fotografia_url
        return f"https://ui-avatars.com/api/?name={self.nombre or self.user.email}&background=0F172A&color=F8FAFC&bold=true"
