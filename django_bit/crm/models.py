from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from bits.models import BIT


class ContactExchange(models.Model):
    """
    Registro inmutable del intercambio de contacto ocurrido en el perfil digital del BIT.
    Conserva la instantánea exacta enviada por el visitante mediante HTMX.
    """
    bit = models.ForeignKey(
        BIT,
        on_delete=models.CASCADE,
        related_name='exchanges',
        verbose_name=_('Dispositivo BIT de Origen')
    )
    visitor_data = models.JSONField(
        _('Datos Ingresados por el Visitante'),
        help_text=_('Snapshot JSON con nombre, email, teléfono, empresa, cargo, notas, etc.')
    )
    consent_accepted = models.BooleanField(
        _('Consentimiento de Privacidad Aceptado'),
        default=True
    )
    user_agent = models.CharField(_('Navegador / Dispositivo'), max_length=255, blank=True)
    ip_address = models.GenericIPAddressField(_('Dirección IP (Anónima)'), null=True, blank=True)
    created_at = models.DateTimeField(_('Fecha de Intercambio'), auto_now_add=True)

    class Meta:
        verbose_name = _('Intercambio de Contacto')
        verbose_name_plural = _('Intercambios de Contacto')
        ordering = ['-created_at']

    def __str__(self):
        nombre = self.visitor_data.get('nombre', 'Visitante anónimo')
        return f"Intercambio en {self.bit.id_interno} por {nombre} ({self.created_at:%d/%m/%Y %H:%M})"


class Contact(models.Model):
    """
    Contacto consolidado dentro del CRM personal del usuario propietario del BIT.
    Aislamiento estricto de datos por User (Multi-tenant a nivel de aplicación).
    """
    class Stage(models.TextChoices):
        NUEVO = 'Nuevo', _('Nuevo')
        CONTACTADO = 'Contactado', _('Contactado')
        INTERESADO = 'Interesado', _('Interesado')
        PROPUESTA = 'Propuesta', _('Propuesta Enviada')
        CLIENTE = 'Cliente', _('Cliente / Cerrado')

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='crm_contacts',
        verbose_name=_('Propietario CRM'),
        db_index=True
    )
    bit_origin = models.ForeignKey(
        BIT,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='generated_contacts',
        verbose_name=_('BIT de Origen')
    )
    nombre = models.CharField(_('Nombre y Apellidos'), max_length=150)
    empresa = models.CharField(_('Empresa'), max_length=150, blank=True)
    cargo = models.CharField(_('Cargo / Especialidad'), max_length=150, blank=True)
    email = models.EmailField(_('Correo Electrónico'), blank=True, db_index=True)
    telefono = models.CharField(_('Teléfono'), max_length=35, blank=True)
    whatsapp = models.CharField(_('WhatsApp Directo'), max_length=35, blank=True)
    
    estado = models.CharField(
        _('Estado en el Pipeline CRM'),
        max_length=25,
        choices=Stage.choices,
        default=Stage.NUEVO,
        db_index=True
    )
    origen = models.CharField(
        _('Canal de Captura'),
        max_length=100,
        default='BIT / Networking NFC'
    )
    notas = models.TextField(_('Notas de Seguimiento'), blank=True)
    
    created_at = models.DateTimeField(_('Fecha de Captura'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Última Modificación'), auto_now=True)

    class Meta:
        verbose_name = _('Contacto CRM')
        verbose_name_plural = _('Contactos CRM')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.nombre} ({self.empresa or 'Independiente'}) — {self.get_estado_display()}"


class Tag(models.Model):
    """
    Etiquetas para segmentación y clasificación en el CRM (ej: 'Inversor', 'Lead B2B', 'Tech').
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='crm_tags'
    )
    name = models.CharField(_('Nombre de la Etiqueta'), max_length=50)
    color = models.CharField(
        _('Color hexadecimal o badge class'),
        max_length=25,
        default='blue'
    )

    class Meta:
        verbose_name = _('Etiqueta')
        verbose_name_plural = _('Etiquetas')
        unique_together = ('user', 'name')

    def __str__(self):
        return self.name


class ContactTag(models.Model):
    """
    Relación de asignación entre Contact y Tag.
    """
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='tagged_items')
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name='tagged_contacts')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('contact', 'tag')


class AnalyticsEvent(models.Model):
    """
    Registro de eventos de telemetría y métricas del dispositivo BIT.
    Permite calcular tasa de conversión: Scanned ──> Viewed ──> Form Submitted ──> Contact Created.
    """
    class EventType(models.TextChoices):
        BIT_SCANNED = 'BIT_SCANNED', _('NFC Scanned / QR Read')
        PROFILE_VIEWED = 'PROFILE_VIEWED', _('Digital Profile Viewed')
        FORM_SUBMITTED = 'FORM_SUBMITTED', _('Exchange Form Submitted')
        CONTACT_CREATED = 'CONTACT_CREATED', _('CRM Contact Created')

    bit = models.ForeignKey(
        BIT,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='analytics_events',
        verbose_name=_('Dispositivo BIT')
    )
    event_type = models.CharField(
        _('Tipo de Evento'),
        max_length=30,
        choices=EventType.choices,
        db_index=True
    )
    metadata = models.JSONField(
        _('Metadatos Adicionales'),
        default=dict,
        blank=True
    )
    timestamp = models.DateTimeField(_('Fecha y Hora'), auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = _('Evento de Analítica')
        verbose_name_plural = _('Eventos de Analítica')
        ordering = ['-timestamp']

    def __str__(self):
        bit_id = self.bit.id_interno if self.bit else 'Global'
        return f"[{self.timestamp:%Y-%m-%d %H:%M:%S}] {self.get_event_type_display()} ({bit_id})"
