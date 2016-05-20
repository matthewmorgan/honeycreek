const router = require('express').Router();

router.all('/', (req, res, next) => {
  res.render('gallery', {image_name: ''});
});

router.all('/autoplay', (req, res, next) => {
  res.render('gallery', {autoplay: true});
});

module.exports = router;

