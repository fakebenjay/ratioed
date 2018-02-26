function postTweets(paramsObj) {
  var tweetTemplate = $('#tweet-template').html()
  var profileTemplate = $('#profile-template').html()
  var templateFn = _.template(tweetTemplate)
  var profileFn = _.template(profileTemplate)

  var tweetDiv = document.getElementById('tweet-div')
  var loadDiv = document.getElementById('load-div')
  var errorWindow = document.querySelector('#error-window')
  var entryBox = $('#handle-entry').val()
  var goodError = document.querySelector('div#good-tweet-error')
  var tweetIDs = Array.prototype.map.call(tweetDiv.children, function(t) {
    if (t.className === "tweet") {return t.id}
  })

  errorWindow.innerHTML = ''
  goodError.innerHTML = ''

  if (!paramsObj.date && entryBox !== '') {
    tweetDiv.innerHTML = ''
    loadDiv.innerHTML = `<h1>FETCHING YOU HOT FRESH TWEETS WITH HOT STALE TAKES</h1>${loadscreen}`
  }

  tweetCall(paramsObj, function(rawJSON) {
    if (!!rawJSON[0].error) {
      loadDiv.innerHTML = ''
      errorWindow.innerHTML = `<em style='color:red;'>${rawJSON[0].error}</em>`
    }
    else {
      if (rawJSON.length === 3) {
        if (!!$('#user-infowindow')) {$('#user-infowindow').remove()}
        var user = JSON.parse(rawJSON[0])[0].fields
        var tweets = JSON.parse(rawJSON[1])
        var date = rawJSON[2]

        loadDiv.innerHTML = ''

        document.querySelector('#sidebox').innerHTML += profileFn({
          'pic': `"${user.pic_ref}"`,
          'name': user.name,
          'link': `"${user.profile_link}"`,
          'handle': user.handle,
          'tweets': parseInt(user.tweets).toLocaleString(),
          'followers': parseInt(user.followers).toLocaleString(),
          'following': parseInt(user.following).toLocaleString(),
          'dateAttr': date,
          'dateString': dateStringify(date)
        })
      } else {
        var tweets = JSON.parse(rawJSON[0])
        var date = rawJSON[1]
      }

      for (i=0; i<tweets.length; i++) {
        if (!tweetIDs.includes(tweets[i].fields.tweet_id)) {
          tweetDiv.innerHTML += templateFn({
            'handle': tweets[i].fields.handle,
            'tweetID': tweets[i].fields.tweet_id,
            'name': tweets[i].fields.name,
            'body': tweets[i].fields.body,
            'replies': parseInt(tweets[i].fields.replies).toLocaleString(),
            'retweets': parseInt(tweets[i].fields.rts).toLocaleString(),
            'likes': parseInt(tweets[i].fields.likes).toLocaleString(),
            'datetime': dateStringify(tweets[i].fields.datetime),
            'link': `"${tweets[i].fields.link}"`
          })
        }
      }

      // Lord Donald breaks on "Load More Tweets" if user isn't defined, because 'user' isn't in those API calls
      if (!user) {
        var user = {'handle': document.querySelector('a#handle').innerText.replace('@', '')}
      }

      // For Lord Donald
      if (tweetDiv.children.length < 2) {
        if (user.handle.toUpperCase() === 'REALDONALDTRUMP' || user.handle.toUpperCase() === 'POTUS') {
          goodError.innerHTML = "Ratioed claims they were unable to find ANY bad tweets!! Prosecute?"
        } else {
          goodError.innerHTML = "Congratulations! All of your tweets are good! So far..."
        }
      }

      $('.more-tweets').remove()
      if (!paramsObj.date) {
        tweetDiv.innerHTML += "<div class='more-tweets'><br><input type='submit' class='more-tweets-button submit' value='Load More Tweets' /></br></div>"
      } else {
        $('p#date-indicator').text(dateStringify(date))
        $('p#date-indicator').attr('title', date)
        tweetDiv.innerHTML += "<div class='more-tweets'><br><input type='submit' class='more-tweets-button submit' value='Load More Tweets' /></br></div>"
      }
    }
  })
}

// $('#loadscreen').attr('visibility', 'hidden')
