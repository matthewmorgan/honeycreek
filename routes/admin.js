'use strict';

const router = require('express').Router();

router.post('/login', (req, res, next) => {
  const payload = req.body;
  if(payload.username === 'mail.matt.morgan@gmail.com' && payload.password === 'morgan'){
    req.password = undefined;

    router.post('/twofactor', (req, res, next, err) => {
      if (err) {
        res.send(500);
      }
    });

  } else {
    res.send(403);
  }
});

module.exports = router;