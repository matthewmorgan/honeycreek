var express = require('express');
var router = express.Router();
var superagent = require('superagent');

router.get('/', function(req, res, next){
  superagent
      .get('http://honey-server.apps.dulcetsoftware.com/users')
      .end((err, result) => {
        if (err) throw err;
        var users = result.body;
        users.sort(sortUsersByAttending);
        res.render('registrants', {users:users});
      })
});


var sortUsersByAttending = function(user1, user2){
  if (user1.isAttending){
    if(!user2.isAttending){
      return 1;
    } else {
      return 0;
    }
  }
  return -1;
};

module.exports = router;

