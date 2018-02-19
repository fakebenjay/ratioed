import twitterscraper
import datetime as dt

def call_tweets(username, date=dt.date.today()):
    counter = 1
    bad_counter = 0

    for tweet in twitterscraper.query_tweets("from%3A" + username, limit=50, poolsize=1, begindate=dt.date(2006,3,21), enddate=date):
        if (int(tweet.replies) > 2*int(tweet.retweets)) and (int(tweet.replies) >= 1.5*int(tweet.likes)) and (int(tweet.replies) >= 30):
            print "%d. %s. Replies: %s, RTs: %s, Likes: %s"%(counter, tweet.id, tweet.replies, tweet.retweets, tweet.likes)
            bad_counter += 1

        counter += 1

    if bad_counter == 0:
        print "All of your tweets are good! Good job!"

def all_tweets(username, date=dt.date.today()):
    counter = 1

    for tweet in twitterscraper.query_tweets("from%3A" + username, limit=50, poolsize=1, begindate=dt.date(2006,3,21), enddate=date):
        print "%d. %s. Replies: %s, RTs: %s, Likes: %s"%(counter, tweet.id, tweet.replies, tweet.retweets, tweet.likes)
        counter += 1
