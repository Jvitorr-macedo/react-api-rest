# backend/myapp/api/v1/viewsets.py
from django.conf import settings
from myapp.models import Book, Exchange, Rating, Recommendation
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
from rest_framework import filters
from .serializers import (CookieTokenRefreshSerializer, BookSerializer,
                        ExchangeSerializer, RatingSerializer, RecommendationSerializer)

from myapp.permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticated 


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")

            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=settings.SECURE_COOKIE,
                samesite="Lax",
                max_age=3600,
                path="/"
            )

            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=settings.SECURE_COOKIE,
                samesite="Lax",
                max_age=30 * 24 * 60 * 60,
                path="/"
            )
        return response


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'author', 'description', 'isbn']

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ExchangeViewSet(viewsets.ModelViewSet):
    queryset = Exchange.objects.all()
    serializer_class = ExchangeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Exchange.objects.filter(offered_book__owner=user) | Exchange.objects.filter(requested_book__owner=user)

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        queryset = super().get_queryset()
        book_id = self.request.query_params.get('book_id', None)
        if book_id is not None:
            queryset = queryset.filter(book__id=book_id)
        return queryset

class RecommendationViewSet(viewsets.ModelViewSet):
    queryset = Recommendation.objects.all()
    serializer_class = RecommendationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Recommendation.objects.filter(user=user) | Recommendation.objects.filter(recommended_book__owner=user)