const mongoose = require("mongoose");
const validator = require('validator');

const userSchema = new mongoose.Schema({
  title: {
    type: String,
    enum: {
      values: ["Mr", "Mrs", "Dr", "Prof"],
      message: "The title is either Mr, Mrs, Dr or Prof"
    }
  },
  surname: {
    type: String,
    trim: true,
    minlength: [3, "A name should be at least 3 characters"],
    required: [true, "Please provide your surname"]
  },
  firstName: {
    type: String,
    trim: true,
    minlength: [3, "A name should be at least 3 characters"],
    required: [true, "Please provide your First Name"]
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  uid: {
    type: String,
    unique: true,
    lowercase: true
  },
  photo: {
    type: String,
    default: "default.jpg"
  },
  role: {
    type: String,
    enum: ["student", "tutor", "admin"],
    default: "student"
  },
  subject: [{
    type: mongoose.Schema.ObjectId,
    ref: "Subject",
    validate: {
      validator: function (el) {
        return this.role === "tutor" || this.role === "admin";
      },
      message: "Student can not add subject"
    }
  }],
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password; //this only works for create and save. Save will also be used for update not like findOne and update
      },
      message: "Passwords are not the same"
    }
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;