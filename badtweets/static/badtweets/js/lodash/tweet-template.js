function postTweets(paramsObj) {
  var tweetTemplate = $('#tweet-template').html()
  var profileTemplate = $('#profile-template').html()
  var templateFn = _.template(tweetTemplate)
  var profileFn = _.template(profileTemplate)

  var tweetDiv = document.getElementById('tweet-div')

  if (!paramsObj.date) {tweetDiv.innerHTML = loadscreen}

  tweetCall(paramsObj, function(rawJSON) {
    if (!!rawJSON[0].error) {
      document.querySelector('.w-30').innerHTML += `<br></br><em style='color:red;'>${rawJSON[0].error}</em>`
    }
    else {
      if (rawJSON.length === 3) {
        if (!!$('div#user-infowindow')) {$('div#user-infowindow').remove()}
        var user = JSON.parse(rawJSON[0])[0].fields
        var tweets = JSON.parse(rawJSON[1])
        var date = rawJSON[2]

        tweetDiv.innerHTML = ''

        document.querySelector('.w-30').innerHTML += profileFn({
          'pic': `"${user.pic_ref}"`,
          'name': user.name,
          'link': `"${user.profile_link}"`,
          'handle': user.handle,
          'tweets': parseInt(user.tweets).toLocaleString(),
          'followers': parseInt(user.followers).toLocaleString(),
          'following': parseInt(user.following).toLocaleString(),
          'date': date
        })
      } else {
        var tweets = JSON.parse(rawJSON[0])
        var date = rawJSON[1]
      }

      for (i=0; i<tweets.length; i++) {
        console.log(i)
        tweetDiv.innerHTML += templateFn({
          'handle': tweets[i].fields.handle,
          'name': tweets[i].fields.name,
          'body': tweets[i].fields.body,
          'replies': parseInt(tweets[i].fields.replies).toLocaleString(),
          'retweets': parseInt(tweets[i].fields.rts).toLocaleString(),
          'likes': parseInt(tweets[i].fields.likes).toLocaleString(),
          'datetime': tweets[i].fields.datetime,
          'link': `"${tweets[i].fields.link}"`
        })
      }
      if (!paramsObj.date) {
        tweetDiv.innerHTML += "<input type='submit' id='more-tweets' value='Load More Tweets' />"
      } else {
        $('input#more-tweets').remove()
        $('p#date-indicator').text(date)
        tweetDiv.innerHTML += "<input type='submit' id='more-tweets' value='Load More Tweets' />"
      }
    }
  })
}

// $('#loadscreen').attr('visibility', 'hidden')
