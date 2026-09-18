# BIT — Plataforma de Networking Físico-Digital y CRM Personal

## Arquitectura MVP (Django REST + React + PostgreSQL)

BIT es una solución de hardware-to-software donde una tarjeta física NFC actúa como el punto de inicio de la relación profesional.

### Flujo Imparable
```
[Dispositivo Físico NFC] ──(NFC Tap / QR)──> [Perfil Digital: /b/<token>/] 
                                                   │
                                              (Django REST API)
                                                   ▼
                                         [ContactExchange]
                                                   │
                                            (Auto-creación)
                                                   ▼
                                        [CRM Contact Pipeline] 
                                        (Aislamiento por User)
```

### Seguridad de Hardware (Tokens NanoID Base62)
Para impedir enumeración (IDOR), los IDs internos (`BIT-000001`) jamás se exponen en la URL pública.
En su lugar se genera un token aleatorio en **Base62** de 8 caracteres (ej. `/b/8F3K2x9Z`) utilizando CSPRNG (`secrets`).
- Espacio muestral: $62^8 \approx 2.18 \times 10^{14}$ combinaciones.
- Longitud óptima para chips NTAG213/215/216.

### Ejecución Local

La aplicación usa PostgreSQL. Configura la conexión antes de ejecutar Django:

```powershell
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/bit_db"
```

También puedes usar las variables `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`,
`POSTGRES_HOST` y `POSTGRES_PORT`.

1. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Migraciones:**
   ```bash
   python manage.py makemigrations users bits crm
   python manage.py migrate
   ```

3. **Crear Superusuario:**
   ```bash
   python manage.py createsuperuser
   ```

4. **Ejecutar Pruebas Unitarias:**
   ```bash
   python manage.py test
   ```

5. **Iniciar Servidor:**
   ```bash
   python manage.py runserver
   ```

El CRM React consume estos endpoints autenticados por token:

- `POST /crm/api/login/`
- `GET|POST /crm/api/contacts/`
- `PATCH|DELETE /crm/api/contacts/<id>/`
- `PATCH /crm/api/contacts/<id>/stage/`
