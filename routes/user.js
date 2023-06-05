const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/users');

router.route('/register')
    .get(userController.renderRegisterPage)
    .post(userController.createUser);

// IMP NOTE FROM SIDHANT YADAV FOR PASSPORT.AUTHENTICATE()
// Since Passport 6, the library decides to reset a new Session after authenticating any user. They do so for security purposes. 
// Therefore our method of keeping the 'returnTo' url doesnt work since the entry in the session gets lost. To get past this we 
// can set the keepSessionInfo as 'true' which will not let Passport delete our session. However, this leads to security issues. 
// Another method to get past this issue can be done via using a chain of middlewares. We can add a middleware before authentication 
// and store the 'returnTo' url in the res.locals and then later use that value from the locals to get back to the required page. 
// This will work because the local memory doesnt get deleted.

router.route('/login')
    .get(userController.renderLoginPage)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), userController.login);

router.get('/logout', userController.logout);

module.exports = router;