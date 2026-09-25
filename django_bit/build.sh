#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
email = os.environ.get('ADMIN_EMAIL', 'dalebv87@gmail.com')
password = os.environ.get('ADMIN_PASSWORD', 'AdminBit2026!')
if email and password:
    user, created = User.objects.get_or_create(email=email, defaults={'is_staff': True, 'is_superuser': True})
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.save()
    if created:
        print(f'[BIT] Superusuario {email} creado exitosamente en Supabase.')
    else:
        print(f'[BIT] Superusuario {email} verificado y clave actualizada en Supabase.')
"
