const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  tutor: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  qualifications: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category"
  },
  subject: {
    type: mongoose.Schema.ObjectId,
    ref: "Subject"
  },
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

registerSchema.pre(/^find/, function (next) {
  this.find({
    tutor: this.tutor
  });
  next();
})

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;