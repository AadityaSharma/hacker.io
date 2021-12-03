const express = require('express');
const { get } = require('mongoose');
const router = express.Router();

// import middlewares
const {
	requireSignin,
	authMiddleware,
	adminMiddleware,
} = require('../controllers/auth');

// import from controllers
const { read } = require('../controllers/user');

// routes
router.get('/user', requireSignin, authMiddleware, read);
router.get('/admin', requireSignin, adminMiddleware, read);

module.exports = router;
