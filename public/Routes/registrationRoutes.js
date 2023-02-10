const express = require("express");
const registrationController = require("../Controllers/registrationController");
const authController = require("../Controllers/authController");
const router = express.Router();
const CatchAsync = require("../utils/CatchAsync");
const Registration = require("../Models/registrationModel");
const RegistrationYears = require("../Models/registrationYears");
const { log } = require("console");

/**=========== Register new user By =============*/

/**=======user registration crud route========== */

router
	.route("/")
	.post(registrationController.createRegistration)
	.get(registrationController.getAllRegistrations);
router
	.route("/:id")
	.get(
		authController.protected,
		authController.restrictTo("admin", "superAdmin", "supervisor"),
		registrationController.getRegistration
	)
	.post(
		authController.protected,
		authController.restrictTo("admin", "superAdmin", "supervisor"),
		registrationController.updateRegistration
	);

module.exports = router;
