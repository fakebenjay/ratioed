$('#submit').click(function(e) {
  e.preventDefault()
  debugger
  username = $('#handle-entry').val()
  postTweets(username)
})
