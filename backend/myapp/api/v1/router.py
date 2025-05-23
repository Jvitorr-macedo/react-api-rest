from rest_framework.routers import DefaultRouter
from .viewsets import (BookViewSet, ExchangeViewSet, RatingViewSet, RecommendationViewSet)

router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'exchanges', ExchangeViewSet)
router.register(r'ratings', RatingViewSet)
router.register(r'recommendations', RecommendationViewSet)

urlpatterns = router.urls
