const { campgroundSchema, reviewSchema } = require('./schemas');
const expressError = require('./utils/expressError');
const Campground = require('./models/campground')
const Review = require('./models/review')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first.')
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You dont have the permission to change this!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You dont have the permission to change this!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        throw new expressError(error.details.map(el => el.message).join(','), 400)
    } else {
        next();
    }
}


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new expressError(error.details.map(el => el.message), 400);
    } else {
        next();
    }
}