from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseForbidden
from django.views.decorators.http import require_http_methods
from django.db.models import Count

from .models import Contact, AnalyticsEvent
from bits.models import BIT


@login_required
def kanban_dashboard(request):
    """
    Vista principal del CRM Kanban para el usuario propietario autenticado.
    Aislamiento estricto: QuerySet.filter(user=request.user).
    """
    # Consulta de contactos aislada por usuario
    contacts = Contact.objects.filter(user=request.user).select_related('bit_origin').order_by('-created_at')

    # Agrupación por etapas del pipeline Kanban
    stages = [
        {'key': Contact.Stage.NUEVO, 'label': 'Nuevos', 'badge': 'bg-blue-100 text-blue-800', 'color': 'border-blue-400'},
        {'key': Contact.Stage.CONTACTADO, 'label': 'Contactados', 'badge': 'bg-amber-100 text-amber-800', 'color': 'border-amber-400'},
        {'key': Contact.Stage.INTERESADO, 'label': 'Interesados', 'badge': 'bg-indigo-100 text-indigo-800', 'color': 'border-indigo-400'},
        {'key': Contact.Stage.PROPUESTA, 'label': 'Propuesta Enviada', 'badge': 'bg-purple-100 text-purple-800', 'color': 'border-purple-400'},
        {'key': Contact.Stage.CLIENTE, 'label': 'Clientes / Cerrados', 'badge': 'bg-emerald-100 text-emerald-800', 'color': 'border-emerald-400'},
    ]

    columns = []
    for stage in stages:
        stage_contacts = [c for c in contacts if c.estado == stage['key']]
        columns.append({
            'stage': stage,
            'contacts': stage_contacts,
            'count': len(stage_contacts),
        })

    # Dispositivos BIT del usuario
    user_bits = BIT.objects.filter(user=request.user)

    # Métricas de telemetría agregadas
    total_contacts = contacts.count()
    events_count = AnalyticsEvent.objects.filter(bit__user=request.user).values('event_type').annotate(total=Count('id'))
    events_map = {item['event_type']: item['total'] for item in events_count}

    context = {
        'columns': columns,
        'stages': stages,
        'user_bits': user_bits,
        'total_contacts': total_contacts,
        'scanned_count': events_map.get(AnalyticsEvent.EventType.BIT_SCANNED, 0) + events_map.get(AnalyticsEvent.EventType.PROFILE_VIEWED, 0),
        'submissions_count': events_map.get(AnalyticsEvent.EventType.FORM_SUBMITTED, 0),
    }

    return render(request, 'crm/kanban.html', context)


@login_required
@require_http_methods(["POST"])
def update_contact_stage(request, contact_id: int):
    """
    Actualiza el estado de un contacto dentro del pipeline vía HTMX sin recargar la página.
    Garantiza que ningún usuario pueda modificar contactos ajenos.
    """
    contact = get_object_or_404(Contact, id=contact_id, user=request.user)
    
    new_stage = request.POST.get('stage')
    if new_stage in Contact.Stage.values:
        contact.estado = new_stage
        contact.save(update_fields=['estado', 'updated_at'])

    # Retorna la tarjeta HTMX del contacto actualizada
    return render(request, 'crm/partials/contact_card.html', {
        'contact': contact,
    })


@login_required
@require_http_methods(["POST"])
def add_contact_note(request, contact_id: int):
    """
    Agrega o actualiza notas de seguimiento en un contacto.
    """
    contact = get_object_or_404(Contact, id=contact_id, user=request.user)
    new_note = request.POST.get('notas', '').strip()
    if new_note:
        if contact.notas:
            contact.notas = f"{contact.notas}\n---\n{new_note}"
        else:
            contact.notas = new_note
        contact.save(update_fields=['notas', 'updated_at'])

    return render(request, 'crm/partials/contact_card.html', {
        'contact': contact,
    })
