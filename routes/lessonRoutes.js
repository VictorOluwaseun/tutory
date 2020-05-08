const express = require("express");
const lessonController = require("../controllers/lessonController");
const authController = require("../controllers/authController");

const router = express.Router({
  mergeParams: true
});

router.use(authController.protect);

router
  .route("/")
  .get(authController.restrictTo("admin"), lessonController.getAllLesson)
  .post(authController.restrictTo("admin", "student"), lessonController.bookLesson);

router
  .route("/:id")
  .get(lessonController.getLesson)
  .patch(authController.restrictTo("admin"), lessonController.updateLesson)
  .delete(authController.restrictTo("admin"), lessonController.deleteLesson);

module.exports = router;