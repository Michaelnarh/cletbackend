const Registration = require("../Models/registrationModel");
const CatchAsync = require("../utils/CatchAsync");
exports.search = CatchAsync(async (req, res, next) => {
	let result;
	const { searchBy, search } = req.params;
	console.log(req.params);
	if (searchBy === "email") {
		result = await Registration.findOne({ email: search });
	}
	if (searchBy === "phone") {
		result = await Registration.findOne({ phone: `${search.trim()}` });
	}

	res.status(201).json({
		status: "success",
		data: result,
	});
});
