var router = require('express').Router();

var superagent = require('superagent');

/* GET home page. */
router.get('/', function (req, res, next) {
  superagent
      .get('http://honey-server.apps.dulcetsoftware.com/users')
      .end((err, result) => {
        if (err) throw err;
        console.log(result.body);
        res.render('moderate', {users:result.body});
      })
});

module.exports = router;

