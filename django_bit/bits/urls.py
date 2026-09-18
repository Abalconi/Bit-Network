from django.urls import path
from . import views

app_name = 'bits'

urlpatterns = [
    # Vista pública principal del perfil NFC
    path('<str:token>/', views.public_bit_profile, name='public_profile'),

    # Endpoint HTMX para intercambio de datos sin recarga
    path('<str:token>/exchange/', views.exchange_contact, name='exchange_contact'),

    # Descarga directa de archivo vCard (.vcf)
    path('<str:token>/vcard/', views.download_vcard, name='download_vcard'),
]
