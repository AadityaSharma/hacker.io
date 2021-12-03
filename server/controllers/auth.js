const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { registerEmailParams } = require('../helpers/email');
const shortId = require('shortid');
const expressJwt = require('express-jwt');

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

exports.register = (req, res) => {
	// console.log('Register Controller', req.body);
	const { name, email, password } = req.body;

	// check if user  exists in our DB
	User.findOne({ email }).exec((err, user) => {
		if (user) {
			return res.status(400).json({
				error: 'Email is taken',
			});
		}

		// Generate token with user name, email and password
		const token = jwt.sign(
			{ name, email, password },
			process.env.JWT_ACCOUNT_ACTIVATION,
			{
				expiresIn: '10m',
			},
		);

		// send email
		const params = registerEmailParams(email, token);

		const sendEmailOnRegister = ses.sendEmail(params).promise();

		sendEmailOnRegister
			.then((data) => {
				console.log('Email submitted to SES', data);
				res.json({
					message: `Email has been sent to ${email}, Follow the instructions to complete your registration`,
				});
			})
			.catch((error) => {
				console.log('SES email on register', error);
				res.json({
					message: `We could not verify your email, please try again.`,
				});
			});
	});
};

exports.registerActivate = (req, res) => {
	const { token } = req.body;
	// console.log(token);
	jwt.verify(
		token,
		process.env.JWT_ACCOUNT_ACTIVATION,
		function (err, decoded) {
			if (err) {
				return res.status(401).json({
					error: 'Expired link. Try again',
				});
			}

			const { name, email, password } = jwt.decode(token);
			const username = shortId.generate();

			User.findOne({ email }).exec((err, user) => {
				if (user) {
					return res.status(401).json({
						error: 'Email is taken',
					});
				}

				// register new user
				const newUser = new User({ username, name, email, password });
				newUser.save((err, result) => {
					if (err) {
						return res.status(401).json({
							error: 'Error saving user in database. Try again.',
						});
					}
					return res.json({
						message: 'Registration success. Please login.',
					});
				});
			});
		},
	);
};

exports.login = (req, res) => {
	const { email, password } = req.body;
	console.table({ email, password });
	User.findOne({ email }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User with this email address doesn't exist. Please register.",
			});
		}

		console.log('Password is:', password);
		// authenticate
		if (!user.authenticate(password)) {
			return res.status(400).json({
				error: "Email and password don't match.",
			});
		}

		// generate token and send to client
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '7d',
		});
		const { _id, name, role } = user;

		return res.json({
			token,
			user: { _id, name, email, role },
		});
	});
};

exports.requireSignin = expressJwt({
	secret: process.env.JWT_SECRET,
	algorithms: ['HS256'],
}); // req.user

exports.authMiddleware = (req, res, next) => {
	const authUserId = req.user._id;
	User.findOne({ _id: authUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: 'User not found',
			});
		}
		req.profile = user;
		next();
	});
};

exports.adminMiddleware = (req, res, next) => {
	const adminUserId = req.user._id;
	User.findOne({ _id: adminUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: 'User not found',
			});
		}

		if (user.role !== 'admin') {
			return res.status(401).json({
				error: 'Admin resource. Access denied',
			});
		}

		req.profile = user;
		next();
	});
};
