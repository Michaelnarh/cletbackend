const Program = require("../Models/registrationYears");
const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const ApiFeatures = require("../utils/APIfeatures");

/**===============create program ==============**/
exports.createProgram = CatchAsync(async (req, res) => {
	const newProgram = await Program.create(req.body);
	res.status(201).json({
		status: "success",
		data: newProgram,
	});
});

/** ========update Program =============**/
exports.updateProgram = CatchAsync(async (req, res, next) => {
	if (!req.params.id) {
		return next(new AppError("No ID provided", 402));
	}
	const newProgram = await Program.findByIdAndUpdate(req.params.id, req.body, {
		runValiators: true,
		new: true,
	});
	res.status(201).json({
		status: "success",
		data: newProgram,
	});
});

/**============ get Program ================**/
exports.geProgram = CatchAsync(async (req, res, next) => {
	const program = await Program.findById(req.params.id);
	if (!program) {
		return next(new AppError(`No records found with ${req.params.id}`, 404));
	}
	res.status(200).json({
		status: "success",
		data: program,
	});
});

/***======  get all Program  =============**/

exports.getAllProgram = CatchAsync(async (req, res) => {
	const total_program = await Program.find().countDocuments();

	const feature = new ApiFeatures(Program.find(), req.query)
		.filter()
		.sort()
		.paginate(25);

	const current_registrations = await feature.query;
	res.status(200).json({
		status: "success",
		total: total_program,
		data: current_registrations,
	});
});

exports.getManualRegistered = CatchAsync(async (req, res) => {
	const registered = await Program.find({ manual: true });

	res.status(200).json({
		status: "success",
		data: registered,
	});
});
