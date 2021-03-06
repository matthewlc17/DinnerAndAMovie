from django.urls import path

from . import views

urlpatterns = [
    path('', views.landingpage, name='landingpage'),
    path('landingpage/', views.landingpage, name='landingpage'),
    path('theaters/<str:location>', views.theaters, name='Theaters'),
    path('restaurants/<str:latitude>/<str:longitude>', views.restaurants, name='Restaurants'),
]
