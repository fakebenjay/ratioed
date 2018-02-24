function tweetCall(paramsObj, callback) {
  if (!!paramsObj.date) {
    var url = `http://localhost:8000/badtweets/?date=${paramsObj.date}&username=${paramsObj.name}`
  } else {
    var url = `http://localhost:8000/badtweets/?username=${paramsObj.name}`
  }

  fetch(url)
    .then(res => {
      if (!res.ok) { throw response }
      return res.json()
    })
    .then(json => callback(json))
    .catch(err => {
      document.getElementById('tweet-div').innerHTML = ''
      document.querySelector('#error-window').innerHTML = `<em style='color:red;'>Please try a valid user</em>`
    })
}
