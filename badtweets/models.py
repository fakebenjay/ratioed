from django.db import models

# Create your models here.

class Tweet(models.Model):
    name = models.CharField(max_length=200)
    handle = models.CharField(max_length=200)
    tweet_id = models.IntegerField()
    body = models.CharField(max_length=200)
    link = models.CharField(max_length=200)
    datetime = models.DateTimeField()
    replies = models.IntegerField()
    rts = models.IntegerField()
    likes = models.IntegerField()
