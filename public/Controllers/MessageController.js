const Message = require("../Models/Message");
const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const ApiFeatures = require("../utils/APIfeatures");

/**===============create Message ==============**/
exports.createMessage = CatchAsync(async (req, res) => {
	const newMessage = await Message.create(req.body);
	res.status(201).json({
		status: "success",
		data: newMessage,
	});
});

/** ========update Message=============**/
exports.updateMessage = CatchAsync(async (req, res, next) => {
	if (!req.params.id) {
		return next(new AppError("No ID provided", 402));
	}
	const newMessage = await Message.findByIdAndUpdate(req.params.id, req.body, {
		runValiators: true,
		new: true,
	});
	res.status(201).json({
		status: "success",
		data: newMessage,
	});
});

/**============ get Messages================**/
exports.getMessage = CatchAsync(async (req, res, next) => {
	const message = await Message.findById(req.params.id);
	if (!message) {
		return next(new AppError(`No records found with ${req.params.id}`, 404));
	}
	res.status(200).json({
		status: "success",
		data: message,
	});
});

/***======  get all Messages  =============**/
exports.getAllMessages = CatchAsync(async (req, res) => {
	const total_message = await Message.find().countDocuments();
	const feature = new ApiFeatures(Message.find(), req.query)
		.filter()
		.sort()
		.paginate(25);

	const current_messages = await feature.query;
	res.status(200).json({
		status: "success",
		total: total_message,
		data: current_messages,
	});
});
