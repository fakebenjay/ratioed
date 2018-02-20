function tweetCall(name, callback) {
  fetch(`http://localhost:8000/badtweets/?username=${name}`)
    .then(res => res.json())
    .then(json => callback(json))
}
