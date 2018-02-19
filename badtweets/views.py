from django.shortcuts import render
from django.http import HttpResponse
import twitterscraper
import datetime as dt
from IPython import embed
from .models import Tweet, User

# Create your views here.

def index(request):
    return render(request, 'index.html')

def detail(request, username, date=dt.date.today()):
    tweets = []
    user = ""

    response = "You are looking at %s's bad tweets"
    counter = 1

    for tweet in twitterscraper.query_tweets("from%3A" + username, limit=100, poolsize=1, begindate=dt.date(2006,3,21), enddate=date):
        embed()
        if (int(tweet.replies) > 2*int(tweet.retweets)) and (int(tweet.replies) >= 1.5*int(tweet.likes)) and (int(tweet.replies) >= 30):
            t = Tweet(tweet_id=tweet.id, body=tweet.text, link="http://twitter.com/" + tweet.user + "/status/" + tweet.id, datetime=tweet.timestamp, replies=tweet.replies, rts=tweet.retweets, likes=tweet.likes)
            tweets.append(t)
        counter += 1


    return HttpResponse(tweets[0].body)
