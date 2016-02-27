function processLogin() {
  var username = document.getElementById('login-email-input').value;
  var password = document.getElementById('login-password-input').value;
  var payload = {username, password};
  superagent
      .post('/admin/login')
      .set('Content-Type', 'application/json')
      .send(payload)
      .end(function (err, result) {
        if (err) {
          alert('login failed!');
          return;
        }

        superagent
            .set('Content-Type', 'application/json')
            .post('/twofactor')
            .send({sig_request: sig_request})
            .end(function(err, result){
              if (err) {
                alert('login failed!');
                return;
              }
              console.log(result);
            })
      })
}

