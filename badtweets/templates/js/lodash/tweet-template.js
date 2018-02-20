function postTweets() {
  var tweetTemplate = $('#tweet-template').html()
  var templateFn = _.template(tweetTemplate)

  var tweetDiv = $('#tweet-div')

  var templateHTML = templateFn({
    'handle': '',
    'name': '',
    'body': '',
    'replies': '',
    'retweets': '',
    'likes': '',
    'datetime': ''
  })
}
