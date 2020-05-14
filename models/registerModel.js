const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  tutor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A tutor must register"]
  },
  qualifications: [String],
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category"
  },
  subject: [{
    type: mongoose.Schema.ObjectId,
    ref: "Subject",
    required: [true, "The subject is required!"]
  }],
  // approved: {
  //   type: Boolean,
  //   default: false
  // },
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
  this.populate({
    path: "tutor",
    select: "firstName surname"
  })

  next();
})

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;

//In a category, nested route