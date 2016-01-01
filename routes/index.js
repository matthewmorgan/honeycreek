const router = require('express').Router();

router.all('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;

