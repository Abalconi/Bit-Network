"""
URL configuration for BIT project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Public NFC entry point /b/<token>/ mapped to bits app
    path('b/', include('bits.urls', namespace='bits')),

    # CRM Private Dashboard & Contact pipeline
    path('crm/', include('crm.urls', namespace='crm')),

    # Default root redirect
    path('', RedirectView.as_view(url='/admin/', permanent=False), name='home'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
