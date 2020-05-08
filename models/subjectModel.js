const mongoose = require("mongoose");

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
    ref: "User"
  }],
  register: [{
    registeredTutors: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    qualifications: [String],
    createdAt: {
      type: Date,
      default: Date.now
    },
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

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;