const mongoose = require("mongoose");
const User = require("./userModel");
const AppError = require("../utils/AppError");

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, "Provide the subject name"]
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category"
  },
  tutors: [{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    unique: true
  }],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  slug: String,
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

subjectSchema.pre("save", async function (next) {
  const tutorsPromises = this.tutors.map(async id => await User.findById(id));
  this.tutors = await Promise.all(tutorsPromises);
  const tutorsFilter = this.tutors.filter(el => el.role === "student");
  if (tutorsFilter.length) return next(new AppError("Student can not be a tutor.", 400));
  next();
})
// subjectSchema.pre(/^find/, async function(next) {

//   await User.findById()
// })

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;