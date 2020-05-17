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
  .post(authController.restrictTo("admin", "student"), lessonController.setSubjectId, lessonController.bookLesson);

router.use(authController.restrictTo("admin"));
router
  .route("/:id")
  .get(lessonController.getLesson)
  .patch(lessonController.updateLesson)
  .delete(lessonController.deleteLesson);

module.exports = router;