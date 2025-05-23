from myapp.models import Book, Exchange, Rating, Recommendation
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from django.contrib.auth.models import User


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        if not attrs.get("refresh"):
            attrs["refresh"] = self.context["request"].COOKIES.get("refresh_token")
        return super().validate(attrs)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class BookSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True) 

    class Meta:
        model = Book
        fields = '__all__'
        read_only_fields = ('owner',) 

class ExchangeSerializer(serializers.ModelSerializer):
    offered_book = BookSerializer(read_only=True)
    requested_book = BookSerializer(read_only=True)
    offered_book_id = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all(), source='offered_book', write_only=True)
    requested_book_id = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all(), source='requested_book', write_only=True)

    class Meta:
        model = Exchange
        fields = '__all__'

class RatingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    book = BookSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True, required=False)
    book_id = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all(), source='book', write_only=True)

    class Meta:
        model = Rating
        fields = '__all__'
        read_only_fields = ('user',)

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

class RecommendationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    recommended_book = BookSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True, required=False)
    recommended_book_id = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all(), source='recommended_book', write_only=True)

    class Meta:
        model = Recommendation
        fields = '__all__'
        read_only_fields = ('user',)

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)