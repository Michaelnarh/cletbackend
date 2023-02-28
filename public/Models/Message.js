const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const registrationSchema = mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		fullName: { type: String, required: true },
		phone: { type: String, required: true },
		message: { type: String },
		read: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

registrationSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Message", registrationSchema);
