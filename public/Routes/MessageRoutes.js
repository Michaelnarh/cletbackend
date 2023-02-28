const express = require("express");
const messsageController = require("../Controllers/MessageController");
const router = express.Router();

/**=========== Register new user By =============*/

/**=======user messages crud routes========== */

router
	.route("/")
	.post(messsageController.createMessage)
	.get(messsageController.getAllMessages);
router
	.route("/:id")
	.get(
		// authController.protected,
		// authController.restrictTo("admin", "superAdmin", "supervisor"),
		messsageController.getMessage
	)
	.post(
		// authController.protected,
		// authController.restrictTo("admin", "superAdmin", "supervisor"),
		messsageController.updateMessage
	);

module.exports = router;
