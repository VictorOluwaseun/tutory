const mongoose = require("mongoose");
const validator = require('validator');
const Subject = require("./subjectModel");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    enum: {
      values: ["primary", "JSS", "SSS"],
      message: "Invalid category name. Category is either primary, JSS or SSS"
    },
    required: [true, "Category name is required!"]
  },
  value: {
    type: Number,
    required: [true, "Category value is required!"],
    enum: {
      values: [1, 2, 3, 4, 5, 6],
      message: "Category value has 1, 2, 3, 4, 5, 6"
    },
    validate: {
      validator: function (el) {
        if (this.name === "primary") return el in [1, 2, 3, 4, 5, 6];
        else if (this.value === "JSS" || this.value === "SSS") return el in [1, 2, 3];
      },
      message: "Invalid class:{{VALUE}}, Please enter a valid category value"
    }
  },
  subjects: [{
    type: mongoose.Schema.ObjectId,
    ref: "Subject"
  }]
});


categorySchema.pre("findOneAndRemove", async function (next) {
  await Subject.deleteMany({
    category: this._id
  });
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;