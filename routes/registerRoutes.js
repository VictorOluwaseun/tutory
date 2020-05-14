const express = require("express");
const registerController = require("../controllers/registerController");
const authController = require("../controllers/authController");

const router = express.Router({
  mergeParams: true
});

router.use(authController.protect);

router
  .route("/")
  .get(
    authController.restrictTo("tutor"),
    registerController.getAllRegisters)
  .post(authController.restrictTo("tutor"), registerController.filterBody, registerController.setTutorCategorySubjectId, registerController.createRegister);


router.use(authController.restrictTo("tutor"));


router
  .route("/:id")
  .get(registerController.getRegister)
  .patch(registerController.filterBody, registerController.updateRegister)
  .delete(registerController.deleteRegister);

module.exports = router;