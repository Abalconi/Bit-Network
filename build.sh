#!/usr/bin/env bash
set -o errexit

echo "==> 1. Compilando Frontend (React + Vite)..."
bun install --frozen-lockfile
bun run build

echo "==> 2. Instalando dependencias de Python y migrando Django..."
cd django_bit
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

echo "==> ¡Build completado exitosamente!"
