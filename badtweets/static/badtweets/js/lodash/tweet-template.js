function postTweets(name) {
  var tweetTemplate = $('#tweet-template').html()
  var templateFn = _.template(tweetTemplate)

  var badTweets = []

  tweetCall(name, function(raw_json) {
    json = JSON.parse(raw_json)

    for (i=0; i<json.length; i++) {
      console.log(i)
      document.getElementById('tweet-div').innerHTML += templateFn({
        'handle': json[i].fields.handle,
        'name': json[i].fields.name,
        'body': json[i].fields.body,
        'replies': json[i].fields.replies,
        'retweets': json[i].fields.rts,
        'likes': json[i].fields.likes,
        'datetime': json[i].fields.datetime
      })
    }
  })
}
