from django.shortcuts import render
from django.http import HttpRequest, HttpResponse

def landing_page(request: HttpRequest) -> HttpResponse:
    """
    Renderiza la Landing Page pública oficial de BIT.
    Presenta la propuesta de valor del sticker NFC, el CRM personal,
    el simulador de tap interactivo y el pricing de $29 USD.
    """
    context = {
        'app_name': 'BIT',
        'tagline': 'Un Tap. Infinitas Oportunidades.',
        'sticker_price_usd': 29,
        'chip_type': 'NFC NTAG213',
        'public_demo_handle': 'alessandra',
    }
    return render(request, 'landing/index.html', context)
