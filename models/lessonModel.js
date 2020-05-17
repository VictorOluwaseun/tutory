const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "A lesson must belong to category"]
  },
  subject: { //Parent Referencing
    type: mongoose.Schema.ObjectId,
    ref: "Subject",
    required: [true, "A lesson must belong to a subject"]
  },
  tutor: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  name: {
    type: String,
    trim: true,
    minlength: [3, "A lesson name must have more than or equal to 3 characters"],
    required: [true, "A lesson must have a name known as topic"]
  },
  body: {
    type: String,
    trim: true,
    // minlength: [20, "A lesson body must have more than or equal to 3 characters"],
    // required: [true, "A lesson must have a body"]
  },
  bookedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;