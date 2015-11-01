var router = require('express').Router();
var ObjectId = require('mongodb').ObjectId;
var superagent = require('superagent');

/* GET home page. */
router.get('/', function (req, res, next) {
  superagent
      .get('http://honey-server.apps.dulcetsoftware.com/users')
      .end((err, result) => {
        if (err) throw err;
        var users = result.body;
        users.sort(sortUsersByApprovedMessages);
        res.render('moderate', {users:users});
      })
});

var sortUsersByApprovedMessages = function(user1, user2){
  //unapproved before approved
  if (user1.messageApproved){
    if (!user2.messageApproved){
      return 1;
    } else {
      return 0;
    }
  }
  return -1;
};

module.exports = router;

