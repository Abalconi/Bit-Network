from django.contrib import admin
from .models import ContactExchange, Contact, Tag, ContactTag, AnalyticsEvent

@admin.register(ContactExchange)
class ContactExchangeAdmin(admin.ModelAdmin):
    list_display = ('bit', 'get_visitor_name', 'get_visitor_email', 'consent_accepted', 'created_at')
    list_filter = ('consent_accepted', 'created_at')
    search_fields = ('bit__id_interno', 'visitor_data')

    def get_visitor_name(self, obj):
        return obj.visitor_data.get('nombre', '-')
    get_visitor_name.short_description = 'Nombre Visitante'

    def get_visitor_email(self, obj):
        return obj.visitor_data.get('email', '-')
    get_visitor_email.short_description = 'Email Visitante'

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'empresa', 'cargo', 'email', 'telefono', 'estado', 'user', 'created_at')
    list_filter = ('estado', 'created_at', 'user')
    search_fields = ('nombre', 'empresa', 'email', 'telefono', 'notas')
    list_editable = ('estado',)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'color')
    list_filter = ('user',)

@admin.register(AnalyticsEvent)
class AnalyticsEventAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'event_type', 'bit', 'metadata')
    list_filter = ('event_type', 'timestamp')
    readonly_fields = ('timestamp',)
