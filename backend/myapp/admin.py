# backend/myapp/admin.py
from django.contrib import admin

# Importe apenas os novos modelos
from .models import Book, Exchange, Rating, Recommendation

# Remova o registro de Product, se existir, e registre os novos modelos

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'owner', 'isbn', 'created_at')
    search_fields = ('title', 'author', 'isbn', 'description')
    list_filter = ('author', 'owner', 'created_at')

@admin.register(Exchange)
class ExchangeAdmin(admin.ModelAdmin):
    list_display = ('offered_book', 'requested_book', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at')
    search_fields = ('offered_book__title', 'requested_book__title')

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('book', 'user', 'score', 'created_at')
    list_filter = ('score', 'created_at')
    search_fields = ('book__title', 'user__username', 'comment')

@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ('user', 'recommended_book', 'created_at')
    search_fields = ('user__username', 'recommended_book__title', 'message')