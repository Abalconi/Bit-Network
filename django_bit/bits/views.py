import json
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseBadRequest
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_protect
from django.db import transaction

from .models import BIT
from crm.models import ContactExchange, Contact, AnalyticsEvent


def public_bit_profile(request, token: str):
    """
    Vista pública del perfil digital asociado al hardware BIT escaneado vía NFC o QR.
    Endpoint: GET /b/<token>/
    """
    # 1. Búsqueda segura por token Base62 sin exponer IDs secuenciales
    bit = get_object_or_404(
        BIT.objects.select_related('user', 'user__profile'),
        token_publico=token
    )

    # 2. Verificación de estado del hardware
    if bit.status != BIT.Status.ACTIVE or not bit.user:
        return render(request, 'bits/unassigned_or_inactive.html', {
            'bit': bit,
        }, status=404 if bit.status == BIT.Status.INACTIVE else 200)

    # 3. Registro del evento de telemetría (Perfil Visto)
    AnalyticsEvent.objects.create(
        bit=bit,
        event_type=AnalyticsEvent.EventType.PROFILE_VIEWED,
        metadata={
            'user_agent': request.META.get('HTTP_USER_AGENT', '')[:200],
            'referer': request.META.get('HTTP_REFERER', '')[:200],
        }
    )

    profile = bit.user.profile

    context = {
        'bit': bit,
        'profile': profile,
        'owner': bit.user,
        'social_links': profile.redes_sociales or {},
        'custom_links': profile.links or [],
    }

    return render(request, 'bits/public_profile.html', context)


@require_http_methods(["POST"])
@csrf_protect
def exchange_contact(request, token: str):
    """
    Procesa el formulario de intercambio de datos ('Compartir mis datos') enviado vía HTMX.
    Crea tanto el registro inmutable ContactExchange como el nuevo Contact en el CRM del propietario.
    Endpoint: POST /b/<token>/exchange/
    """
    bit = get_object_or_404(
        BIT.objects.select_related('user'),
        token_publico=token
    )

    if bit.status != BIT.Status.ACTIVE or not bit.user:
        return HttpResponseBadRequest("El dispositivo BIT no está activo o no tiene propietario.")

    # Extracción y limpieza de datos recibidos
    nombre = request.POST.get('nombre', '').strip()
    email = request.POST.get('email', '').strip()
    telefono = request.POST.get('telefono', '').strip()
    empresa = request.POST.get('empresa', '').strip()
    cargo = request.POST.get('cargo', '').strip()
    whatsapp = request.POST.get('whatsapp', '').strip()
    notas = request.POST.get('notas', '').strip()
    consent_accepted = request.POST.get('consent_accepted') in ['true', 'on', '1', True]

    # Validaciones mínimas
    errors = {}
    if not nombre:
        errors['nombre'] = "El nombre es obligatorio."
    if not email and not telefono:
        errors['contacto'] = "Por favor ingresa al menos un correo electrónico o un teléfono."
    if not consent_accepted:
        errors['consent_accepted'] = "Debes aceptar los términos de intercambio de información."

    if errors:
        # Si es una petición HTMX, retornamos el parcial del formulario con los errores
        context = {
            'bit': bit,
            'errors': errors,
            'form_data': request.POST,
        }
        return render(request, 'bits/partials/exchange_form.html', context, status=422)

    # Registro de evento FORM_SUBMITTED
    AnalyticsEvent.objects.create(
        bit=bit,
        event_type=AnalyticsEvent.EventType.FORM_SUBMITTED,
        metadata={'has_email': bool(email), 'has_phone': bool(telefono)}
    )

    visitor_data = {
        'nombre': nombre,
        'email': email,
        'telefono': telefono,
        'empresa': empresa,
        'cargo': cargo,
        'whatsapp': whatsapp or telefono,
        'notas': notas,
    }

    # Transacción atómica: ContactExchange + Contact en CRM
    with transaction.atomic():
        exchange = ContactExchange.objects.create(
            bit=bit,
            visitor_data=visitor_data,
            consent_accepted=consent_accepted,
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:255],
            ip_address=request.META.get('REMOTE_ADDR')
        )

        contact = Contact.objects.create(
            user=bit.user,
            bit_origin=bit,
            nombre=nombre,
            empresa=empresa,
            cargo=cargo,
            email=email,
            telefono=telefono,
            whatsapp=whatsapp or telefono,
            estado=Contact.Stage.NUEVO,
            origen=f"NFC Tap [{bit.id_interno}]",
            notas=f"Capturado el {exchange.created_at.strftime('%d/%m/%Y %H:%M')}.\nNotas del visitante: {notas}".strip()
        )

        AnalyticsEvent.objects.create(
            bit=bit,
            event_type=AnalyticsEvent.EventType.CONTACT_CREATED,
            metadata={'contact_id': contact.id}
        )

    # Respuesta optimizada para HTMX (sustituye el formulario en el DOM sin recargar la página)
    context = {
        'bit': bit,
        'contact': contact,
        'visitor_name': nombre,
        'owner_name': bit.user.profile.nombre or 'el propietario',
    }
    return render(request, 'bits/partials/exchange_success.html', context)


def download_vcard(request, token: str):
    """
    Genera y descarga dinámicamente un archivo vCard (.vcf) para agregar el contacto
    del propietario directamente a la agenda del smartphone del visitante.
    Endpoint: GET /b/<token>/vcard/
    """
    bit = get_object_or_404(
        BIT.objects.select_related('user', 'user__profile'),
        token_publico=token,
        status=BIT.Status.ACTIVE
    )
    profile = bit.user.profile

    vcard_lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        f"FN:{profile.nombre or bit.user.email}",
        f"ORG:{profile.empresa}",
        f"TITLE:{profile.cargo}",
        f"EMAIL;TYPE=INTERNET,WORK:{profile.email or bit.user.email}",
        f"TEL;TYPE=CELL:{profile.telefono or profile.whatsapp}",
        f"NOTE:{profile.descripcion}",
        f"URL:{bit.get_full_public_url(request)}",
        "END:VCARD"
    ]
    vcard_content = "\r\n".join([line for line in vcard_lines if not line.endswith(':')])

    response = HttpResponse(vcard_content, content_type='text/vcard; charset=utf-8')
    filename = f"contacto_{profile.nombre or 'bit'}.vcf".replace(' ', '_')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response
