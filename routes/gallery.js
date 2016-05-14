const router = require('express').Router();

router.all('/', (req, res, next) => {
  res.render('gallery', {image_name: ''});
});

router.all('/:image_name', (req, res, next) => {
  res.render('gallery', {image_name: req.params.image_name || ''});
});

module.exports = router;

