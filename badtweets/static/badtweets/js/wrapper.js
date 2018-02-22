function tweetCall(name, callback) {
  fetch(`http://localhost:8000/badtweets/?username=${name}`)
    .then(res => res.json())
    .then(json => callback(json))
}

function lazyCall(name, date, callback) {
  fetch(`http://localhost:8000/badtweets/?date=${date}&username=${name}`)
    .then(res => res.json())
    .then(json => callback(json))
}
