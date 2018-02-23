var loadscreen = `<h1>FETCHING YOU HOT FRESH TWEETS WITH HOT STALE TAKES</h1><svg id="loadscreen" width="500px" height="500px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-pacman" style="animation-play-state: running; animation-delay: 0s; background: none;"><g ng-attr-style="display:{{config.showBean}}" style="display: block; animation-play-state: running; animation-delay: 0s;"><circle cx="49.8" cy="50" r="4" ng-attr-fill="{{config.c2}}" fill="#782f19" style="animation-play-state: running; animation-delay: 0s;"><animate attributeName="cx" calcMode="linear" values="95;35" keyTimes="0;1" dur="1" begin="-0.67s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animate><animate attributeName="fill-opacity" calcMode="linear" values="0;1;1" keyTimes="0;0.2;1" dur="1" begin="-0.67s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animate></circle><circle cx="70.2" cy="50" r="4" ng-attr-fill="{{config.c2}}" fill="#782f19" style="animation-play-state: running; animation-delay: 0s;"><animate attributeName="cx" calcMode="linear" values="95;35" keyTimes="0;1" dur="1" begin="-0.33s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animate><animate attributeName="fill-opacity" calcMode="linear" values="0;1;1" keyTimes="0;0.2;1" dur="1" begin="-0.33s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animate></circle><circle cx="90" cy="50" r="4" ng-attr-fill="{{config.c2}}" fill="#782f19" style="animation-play-state: running; animation-delay: 0s;"><animate attributeName="cx" calcMode="linear" values="95;35" keyTimes="0;1" dur="1" begin="0s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animate><animate attributeName="fill-opacity" calcMode="linear" values="0;1;1" keyTimes="0;0.2;1" dur="1" begin="0s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animate></circle></g><g ng-attr-transform="translate({{config.showBeanOffset}} 0)" transform="translate(-15 0)" style="animation-play-state: running; animation-delay: 0s;"><path d="M50 50L20 50A30 30 0 0 0 80 50Z" ng-attr-fill="{{config.c1}}" fill="#442317" transform="rotate(7.5 50 50)" style="animation-play-state: running; animation-delay: 0s;"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;45 50 50;0 50 50" keyTimes="0;0.5;1" dur="1s" begin="0s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animateTransform></path><path d="M50 50L20 50A30 30 0 0 1 80 50Z" ng-attr-fill="{{config.c1}}" fill="#442317" transform="rotate(-7.5 50 50)" style="animation-play-state: running; animation-delay: 0s;"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;-45 50 50;0 50 50" keyTimes="0;0.5;1" dur="1s" begin="0s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;"></animateTransform></path></g></svg>`

function dateStringify(string) {
  date = new Date(string)
  return date.toLocaleString('en-US', {weekday:'short', month:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'numeric'})
}

$(document).ready(function() {
  $(document.body).on('click', '#submit', function(e) {
    e.preventDefault()
    var username = $('#handle-entry').val()
    postTweets({name: username})
  })

  $(document.body).on('click', '#more-tweets', function(e) {
    e.preventDefault()
    var username = $('a#handle').text().substr(1)
    var dateIndicator = $('p#date-indicator').text()
    postTweets({date: dateIndicator, name: username})
  })
})
