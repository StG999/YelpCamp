const express = require('express');
const Router = express.Router();
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage })

const catchAsync = require('../utils/catchAsync');

const campgroundController = require('../controllers/campgrounds');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

Router.get('/', campgroundController.index);

Router.route('/new')
    .get(isLoggedIn, campgroundController.renderNewForm)
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundController.createCampground));

Router.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundController.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground));

Router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm));

module.exports = Router;