function tweetCall(paramsObj, callback) {
  if (!!paramsObj.date) {
    fetch(`http://localhost:8000/badtweets/?date=${paramsObj.date}&username=${paramsObj.name}`)
      .then(res => res.json())
      .then(json => callback(json))
  } else {
    fetch(`http://localhost:8000/badtweets/?username=${paramsObj.name}`)
      .then(res => res.json())
      .then(json => callback(json))
  }
}
