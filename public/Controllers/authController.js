const { promisify } = require("util");
const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const sendMail = require("./../utils/EmailTransport");
const sharp = require("sharp");
const multer = require("multer");
const slugify = require("slugify");
const fs = require("fs");
const CatchAsync = require("../utils/CatchAsync");

const multerStorage = multer.memoryStorage({
	destination: (req, file, cb) => {},
}); //create memorystorage for sharp resizing

const multerFilter = async (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	}
	return new AppError("image format not supported", 400); // handle error when type is incorrect
};
exports.resizeImage = async (req, res, next) => {
	if (!req.file || req.file === undefined) return next();
	const slug = await slugify(req.body.username, { lower: true });

	req.body.slug = slug;
	const profile_image = `profile-${slug}-${Date.now()}.jpeg`;
	let dir = `public/images/users`;

	//create directory is it does not exist!
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	if (req.file.buffer) {
		await sharp(req.file.buffer)
			.resize(500, 500)
			.toFormat("jpeg")
			.jpeg({ quality: 90 })
			.toFile(`${dir}/${profile_image}`);
		req.body.image = profile_image;
	}

	next();
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

//upload profile image.
exports.uploadImage = upload.single("image");

const SignInToken = (id) => {
	if (id) {
		return jwt?.sign({ id }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN,
		});
	} else {
		return null;
	}
};
const cookieOptions = {
	expires: new Date(Date.now + process.env.JWT_EXPIRES_IN * 24 * 3600 * 1000),
	// secure: true
	httpOnly: true,
};
exports.SignUp = async (req, res) => {
	try {
		const newUser = await User.create(req.body);

		const token = SignInToken(newUser?._id);

		newUser.save();

		const user = newUser.toObject();
		delete user.password;
		delete user.passwordConfirm;
		res.status(201).json({
			status: "success",
			user: user,
			access_token: token,
		});
	} catch (err) {
		res.status(500).json({
			message: err.message,
		});
	}
};

exports.LogIn = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			throw Error("input Email and  password");
		}
		const user = await User.findOne({ email }).select("+password");
		let correct;
		if (user) {
			correct = await user.correctPassword(password, user.password);
		}

		if (!user || !correct) {
			// throw Error("Incorrect Email or Password ");
			return next(new AppError("Incorrect Email or Password", 401));
		}
		//signin token by the user Dr. Isaac Kingsley Amponsah Dr. Emmanuel Kwesi Arthur
		let access_token;
		try {
			access_token = SignInToken(user._id);
		} catch (err) {
			return next(new AppError("Sign in Token Error", 401));
		}

		const u = user.toObject();
		u.isLoggedIn = true;
		delete u.password;
		// res.cookie("jwt", access_token, cookieOptions);

		res.status(200).json({
			status: "success",
			user: u,
			access_token,
		});
	} catch (err) {
		res.status(500).json({
			status: "failed",
			message: err.message,
		});
	}
};

exports.forgotPassword = CatchAsync(async (req, res, next) => {
	//1. Get user from the request body

	const user = User.findOne({ email: req.body.email });

	if (!user) {
		return next(
			new AppError(
				`This email ${req.body.email} was not found check up again`,
				400
			)
		);
	}

	//2. create a random hascode for the users

	const resetToken = user.createPasswordResetToken();

	await user.save({ validateBeforeSave: false });

	//3. Send it the users email
	const resetURL = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/users/resetPassword/${resetToken}`;

	const message = `You made request for password reset ? Click on the this link to reset your password ${resetURL}. if you didn't request this, please ignore this email!`;

	const options = {
		to: user.email,
		subject: "Password Reset Request, valid in 15mins",
		message: message,
	};

	try {
		const res = await sendMail(options);
		res.status(200).json({
			status: "success",
			message: `Password Reset Token sent Sucessfully, check your email`,
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordExpiresAt = undefined;
	}
});

exports.resetPassword = (req, res) => {};

//.........................................................//
//..........definition of Restriction and protection.......//
//.........................................................//

exports.protected = async (req, res, next) => {
	let token;
	let currentUser;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];

		//verify jwt token
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
		console.log(req.cookie.jwt);
	}
	if (!token) {
		// console.log("here");
		return next(new AppError("Acess Denied You are not logged In", 401));
	}
	//verify token
	let decoded;
	try {
		decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
		// console.log(decoded);
	} catch (err) {
		return next(new AppError("Token verification Error, Login Again", 401));
	}

	if (!decoded) {
		return next(new AppError("Token verification Error, Login Again", 401));
	}

	currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(new AppError("You are not logged in", 400));
	}

	//check if the password has been change ?
	// console.log(currentUser);
	if (!currentUser.passwordChangedAt) {
		req.user = currentUser;

		next();
	} else {
		if (currentUser?.passwordChanged(decoded.iat)) {
			return next(
				new AppError("Password has recently been changed, log in again", 400)
			);
		}
	}
};

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (roles.includes(req?.user?.role)) {
			next();
		} else {
			next(new AppError("You are not permitted for this operation", 401));
		}
	};
};

exports.getAllUsers = async (req, res) => {
	const users = await User.find();
	res.status(200).json({
		status: "success",
		users,
	});
};
exports.getUser = async (req, res) => {
	const user = await User.findById(req.params.id);
	res.status(200).json({
		status: "success",
		user,
	});
};

exports.updateUser = async (req, res, next) => {
	try {
		req.body.slug = slugify(req.body.username, { lower: true });

		if (req.body.image === "undefined") {
			delete req.body.image;
		}
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			runValidators: true,
			new: true,
		});
		res.status(200).json({
			status: "success",
			user,
		});
	} catch (err) {
		return next(AppError(err.message, 401));
	}
};
