$('#submit').click(function(e) {
  e.preventDefault()
  var username = $('#handle-entry').val()
  postTweets(username)
})
