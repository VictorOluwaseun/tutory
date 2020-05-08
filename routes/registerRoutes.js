const express = require("express");
const registerController = require("../controllers/registerController");
const authController = require("../controllers/authController");

const router = express.Router({
  mergeParams: true
});

router.use(authController.protect);

router.use(authController.restrictTo("tutor"));

router
  .route("/")
  .get(registerController.getAllRegisters)
  .post(registerController.createRegister);

router
  .route("/:id")
  .get(registerController.getRegister)
  .patch(registerController.updateRegister)
  .delete(registerController.deleteRegister);

module.exports = router;