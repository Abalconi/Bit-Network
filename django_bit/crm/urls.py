from django.urls import path
from . import views

app_name = 'crm'

urlpatterns = [
    # Dashboard principal con Kanban
    path('dashboard/', views.kanban_dashboard, name='dashboard'),

    # Actualización reactiva de etapas vía HTMX
    path('contacts/<int:contact_id>/stage/', views.update_contact_stage, name='update_stage'),

    # Agregar nota rápida a contacto vía HTMX
    path('contacts/<int:contact_id>/note/', views.add_contact_note, name='add_note'),
]
