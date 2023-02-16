const Registration = require("../Models/registrationModel");
const RegistrationYears = require("../Models/registrationYears");
const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const ApiFeatures = require("../utils/APIfeatures");

/**===============create registration ==============**/
exports.createRegistration = CatchAsync(async (req, res) => {
	const program = await RegistrationYears.findOne(
		{},
		{},
		{ sort: { createdAt: -1 } }
	);
	req.body.registrationYear = program?._id;
	const newRegistration = await Registration.create(req.body);
	res.status(201).json({
		status: "success",
		data: newRegistration,
	});
});
exports.adminRegistration = CatchAsync(async (req, res) => {
	const program = await RegistrationYears.findOne(
		{},
		{},
		{ sort: { createdAt: -1 } }
	);
	req.body.registrationYear = program?._id;

	if (req.body.addedBy) {
		req.body.manual = true;
	}
	if (!req.body.fullyPaid || req.body.fullyPaid === "false") {
		req.body.paymentStatus = 0;
	}

	req.body.manual = true;
	const newRegistration = await Registration.create(req.body);
	res.status(201).json({
		status: "success",
		data: newRegistration,
	});
});

/** ========update registration =============**/
exports.updateRegistration = CatchAsync(async (req, res, next) => {
	if (!req.params.id) {
		return next(new AppError("No ID provided", 402));
	}
	if (req.body.fullyPaid === "true" || req.body.fullyPaid) {
		req.body.paymentStatus = 1;
	}
	console.log(req.body);
	if (req.body.fullyPaid === "false" || !req.body.fullyPaid) {
		req.body.paymentStatus = 0;
	}

	const newRegistration = await Registration.findByIdAndUpdate(
		req.params.id,
		req.body,
		{
			runValiators: true,
			new: true,
		}
	);
	res.status(201).json({
		status: "success",
		data: newRegistration,
	});
});

/**============ get registration ================**/
exports.getRegistration = CatchAsync(async (req, res, next) => {
	const registered = await Registration.findById(req.params.id);
	if (!registered) {
		return next(new AppError(`No records found with ${req.params.id}`, 404));
	}
	res.status(200).json({
		status: "success",
		data: registered,
	});
});

/***======  get all Registrations  =============**/

exports.getAllRegistrations = CatchAsync(async (req, res) => {
	const total_registered = await Registration.find().countDocuments();

	const feature = new ApiFeatures(Registration.find(), req.query)
		.filter()
		.sort()
		.paginate(25);

	const current_registrations = await feature.query;
	res.status(200).json({
		status: "success",
		total: total_registered,
		data: current_registrations,
	});
});

exports.getManualRegistered = CatchAsync(async (req, res) => {
	const registered = await Registration.find({ manual: true });

	res.status(200).json({
		status: "success",
		data: registered,
	});
});
