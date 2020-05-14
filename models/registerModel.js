const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  tutor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    default: "5c8a1f292f8fb814b56fa184",
    required: [true, "A tutor must register"]
  },
  qualifications: [String],
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category"
  },
  subject: {
    type: mongoose.Schema.ObjectId,
    ref: "Subject",
    required: [true, "The subject is required!"]
  },
  approved: {
    type: Boolean,
    select: false,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

registerSchema.path("qualifications").required(true, "Please fill in your qualification(s)");

registerSchema.pre(/^find/, function (next) {
  // console.log(this.tutor);
  // this.find({
  //   tutor: this.tutor
  // });

  next();
})

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;

//In a category, nested route