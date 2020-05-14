const mongoose = require("mongoose");
const slugify = require("slugify");
const User = require("./userModel");
const AppError = require("../utils/AppError");

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    unique: false,
    trim: true,
    required: [true, "Provide the subject name"]
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category"
  },

  // tutors: [{
  //   type: mongoose.Schema.ObjectId,
  //   ref: "User"
  // }],
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

subjectSchema.index({
  name: 1,
  category: 1
}, {
  unique: true
});

//Virtual Populate
subjectSchema.virtual("tutors", {
  ref: "Register",
  foreignField: "subject",
  localField: "_id"
})

subjectSchema.pre("save", async function (next) {
  const tutorsPromises = this.tutors.map(async id => await User.findById(id));
  this.tutors = await Promise.all(tutorsPromises);
  const tutorsFilter = this.tutors.filter(el => el.role === "student");
  if (tutorsFilter.length) return next(new AppError("Student can not be a tutor.", 400));
  next();
});

subjectSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true
  });
  next();
});

subjectSchema.pre(/^find/, async function (next) {
  this.find().select("-__v");
  next();
});

subjectSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "-subjects"
  });
  next();
});



const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;