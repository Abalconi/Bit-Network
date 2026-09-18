from rest_framework import serializers

from .models import Contact


class ContactSerializer(serializers.ModelSerializer):
    fecha = serializers.DateTimeField(source='created_at', read_only=True)
    estatus = serializers.SerializerMethodField()
    canal = serializers.CharField(source='origen', read_only=True)
    avatar_initial = serializers.SerializerMethodField()

    class Meta:
        model = Contact
        fields = [
            'id',
            'nombre',
            'email',
            'telefono',
            'empresa',
            'cargo',
            'canal',
            'estatus',
            'origen',
            'fecha',
            'notas',
            'avatar_initial',
        ]
        read_only_fields = ['id', 'fecha', 'estatus', 'canal', 'avatar_initial']

    def get_estatus(self, obj):
        return {
            Contact.Stage.NUEVO: 'Nuevo',
            Contact.Stage.CONTACTADO: 'Contactado',
            Contact.Stage.INTERESADO: 'En negociación',
            Contact.Stage.PROPUESTA: 'En negociación',
            Contact.Stage.CLIENTE: 'Ganado',
        }.get(obj.estado, 'Nuevo')

    def get_avatar_initial(self, obj):
        return obj.nombre[:1].upper()

    def create(self, validated_data):
        return Contact.objects.create(
            user=self.context['request'].user,
            **validated_data,
        )


class ContactStageSerializer(serializers.Serializer):
    estatus = serializers.ChoiceField(choices=[
        'Nuevo',
        'Contactado',
        'En negociación',
        'Ganado',
        'Perdido',
    ])
