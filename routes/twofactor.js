const router = require('express').Router();
const Duo = require('../private/js/duo');

const ikey = process.env.DUO_I_KEY;
const akey = process.env.DUO_A_KEY;
const skey = process.env.DUO_SECRET_KEY;

router.post('/', (req, res, next) => {
  const sig_request = Duo.sign_request(ikey, skey, akey, req.body.username);
  res.render('twofactor', {sig_request: sig_request, post_action: '/twofactor/verify'});
});

router.post('/verify', (req, res, next) => {
  const sig_response = req.body.sig_response;
  const authenticated_username = Duo.verify_response(ikey, skey, akey, sig_response);
  if (authenticated_username){
    alert("Success!!  Two-factor verification is complete.");
  }
});

module.exports = router;