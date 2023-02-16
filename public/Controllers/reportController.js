const Registration = require("./../Models/registrationModel");

const CatchAsync = require("./../utils/CatchAsync");

exports.reports = CatchAsync(async (req, res, next) => {
	const query = { manual: true };
	let total_number, total_males, total_females, total_manual_registered;
	total_number = await Registration.find({}).countDocuments();
	total_males = await Registration.find({ gender: "male" }).countDocuments();
	total_females = await Registration.find({
		gender: "female",
	}).countDocuments();
	total_manual_registered = await Registration.find(query).countDocuments();

	res.status(201).json({
		status: "success",
		data: {
			total_females,
			total_males,
			total_number,
			total_manual_registered,
		},
	});
});
