const User = require('../models/user');


module.exports.renderRegisterPage = (req, res) => {
    res.render('user/register');
}

module.exports.createUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.logIn(registeredUser, (e) => {
            if (e) return next(e);
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLoginPage = (req, res) => {
    res.render('user/login')
}

module.exports.login = (req, res) => {
    const redirectTo = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    req.flash('success', `Welcome Back ${req.user.username}!`);
    res.redirect(redirectTo);
}

module.exports.logout = (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', 'Successfully Logged Out!')
        res.redirect('/login');
    });
}