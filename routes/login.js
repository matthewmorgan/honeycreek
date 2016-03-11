const app = require('express');
const router = app.Router();

const Duo = require('../private/js/duo');

const ikey = process.env.DUO_I_KEY;
const akey = process.env.DUO_A_KEY;
const skey = process.env.DUO_SECRET_KEY;

router.get('/', (req, res, next) => {
  res.render('login');
});

router.post('/', (req, res, next) => {
  const payload = req.body;
  if(isLoginValid(payload.username, payload.password)){
    req.body.password = undefined;
    const sig_request = Duo.sign_request(ikey, skey, akey, req.body.username);
    res.json(sig_request);
  } else {
    res.send(403);
  }
});

const validCredentials = {
  'mail.matt.morgan@gmail.com': 'morgan',
  'salmquist@hc.wash.k12.mi.us': 'almquist'
};

function isLoginValid(user, pass){
  console.log('login valid? ', validCredentials[user] === pass);
  return validCredentials[user] === pass;
}

module.exports = router;