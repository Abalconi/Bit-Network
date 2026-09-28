import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = 'Asegura que el superadministrador principal exista sin duplicar ni afectar a otros usuarios.'

    def handle(self, *args, **options):
        User = get_user_model()
        email = os.environ.get('ADMIN_EMAIL', 'dalebv87@gmail.com').strip()
        password = os.environ.get('ADMIN_PASSWORD', 'AdminBit2026!').strip()
        force_password = os.environ.get('RESET_ADMIN_PASSWORD', '').lower() in ('true', '1', 'yes')

        if not email:
            self.stdout.write(self.style.WARNING('[BIT AUTO-ADMIN] No se especificó ADMIN_EMAIL.'))
            return

        user = User.objects.filter(email__iexact=email).first()

        if not user:
            user = User.objects.create_superuser(
                email=email,
                password=password,
                is_staff=True,
                is_superuser=True,
                is_active=True
            )
            self.stdout.write(self.style.SUCCESS(f'[BIT AUTO-ADMIN] Superusuario {email} creado exitosamente con la contraseña configurada.'))
        else:
            user.is_superuser = True
            user.is_staff = True
            user.is_active = True
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'[BIT AUTO-ADMIN] Superusuario {email} verificado y contraseña actualizada a ADMIN_PASSWORD.'))
