from django.contrib import admin
from django.utils.html import format_html
from .models import BIT

@admin.register(BIT)
class BITAdmin(admin.ModelAdmin):
    list_display = ('id_interno', 'token_publico', 'user', 'status', 'public_url_link', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('id_interno', 'token_publico', 'user__email')
    readonly_fields = ('created_at', 'updated_at')

    def public_url_link(self, obj):
        url = obj.get_public_url()
        return format_html('<a href="{}" target="_blank" class="button">/b/{}</a>', url, obj.token_publico)
    public_url_link.short_description = 'Enlace Perfil'
