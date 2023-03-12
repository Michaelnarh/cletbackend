const express = require("express");
const registrationController = require("../Controllers/registrationController");
const authController = require("../Controllers/authController");
const searchController = require("../Controllers/searchController");
const reportController = require("../Controllers/reportController");
const router = express.Router();

/**=========== Register new user By =============*/

router.get("/search/:searchBy/:search", searchController.search);
router.get("/reports", reportController.reports);

/**=======user registration crud route========== */
router.post("/create", registrationController.adminRegistration);
router.get("/manual", registrationController.getManualRegistered);

router
	.route("/")
	.post(registrationController.createRegistration)
	.get(registrationController.getAllRegistrations);
router
	.route("/:id")
	.get(
		// authController.protected,
		// authController.restrictTo("admin", "superAdmin", "supervisor"),
		registrationController.getRegistration
	)
	.post(
		// authController.protected,
		// authController.restrictTo("admin", "superAdmin", "supervisor"),
		registrationController.updateRegistration
	)
	.delete(registrationController.deleteRegistration);

module.exports = router;
