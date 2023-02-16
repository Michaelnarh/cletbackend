const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const registrationYearSchema = mongoose.Schema(
	{
		programmeName: { type: String, required: true },
		programmeDate: { type: String },
		episode: { type: String },
		amountPayable: { type: Number },
		slug: { type: String, unique: true },
	},
	{ timestamps: true }
);

let RegistrationYears = mongoose.model(
	"RegistrationYears",
	registrationYearSchema
);

//plugin the unique validator
registrationYearSchema.plugin(uniqueValidator);
RegistrationYears.exists({ slug: "quick_book_and_accounting_software" }).then(
	(result) => {
		if (!result) {
			RegistrationYears.insertMany([
				{
					programmeName: "Quick Book and Accounting Software",
					programmeDate: "23-37th March 2021",
					episode: "Episode 1",
					slug: "quick_book_and_accounting_software",
				},
			])
				.then({})
				.catch((e) => {
					console.log(e);
				});
		}
	}
);

module.exports = RegistrationYears;
