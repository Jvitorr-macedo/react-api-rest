from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField()
    isbn = models.CharField(max_length=13, unique=True, blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='books')
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.author}"

class Exchange(models.Model):
    offered_book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='offered_exchanges')
    requested_book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='requested_exchanges')
    status = models.CharField(max_length=50, default='pending') # pending, accepted, rejected, completed
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Troca de '{self.offered_book.title}' por '{self.requested_book.title}' - Status: {self.status}"

class Rating(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_ratings')
    score = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)]) # 1 to 5 stars
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('book', 'user') # Um usuário só pode avaliar um livro uma vez

    def __str__(self):
        return f"Avaliação para '{self.book.title}' por {self.user.username}: {self.score} estrelas"

class Recommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommendations_made')
    recommended_book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='recommendations_received')
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Recomendação de {self.user.username} para '{self.recommended_book.title}'"