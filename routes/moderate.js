'use strict';

const router = require('express').Router();
const superagent = require('superagent');


router.get('/', (req, res) => {
  const cookies = req.cookies;
  if (cookies.authenticated_username) {
    superagent
        .get('http://honey-server.apps.dulcetsoftware.com/users')
        .end((err, result) => {
          if (err) throw err;
          const users = result.body;
          users.sort(sortUsersByApprovedMessages);
          res.render('moderate', {users: users});
        })
  } else {
    res.redirect('/login');
  }

});


function sortUsersByApprovedMessages(user1, user2) {
  //unapproved before approved
  let comparison = 0;
  if (user2.messageApproved) {
    comparison--;
  }
  if (user1.messageApproved) {
    comparison++;
  }
  if (comparison === 0) {
    return user1.name.localeCompare(user2.name);
  }
  return comparison;
}

module.exports = router;

