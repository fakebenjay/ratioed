from django.db import models

# Create your models here.

class User(models.Model):
    name = models.CharField(max_length=280)
    handle = models.CharField(max_length=280)
    profile_link = models.CharField(max_length=300)
    pic_ref = models.CharField(max_length=300)
    tweets = models.IntegerField()
    followers = models.IntegerField()
    following = models.IntegerField()

class Tweet(models.Model):
    name = models.CharField(max_length=280)
    handle = models.CharField(max_length=280)
    tweet_id = models.IntegerField()
    body = models.CharField(max_length=400)
    link = models.CharField(max_length=400)
    datetime = models.DateTimeField()
    replies = models.IntegerField()
    rts = models.IntegerField()
    likes = models.IntegerField()
