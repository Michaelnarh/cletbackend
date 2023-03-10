const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const registrationSchema = mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		phone: { type: String, required: true },
		gender: { type: String, required: true, enum: ["male", "female"] },
		address: { type: String },
		amountPaid: { type: String },
		addedBy: { type: mongoose.Types.ObjectId, ref: "Users" },
		manual: { type: Boolean },
		fullyPaid: { type: Boolean },
		registrationYear: {
			type: mongoose.Types.ObjectId,
			ref: "RegistrationYear",
		},
		paymentStatus: {
			type: Number,
			enum: [-1, 0, 1], //0=pending 1=paid ,-1= cancelled
			default: 1,
		},
		transactionId: { type: String },
	},
	{ timestamps: true }
);

registrationSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Registration", registrationSchema);
