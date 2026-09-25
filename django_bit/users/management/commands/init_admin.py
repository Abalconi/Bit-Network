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

        user = User.objects.filter(email=email).first()

        if not user:
            user = User.objects.create_superuser(
                email=email,
                password=password,
                is_staff=True,
                is_superuser=True,
                is_active=True
            )
            self.stdout.write(self.style.SUCCESS(f'[BIT AUTO-ADMIN] Superusuario {email} creado exitosamente de forma permanente.'))
        else:
            updated = False
            if not user.is_superuser or not user.is_staff:
                user.is_superuser = True
                user.is_staff = True
                updated = True

            # Si en algún momento necesitas forzar cambio de contraseña desde Railway:
            # agregas RESET_ADMIN_PASSWORD=true en variables de entorno
            if force_password:
                user.set_password(password)
                updated = True
                self.stdout.write(self.style.SUCCESS(f'[BIT AUTO-ADMIN] Contraseña de {email} sincronizada con ADMIN_PASSWORD.'))

            if updated:
                user.save()

            self.stdout.write(self.style.SUCCESS(f'[BIT AUTO-ADMIN] Superusuario {email} verificado y activo en la base de datos.'))
