const router = require('express').Router();

router.all('/', (req, res, next) => {
  res.render('gallery');
});

module.exports = router;

