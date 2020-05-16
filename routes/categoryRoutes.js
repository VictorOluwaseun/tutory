const express = require("express");
const catergoryController = require("../controllers/categoryController");
const authController = require("../controllers/authController");
const subjectRouter = require("./subjectRoutes");

const router = express.Router();

router.use("/:categoryId/subjects", subjectRouter);

router.get("/", catergoryController.getAllCategories);

router.use(authController.protect)

router
  .route("/")
  // .get(catergoryController.getAllCategories)
  .post(authController.restrictTo("admin"), catergoryController.createCategory);

router
  .route("/:id")
  .get(catergoryController.getCategory)
  .patch(authController.restrictTo("admin"), catergoryController.updateCategory)
  .delete(authController.restrictTo("admin"), catergoryController.deleteCategory);

module.exports = router;