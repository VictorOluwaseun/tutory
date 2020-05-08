const express = require("express");
const registerController = require("../controllers/registerController");
const authController = require("../controllers/authController");

const router = express.Router({
  mergeParams: true
});

router.use(authController.protect);

router
  .route("/")
  .get(registerController.getAllRegisters)
  .post(authController.restrictTo("admin"), registerController.createRegister);

router
  .route("/:id")
  .get(registerController.getRegister)
  .patch(authController.restrictTo("admin"), registerController.updateRegister)
  .delete(authController.restrictTo("admin"), registerController.deleteRegister);

module.exports = router;