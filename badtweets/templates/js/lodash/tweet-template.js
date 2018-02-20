function postTweets(name) {
  var tweetTemplate = $('#tweet-template').html()
  var templateFn = _.template(tweetTemplate)

  var tweetDiv = $('#tweet-div')

  var badTweets = []

  tweetcall(name, function(json) {
    json = JSON.parse(json)
    
    for (i=0; i<json.length; i++) {
      badTweets.push({
        'handle': json[i].fields.handle,
        'name': json[i].fields.name,
        'body': json[i].fields.body,
        'replies': json[i].fields.replies,
        'retweets': json[i].fields.retweets,
        'likes': json[i].fields.likes,
        'datetime': json[i].fields.datetime
      })
    }
  })

  for (i=0; i<badTweets.length; i++) {
    tweetDiv += templateFn(badTweets[i])
  }
}
