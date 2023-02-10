const AppError = require("./AppError");
const handleCastErrorDB = (err) => {
	const message = `invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};
const handleDuplicateFieldDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value ${value}: Please use another value`;
	return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid Data input ${errors.join(
		". "
	)}: Please check input type `;
	return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		//send Error for production
		console.error("Error", err);

		//send response message to user
		res.status(500).json({
			status: "error",
			message: "Something went very wrong!",
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "error";
	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };
		if (error.name === "CastError") error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldDB(error);
		if (error.name === "ValidationError ")
			error = handleValidationErrorDB(error);

		sendErrorProd(error, res);
	}
};
