function postTweets(paramsObj) {
  var tweetTemplate = $('#tweet-template').html()
  var profileTemplate = $('#profile-template').html()
  var templateFn = _.template(tweetTemplate)
  var profileFn = _.template(profileTemplate)

  var tweetDiv = document.getElementById('tweet-div')
  var errorWindow = document.querySelector('#error-window')
  var entryBox = $('#handle-entry').val()

  errorWindow.innerHTML = ''
  if (!paramsObj.date && entryBox !== '') {tweetDiv.innerHTML = loadscreen}

  tweetCall(paramsObj, function(rawJSON) {
    if (!!rawJSON[0].error) {
      errorWindow.innerHTML = `<em style='color:red;'>${rawJSON[0].error}</em>`
    }

    else {
      if (rawJSON.length === 3) {
        if (!!$('div#user-infowindow')) {$('div#user-infowindow').remove()}
        var user = JSON.parse(rawJSON[0])[0].fields
        var tweets = JSON.parse(rawJSON[1])
        var date = rawJSON[2]

        tweetDiv.innerHTML = ''

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
        console.log(i)
        tweetDiv.innerHTML += templateFn({
          'handle': tweets[i].fields.handle,
          'name': tweets[i].fields.name,
          'body': tweets[i].fields.body,
          'replies': parseInt(tweets[i].fields.replies).toLocaleString(),
          'retweets': parseInt(tweets[i].fields.rts).toLocaleString(),
          'likes': parseInt(tweets[i].fields.likes).toLocaleString(),
          'datetime': dateStringify(tweets[i].fields.datetime),
          'link': `"${tweets[i].fields.link}"`
        })
      }
      $('.more-tweets').remove()
      if (!paramsObj.date) {
        tweetDiv.innerHTML += "<div class='more-tweets'><br><input type='submit' class='more-tweets-button' value='Load More Tweets' /></br></div>"
      } else {
        $('p#date-indicator').text(dateStringify(date))
        $('p#date-indicator').attr('title', date)
        tweetDiv.innerHTML += "<div class='more-tweets'><br><input type='submit' class='more-tweets-button' value='Load More Tweets' /></br></div>"
      }
    }
  })
}

// $('#loadscreen').attr('visibility', 'hidden')
