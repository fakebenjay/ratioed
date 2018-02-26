from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import twitterscraper
import datetime as dt
from dateutil import tz, parser
from IPython import embed
from .models import Tweet, User
from bs4 import BeautifulSoup
import urllib.request
from django.core.serializers import serialize

def timezone(time):
    from_zone = tz.tzutc()
    to_zone = tz.tzlocal()

    utc = time.replace(tzinfo=from_zone)

    return utc.astimezone(to_zone)

# Create your views here.

def index(request):
    return render(request, 'index.html')

def tweetlist(request, username, date=dt.date.today()):
    user = request.GET.get('username')
    tweetscrape = twitterscraper.query_tweets("from%3A" + user, limit=1, poolsize=1, begindate=dt.date(2006,3,21), enddate=date+dt.timedelta(days=1))
    date_string = str(date)

    if len(tweetscrape) == 0 or len(user.strip()) == 0:
        return JsonResponse([{'error': "We couldn't find any tweets for this user. Even good ones."}], safe=False)
    else:
        url = "http://twitter.com/" + tweetscrape[0].user
        f = urllib.request.urlopen(url)
        soup = BeautifulSoup(f, 'html.parser')

        user_list = [User(
                        name=tweetscrape[0].fullname,
                        handle=tweetscrape[0].user,
                        profile_link=url,
                        pic_ref=soup.find('img', {'class': 'ProfileAvatar-image'})['src'],
                        tweets=soup.find('a', {'data-nav': 'tweets'})['title'].replace(' Tweets', '').replace(',', ''),
                        followers=soup.find('a', {'data-nav': 'followers'})['title'].replace(' Followers', '').replace(',', ''),
                        following=soup.find('a', {'data-nav': 'following'})['title'].replace(' Following', '').replace(',', '')
                    )]

        tweets_and_lasttime = scrapeTweets(user, date_string)
        tweets = tweets_and_lasttime[0]
        last_tweet_time = tweets_and_lasttime[1]

        user_json = serialize('json', user_list, fields=('name', 'handle', 'profile_link', 'pic_ref', 'tweets', 'followers', 'following'))
        tweet_json = serialize('json', tweets, fields=('name', 'handle', 'tweet_id', 'body', 'link', 'datetime', 'replies', 'rts', 'likes'))
        return JsonResponse([user_json, tweet_json, last_tweet_time], safe=False)

def scrapeTweets(username, date):
    tweets = []
    date = parser.parse(date).date()
    tweetscrape = twitterscraper.query_tweets("from%3A" + username, limit=100, poolsize=1, begindate=dt.date(2006,3,21), enddate=date+dt.timedelta(days=1))
    last_tweet_time = timezone(tweetscrape[-1].timestamp)

    for tweet in tweetscrape:
        ## This is where "The Ratio" is defined.
        if (int(tweet.replies) >= 1.5*int(tweet.retweets)) and (int(tweet.replies) > (tweet.likes)) and (int(tweet.replies) >= 5):
            t = Tweet(name=tweet.fullname, handle=tweet.user, tweet_id=tweet.id, body=tweet.text, link="http://twitter.com/" + tweet.user + "/status/" + tweet.id, datetime=timezone(tweet.timestamp), replies=tweet.replies, rts=tweet.retweets, likes=tweet.likes)
            tweets.append(t)

    return [tweets, last_tweet_time]

def moreTweets(request, username):
    user = request.GET.get('username')
    datetime = str(parser.parse(request.GET.get('date')).date() - dt.timedelta(days=1))
    tweets_and_lasttime = scrapeTweets(user, datetime)
    tweets = tweets_and_lasttime[0]
    last_tweet_time = tweets_and_lasttime[1]

    tweet_json = serialize('json', tweets, fields=('name', 'handle', 'tweet_id', 'body', 'link', 'datetime', 'replies', 'rts', 'likes'))
    return JsonResponse([tweet_json, last_tweet_time], safe=False)

def routeTweets(request, username, date=dt.date.today()):
    if len(request.GET) == 1:
        return tweetlist(request, username)
    else:
        return moreTweets(request, username)
