function postTweets(name) {
  var tweetTemplate = $('#tweet-template').html()
  var profileTemplate = $('#profile-template').html()
  var templateFn = _.template(tweetTemplate)
  var profileFn = _.template(profileTemplate)

  document.getElementById('tweet-div').innerHTML = ''
  document.getElementById('tweet-div').innerHTML = `<h1>FETCHING YOU FRESH HOT TWEETS WITH STALE HOT TAKES</h1><svg id="loadscreen" width="500px" height="500px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-pacman" style="animation-play-state: running; animation-delay: 0s; background: none;"><g ng-attr-style="display:{{config.showBean}}" style="display: block; animation-play-state: running; animation-delay: 0s;"><circle cx="49.8" cy="50" r="4" ng-attr-fill="{{config.c2}}" fill="#782f19" style="animation-play-state: running; animation-delay: 0s;"><animate attributeName="cx" calcMode="linear" values="95;35" keyTimes="0;1" dur="1" begin="-0.67s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animate><animate attributeName="fill-opacity" calcMode="linear" values="0;1;1" keyTimes="0;0.2;1" dur="1" begin="-0.67s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animate></circle><circle cx="70.2" cy="50" r="4" ng-attr-fill="{{config.c2}}" fill="#782f19" style="animation-play-state: running; animation-delay: 0s;"><animate attributeName="cx" calcMode="linear" values="95;35" keyTimes="0;1" dur="1" begin="-0.33s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animate><animate attributeName="fill-opacity" calcMode="linear" values="0;1;1" keyTimes="0;0.2;1" dur="1" begin="-0.33s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animate></circle><circle cx="90" cy="50" r="4" ng-attr-fill="{{config.c2}}" fill="#782f19" style="animation-play-state: running; animation-delay: 0s;"><animate attributeName="cx" calcMode="linear" values="95;35" keyTimes="0;1" dur="1" begin="0s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animate><animate attributeName="fill-opacity" calcMode="linear" values="0;1;1" keyTimes="0;0.2;1" dur="1" begin="0s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animate></circle></g><g ng-attr-transform="translate({{config.showBeanOffset}} 0)" transform="translate(-15 0)" style="animation-play-state: running; animation-delay: 0s;"><path d="M50 50L20 50A30 30 0 0 0 80 50Z" ng-attr-fill="{{config.c1}}" fill="#442317" transform="rotate(7.5 50 50)" style="animation-play-state: running; animation-delay: 0s;"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;45 50 50;0 50 50" keyTimes="0;0.5;1" dur="1s" begin="0s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animateTransform></path><path d="M50 50L20 50A30 30 0 0 1 80 50Z" ng-attr-fill="{{config.c1}}" fill="#442317" transform="rotate(-7.5 50 50)" style="animation-play-state: running; animation-delay: 0s;"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;-45 50 50;0 50 50" keyTimes="0;0.5;1" dur="1s" begin="0s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animateTransform></path></g></svg>`

  tweetCall(name, function(rawJSON) {
    document.getElementById('tweet-div').innerHTML = ''

    if (!!rawJSON[0].error) {
      document.querySelector('.w-30').innerHTML += `<br></br><em style='color:red;'>${rawJSON[0].error}</em>`
    }
    else {
      var user = JSON.parse(rawJSON[0])[0].fields
      var tweets = JSON.parse(rawJSON[1])

      document.querySelector('.w-30').innerHTML += profileFn({
        'pic': `"${user.pic_ref}"`,
        'name': user.name,
        'link': `"${user.profile_link}"`,
        'handle': user.handle,
        'tweets': parseInt(user.tweets).toLocaleString(),
        'followers': parseInt(user.followers).toLocaleString(),
        'following': parseInt(user.following).toLocaleString()
      })

      for (i=0; i<tweets.length; i++) {
        console.log(i)
        document.getElementById('tweet-div').innerHTML += templateFn({
          'handle': tweets[i].fields.handle,
          'name': tweets[i].fields.name,
          'body': tweets[i].fields.body,
          'replies': tweets[i].fields.replies,
          'retweets': tweets[i].fields.rts,
          'likes': tweets[i].fields.likes,
          'datetime': tweets[i].fields.datetime,
          'link': `"${tweets[i].fields.link}"`
        })
      }
    }
  })
}

// $('#loadscreen').attr('visibility', 'hidden')
