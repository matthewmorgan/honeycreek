const router = require('express').Router();
const superagent = require('superagent');

router.get('/', (req, res, next) => {
  superagent
      .get('http://honey-server.apps.dulcetsoftware.com/users')
      .end((err, result) => {
        if (err) throw err;
        const users = result.body;
        users.sort(sortUsersByAttending);
        res.render('registrants', {users:users});
      })
});


function sortUsersByAttending (user1, user2) {
  if (user1.isAttending === 'true'){
    if(user2.isAttending === 'false'){
      return 1;
    } else {
      return user1.name.localeCompare(user2.name);
    }
  }
  return -1;
}

module.exports = router;



