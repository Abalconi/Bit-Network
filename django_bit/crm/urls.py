from django.urls import path
from .api import (
    ContactDetailAPIView,
    ContactListCreateAPIView,
    ContactStageAPIView,
    LoginAPIView,
    PublicCaptureAPIView,
)

app_name = 'crm'

urlpatterns = [
    path('api/login/', LoginAPIView.as_view(), name='api_login'),
    path('api/contacts/', ContactListCreateAPIView.as_view(), name='api_contacts'),
    path('api/contacts/<int:contact_id>/', ContactDetailAPIView.as_view(), name='api_contact_detail'),
    path('api/contacts/<int:contact_id>/stage/', ContactStageAPIView.as_view(), name='api_contact_stage'),
    path('api/public/capture/', PublicCaptureAPIView.as_view(), name='api_public_capture'),
]
