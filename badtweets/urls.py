from django.urls import path
from django.shortcuts import render

from . import views

# app_name = 'badtweets'

urlpatterns = [
    path('', views.index, name='index'),
    path('<str:username>/', views.tweetlist, name='tweetlist'),
]