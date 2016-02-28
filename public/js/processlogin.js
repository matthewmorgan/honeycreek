function processLogin() {
  var username = document.getElementById('login-email-input').value;
  var password = document.getElementById('login-password-input').value;
  var payload = {username, password};
  superagent
      .post('/login')
      .set('Content-Type', 'application/json')
      .send(payload)
      .end(function (err, result) {
        if (err) {
          alert('login failed!');
          return;
        }
        var sig_request = encodeURIComponent(result.body);
        var url = '/twofactor?sig_request='.concat(sig_request);
        location.replace(url);
      })
}

