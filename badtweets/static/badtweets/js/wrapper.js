function tweetCall(paramsObj, callback) {
	if (!!paramsObj.date) {
		var url = `https://ratioed.herokuapp.com/badtweets/?date=${paramsObj.date}&username=${paramsObj.name}`
	} else {
		var url = `https://ratioed.herokuapp.com/badtweets/?username=${paramsObj.name}`
	}

	// if (!!paramsObj.date) {
	// 	var url = `http://127.0.0.1:8000/badtweets/?date=${paramsObj.date}&username=${paramsObj.name}`
	// } else {
	// 	var url = `http://127.0.0.1:8000/badtweets/?username=${paramsObj.name}`
	// }

	fetch(url)
		.then(res => {
			if (!res.ok) { throw response }
			return res.json()
		})
		.then(json => callback(json))
		.catch(err => {
			$('input#submit').prop('disabled', false)
			document.getElementById('load-div').innerHTML = ''
			if (!!$('#user-infowindow').html()) {
				document.querySelector('#error-window').innerHTML = `<em style='color:red;'>This user has run out of tweets</em>`
				document.querySelector('div.more-tweets').innerHTML = ""
			} else {
				document.querySelector('#error-window').innerHTML = `<em style='color:red;'>Please try a valid user</em>`
				document.querySelector('#load-div').innerHTML = ""
			}
		})
}