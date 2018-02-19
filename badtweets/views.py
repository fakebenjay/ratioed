from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import twitterscraper
import datetime as dt
from IPython import embed
from .models import Tweet, User
from django.core.serializers import serialize

# Create your views here.

def index(request):
    return render(request, 'index.html')

def tweetlist(request, username, date=dt.date.today()):
    tweets = []
    user = request.GET.get('username')

    counter = 1

    for tweet in twitterscraper.query_tweets("from%3A" + user, limit=100, poolsize=1, begindate=dt.date(2006,3,21), enddate=date):
        if (int(tweet.replies) > 2*int(tweet.retweets)) and (int(tweet.replies) >= 1.5*int(tweet.likes)) and (int(tweet.replies) >= 30):
            t = Tweet(tweet_id=tweet.id, body=tweet.text, link="http://twitter.com/" + tweet.user + "/status/" + tweet.id, datetime=tweet.timestamp, replies=tweet.replies, rts=tweet.retweets, likes=tweet.likes)
            tweets.append(t)
        counter += 1

    data = serialize('json', tweets, fields=('tweet_id', 'body', 'link', 'datetime', 'replies', 'rts', 'likes'))
    embed()
    return JsonResponse(data, safe=False)
