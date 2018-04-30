//652
function ajax (data, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://127.0.0.1:3333/itpub');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.onload = function(e) {
    if (this.status == 200) {
      cb( this.response);
    } else {
    	console.log('error');
    }
  };
  xhr.onerror = function () {
    console.log('error');
  }
  data = encodeURIComponent(JSON.stringify(data))
  xhr.send('data=' + data);
}
var count = 562;
function next() {
	jQuery.ajax({
		url: `http://www.itpub.net/forum-61-${count}.html`, 
		dataType: 'html'
	}).done((data) => {
		var arr = data.match(/<a href="thread-.+\/a>/g)
		console.log(arr.length);
		var ret = [];
		arr.forEach((item) => {
			var match = item.match(/"(.+?)"/);
			var url;
			var name;
			if (match) {
				url = match[1];
			} else {
				return
			}
			match = item.match(/"s xst">(.+)<\/a>/);
			if (match) {
				name = match[1];
			} else {
				return
			}
			ret.push({
				url: url,
				name: name
			})
		});
		console.log(ret.length, count);
		count++;
		if (count > 1000) {
			return
		}
		ajax(ret, (res) => {
			res = JSON.parse(res);
			if (res.success) {
				setTimeout(() => {
					next();
				}, 1000);
			} else {
				console.log(res);
			}
		})
	})
}