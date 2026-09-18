"""
Módulo de utilidades criptográficas para la generación de tokens de hardware BIT.
Garantiza tokens no secuenciales, no predecibles e idóneos para almacenamiento en chips NFC.
"""

import secrets
import string

# Alfabeto Base62 seguro para URLs y chips NFC (sin caracteres conflictivos)
BASE62_ALPHABET = string.digits + string.ascii_letters

def generate_public_token(length: int = 8) -> str:
    """
    Genera un token criptográficamente seguro de longitud especificada (por defecto 8 caracteres).
    Utiliza el módulo `secrets` de Python (CSPRNG) y el alfabeto Base62.
    
    Espacio de claves para 8 caracteres Base62:
    62^8 ≈ 218 billones (2.18 x 10^14) combinaciones posibles.
    Inmune a ataques de fuerza bruta, IDOR y enumeración secuencial.
    
    Ejemplo de salida: '8F3K2x9Z'
    """
    if length < 6:
        raise ValueError("La longitud mínima de seguridad para el token público es 6 caracteres.")
    
    return ''.join(secrets.choice(BASE62_ALPHABET) for _ in range(length))


def generate_unique_bit_token(length: int = 8, max_attempts: int = 10) -> str:
    """
    Genera un token único garantizado contra colisiones consultando el modelo BIT.
    """
    from .models import BIT
    for _ in range(max_attempts):
        token = generate_public_token(length)
        if not BIT.objects.filter(token_publico=token).exists():
            return token
    raise RuntimeError("No fue posible generar un token público único tras múltiples intentos.")
