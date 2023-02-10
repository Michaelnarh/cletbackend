const mongoose = require("mongoose");
const crypto = require("crypto");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
	{
		username: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		role: {
			type: String,
			enum: ["user", "maintainer", "supervisor", "admin", "superAdmin"],
			default: "user",
		},
		password: { type: String, required: true, min: 8, select: false },
		passwordConfirm: { type: String, required: true, min: 8, select: false },
		passwordChangedAt: {
			type: Date,
			default: null,
		},
		passwordResetToken: { type: String, default: null },
		passwordExpiresAt: { type: Date, default: null },
		isLoggedIn: { type: Boolean, default: false },
		lastLoggedIn: { type: Date },
		image: { type: String },
	},
	{ timestamps: true }
);
userSchema.plugin(uniqueValidator);

userSchema.pre("save", async function (next) {
	// console.log("on pre save");
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
	// this.passwordConfirm = undefined;
	next();
});
userSchema.methods.correctPassword = async (canPass, userPass) => {
	return await bcrypt.compare(canPass, userPass);
};

userSchema.methods.passwordChanged = async (jwtTimeStamp) => {
	if (this.passwordChangedAt) {
		const pwdChangeAtTime = await parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);

		return pwdChangeAtTime > jwtTimeStamp;
	}

	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.passwordExpiresAt = Date.now + 15 * 60 * 1000;

	return resetToken;
};

let User = mongoose.model("User", userSchema);
User.exists({ email: "Admin@gmail.com" }).then((result) => {
	if (!result) {
		User.insertMany([
			{
				username: "michael narh",
				email: "Admin@gmail.com",
				password: `$2a$12$1ncp/8WGWxXp4L9f9yEff.AlSdTtPVDst34Uwom6CP7Te7t.LEKyO`,
				passwordConfirm: `$2a$12$1ncp/8WGWxXp4L9f9yEff.AlSdTtPVDst34Uwom6CP7Te7t.LEKyO`,
				role: "superAdmin",
			},
			{
				username: "clertAdmin",
				email: "clertAdmin@gmail.com",
				password: `$2a$12$2SYZIsURiQv0G6ed66TnI.Y/BZEAoJEtQr2er1sKAptjBxs2aq7Q6`,
				passwordConfirm: `$2a$12$2SYZIsURiQv0G6ed66TnI.Y/BZEAoJEtQr2er1sKAptjBxs2aq7Q6
				`,
				role: "admin",
			},
			{
				username: "emmanuel",
				email: "emmascopee71@gmail.com",
				password: `$2a$12$2SYZIsURiQv0G6ed66TnI.Y/BZEAoJEtQr2er1sKAptjBxs2aq7Q6`,
				passwordConfirm: `$2a$12$2SYZIsURiQv0G6ed66TnI.Y/BZEAoJEtQr2er1sKAptjBxs2aq7Q6
				`,
				role: "admin",
			},
		])
			.then({})
			.catch((e) => {
				console.log(e);
			});
	}
});

module.exports = User;
