const mongoose = require("mongoose");

const loggedSchema = mongoose.Schema(
	{
		loggedInTime: { type: Date },
		user: {
			id: { type: mongoose.Schema.Types.ObjectId },
			email: { type: String },
			username: { type: String },
		},
		location: { type: String },
		machineType: { type: String }, // os
		computerName: { type: String }, // computername
	},
	{ timestamps: true }
);

module.exports = mongoose.model("UserLogs", loggedSchema);
