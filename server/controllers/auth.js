const User = require("../models/user");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

exports.register = (req, res) => {
	// console.log('Register Controller', req.body);
	const { name, email, password } = req.body;

	// check if user  exists in our DB
	User.findOne({ email }).exec((err, user) => {
		if (user) {
			return res.status(400).json({
				error: "Email is taken",
			});
		}

		// Generate token with user name, email and password
		const token = jwt.sign(
			{ name, email, password },
			process.env.JWT_ACCOUNT_ACTIVATION,
			{
				expiresIn: "10m",
			}
		);
    
    // send email
		const params = {
			Source: process.env.EMAIL_FROM,
			Destination: {
				ToAddresses: [email],
			},
			ReplyToAddresses: [process.env.EMAIL_TO],
			Message: {
				Body: {
					Html: {
						Charset: "UTF-8",
						/* inline-html */
						Data: `<html>
              <body>
                <h1>Verify your email address</h1>
                <p>Please use the following link to complete your registration:</p>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
              </body>
            </html>`,
					},
				},
				Subject: {
					Charset: "UTF-8",
					Data: "Complete your registration",
				},
			},
		};

		const sendEmailOnRegister = ses.sendEmail(params).promise();

		sendEmailOnRegister
			.then((data) => {
				console.log("Email submitted to SES", data);
				res.send("Email sent");
			})
			.catch((error) => {
				console.log("SES email on register", error);
				res.send("Email failed");
			});
	});
};
