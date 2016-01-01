const router = require('express').Router();
const superagent = require('superagent');


router.get('/', (req, res) => {
  superagent
      .get('http://honey-server.apps.dulcetsoftware.com/users')
      .end((err, result) => {
        if (err) throw err;
        const users = result.body;
        users.sort(sortUsersByApprovedMessages);
        res.render('moderate', {users: users});
      })
});

function sortUsersByApprovedMessages(user1, user2) {
  //unapproved before approved
  if (user1.messageApproved && !user2.messageApproved) {
    return 1;
  } else if (user1.messageApproved) {
    return 0;
  } else {
    return -1;
  }
}

module.exports = router;

