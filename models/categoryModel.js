const mongoose = require("mongoose");
const validator = require('validator');
const Subject = require("./subjectModel");
const AppError = require("../utils/appError");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    enum: {
      values: ["primary", "JSS", "SSS"],
      message: "Invalid category name. Category is either primary, JSS or SSS (Take note of the case i.e. JSS not jss)"
    },
    required: [true, "Category name is required!"],
  },
  value: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6],
    // enum: {
    //   value: [1, 2, 3, 4, 5, 6],
    //   message: "Category value has 1, 2, 3, 4, 5, 6"
    // },
    validate: {
      validator: function (el) {
        if (this.name === "primary") return el in [1, 2, 3, 4, 5, 6, 7]; //The validation stops at Array.length-2 so an extra value 7 is added.
        else if (this.name === "JSS" || this.name === "SSS") return el in [1, 2, 3, 4];
      },
      message: "Invalid class: {VALUE}, Please enter a valid category value"
    },
    required: [true, "Category value is required!"]
  },
  classValue: {
    type: String,
    unique: true
  },
  subjects: [{
    type: mongoose.Schema.ObjectId,
    ref: "Subject"
  }]
});

//Pre save hook
// categorySchema.pre("")
// categorySchema.path()

// categorySchema.path("classValue").index({
//   unique: true
// });

categorySchema.pre("save", async function (next) {
  this.classValue = this.name + "-" + this.value;
  const c = await this.constructor.findOne({
    classValue: this.classValue
  });
  if (c) return next(new AppError("Category already created!", 400));
  next();
});


//Query Middleware

categorySchema.pre(/^find/, function (next) {
  this.find().select("-__v");
  next();
})

categorySchema.pre("findOneAndRemove", async function (next) {
  await Subject.deleteMany({
    category: this._id
  });
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;