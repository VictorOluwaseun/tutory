const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
// router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);


router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);
// router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(authController.restrictTo("admin"), userController.createUser);

router.get("/tutors", authController.restrictTo("admin"), userController.getAllTutors, userController.getAllUsers);

// router.get("/tutors/:search",
//   authController.restrictTo("admin", "student"),
//   userController.getAllTutors, userController.getAllUsers, userController.searchTutors);


router
  .route("/:id")
// .get(userController.getUser)
// .patch(userController.updateUser)
// .delete(userController.deleteUser);
module.exports = router;