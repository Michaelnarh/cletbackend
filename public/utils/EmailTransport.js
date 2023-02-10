const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const template = require("./MailTemplate");
dotenv.config();

dotenv.config({ path: __dirname + "./../../.env" });

const sendMail = async (options) => {
	//create a transport
	console.log(process.env.MAIL_PASS);
	var transport = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASS,
		},
		tls: false,
	});

	//define email options
	const mailOptions = {
		from: options.from || "superlax Technologies <superlaxtech@gmail.com>",
		to: options.to,
		subject: options.subject,
		text: options.message,
		html: template(`michael`),
	};

	//send an actual mail
	const res = await transport.sendMail(mailOptions);
	console.log(JSON.stringify(res));
};

const options = {
	to: "michaeltetteh62@gmail.com,superlaxtech@gmail.com",
	subject: "Online Registration Notice",
	message: "Your online registration was successful",
};

// sendMail(options);
// console.log(process.env.OS);

module.exports = sendMail;
