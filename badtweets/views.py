from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import twitterscraper
import datetime as dt
from dateutil import tz, parser
from .models import Tweet, User
from bs4 import BeautifulSoup
import urllib.request
from django.core.serializers import serialize
from IPython import embed

def timezone(time):
    from_zone = tz.tzutc()
    to_zone = tz.tzlocal()

    utc = time.replace(tzinfo=from_zone)

    return utc.astimezone(to_zone)

def unique_list(lst):
    new_list = []

    for l in lst:
        if l not in new_list:
            new_list.append(l)

    return new_list

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

        ## Louis Farrakhan Zero Following workaround
        if (soup.find('a', {'data-nav': 'tweets'})):
            tweets = soup.find('a', {'data-nav': 'tweets'})['title'].replace(' Tweets', '').replace(',', '')
        else:
            tweets = '0'

        if (soup.find('a', {'data-nav': 'followers'})):
            followers = soup.find('a', {'data-nav': 'followers'})['title'].replace(' Followers', '').replace(',', '')
        else:
            followers = '0'

        if (soup.find('a', {'data-nav': 'following'})):
            following = soup.find('a', {'data-nav': 'following'})['title'].replace(' Following', '').replace(',', '')
        else:
            following = '0'

        user_list = [User(
                        name=tweetscrape[0].fullname,
                        handle=tweetscrape[0].user,
                        profile_link=url,
                        pic_ref=soup.find('img', {'class': 'ProfileAvatar-image'})['src'],
                        tweets=tweets,
                        followers=followers,
                        following=following
                    )]

        tweets_and_lasttime = scrape_tweets(user, date_string)
        tweets = tweets_and_lasttime[0]
        last_tweet_time = tweets_and_lasttime[1]

        user_json = serialize('json', user_list, fields=('name', 'handle', 'profile_link', 'pic_ref', 'tweets', 'followers', 'following'))
        tweet_json = serialize('json', tweets, fields=('name', 'handle', 'tweet_id', 'body', 'link', 'datetime', 'replies', 'rts', 'likes'))
        return JsonResponse([user_json, tweet_json, last_tweet_time], safe=False)

def scrape_tweets(username, date):
    tweets = []
    date = parser.parse(date).date()
    tweetscrape = twitterscraper.query_tweets("from%3A" + username, limit=250, poolsize=1, begindate=dt.date(2006,3,21), enddate=date+dt.timedelta(days=1))

    # To account for twitterscraper error where duplicate tweets were being scraped (and an insufficient number of unique tweets)
    # tweetscrape = unique_list(raw_tweetscrape)

    if (tweetscrape[0].timestamp.date() == tweetscrape[-1].timestamp.date()):
        last_tweet_time = timezone((tweetscrape[-1].timestamp - dt.timedelta(days=1)).replace(hour=23, minute=59, second=59))
    elif (tweetscrape[0].timestamp.date() == tweetscrape[-1].timestamp.date()+dt.timedelta(days=1)):
        last_tweet_time = timezone((tweetscrape[-1].timestamp - dt.timedelta(days=1)).replace(hour=23, minute=59, second=59))
    else:
        last_tweet_time = timezone(tweetscrape[-1].timestamp)

    for tweet in tweetscrape:
        ## This is where "The Ratio" is defined.
        ## "Coward's Ratio" is the elif
        if (int(tweet.replies) >= 1.5*int(tweet.retweets)) and (int(tweet.replies) > int(tweet.likes)) and (int(tweet.replies) >= 5):
            t = Tweet(name=tweet.fullname, handle=tweet.user, tweet_id=tweet.id, body=tweet.text, link="http://twitter.com/" + tweet.user + "/status/" + tweet.id, datetime=timezone(tweet.timestamp), replies=tweet.replies, rts=tweet.retweets, likes=tweet.likes)
            tweets.append(t)
        elif (int(tweet.retweets) =< 5 and int(tweet.replies) >= 50) or (int(tweet.retweets) < 10 and int(tweet.replies) >= 70):
            t = Tweet(name=tweet.fullname, handle=tweet.user, tweet_id=tweet.id, body=tweet.text, link="http://twitter.com/" + tweet.user + "/status/" + tweet.id, datetime=timezone(tweet.timestamp), replies=tweet.replies, rts=tweet.retweets, likes=tweet.likes)
            tweets.append(t)

    return [tweets, last_tweet_time]

def more_tweets(request, username):
    user = request.GET.get('username')
    # datetime = str(parser.parse(request.GET.get('date')).date() + dt.timedelta(days=1))
    datetime = str(parser.parse(request.GET.get('date')).date())
    ## Uncomment when @jack re-fucks the duplicate tweetscrape bug and I can't work with more than 40 tweets
    tweets_and_lasttime = scrape_tweets(user, datetime)
    tweets = tweets_and_lasttime[0]
    last_tweet_time = tweets_and_lasttime[1]

    tweet_json = serialize('json', tweets, fields=('name', 'handle', 'tweet_id', 'body', 'link', 'datetime', 'replies', 'rts', 'likes'))
    return JsonResponse([tweet_json, last_tweet_time], safe=False)

def route_tweets(request, username, date=dt.date.today()):
    if len(request.GET) == 1:
        return tweetlist(request, username)
    else:
        return more_tweets(request, username)
