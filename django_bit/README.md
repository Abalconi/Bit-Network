# BIT — Plataforma de Networking Físico-Digital y CRM Personal

## Arquitectura MVP (Django REST + React + PostgreSQL)

BIT es una solución de hardware-to-software donde una tarjeta física NFC actúa como el punto de inicio de la relación profesional.

```
[Dispositivo Físico NFC] ──(NFC Tap / QR)──> [Perfil Digital: /b/<token>/] 
                                                   │
                                              (Django REST API)
                                                   ▼
                                         [ContactExchange]
                                                   │
                                     (Genera Contacto en CRM)
                                                   ▼
                                         [Pipeline / Leads]
```

### Seguridad de Hardware (Tokens NanoID Base62)
Para impedir enumeración (IDOR), los IDs internos (`BIT-000001`) jamás se exponen en la URL pública.
En su lugar se genera un token aleatorio en **Base62** de 8 caracteres (ej. `/b/8F3K2x9Z`) utilizando CSPRNG (`secrets`).
- Espacio muestral: $62^8 \approx 2.18 \times 10^{14}$ combinaciones.
- Longitud óptima para chips NTAG213/215/216.

---

## Lista de Verificación Pre-Despliegue y Producción

1. **Aislamiento de Variables Sensibles:**
   - Copiar `.env.example` a `.env` en el servidor:
     ```bash
     cp .env.example .env
     ```
   - Configurar `DJANGO_SECRET_KEY`, `DATABASE_URL` y `CORS_ALLOWED_ORIGINS`.

2. **Ajuste de DEBUG:**
   - En producción: `DJANGO_DEBUG=False`. Si no se define, `settings.py` asume `False` por defecto.

3. **Manejo de Estáticos con WhiteNoise:**
   - WhiteNoise está configurado en `MIDDLEWARE` y `STATICFILES_STORAGE` con compresión gzip/brotli y caché estricto.
   - Ejecutar en el servidor:
     ```bash
     python manage.py collectstatic --noinput
     ```

4. **Dependencias:**
   - Archivo `requirements.txt` actualizado con `whitenoise` y `gunicorn`.

5. **Pruebas de Seguridad Automatizadas:**
   - Para correr la suite de pruebas unitarias y de seguridad contra ataques IDOR / fuga de datos:
     ```bash
     python manage.py test crm.tests
     ```

---

### Endpoints del CRM React:

- `POST /crm/api/login/`: Autenticación por Token.
- `GET|POST /crm/api/contacts/`: Lista y creación de leads asociados al usuario autenticado.
- `GET|PATCH|DELETE /crm/api/contacts/<id>/`: Operaciones protegidas por usuario (prevención IDOR).
- `PATCH /crm/api/contacts/<id>/stage/`: Actualización de estado en el Kanban/Pipeline.
