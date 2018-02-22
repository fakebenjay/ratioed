function tweetCall(paramsObj, callback) {
  if (!!paramsObj.date) {
    var url = `http://localhost:8000/badtweets/?date=${paramsObj.date}&username=${paramsObj.name}`
  } else {
    var url = `http://localhost:8000/badtweets/?username=${paramsObj.name}`
  }

  fetch(url)
    .then(function(res) {
      if (res.status !== 200) {
        document.querySelector('.w-30').innerHTML += `<br></br><em style='color:red;'>Please enter a valid user</em>`
        return "error"
      }
      return res
    })
    .then(res => res.json())
    .then(json => callback(json))
}
