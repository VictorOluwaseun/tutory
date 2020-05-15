const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcryptjs");

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
  otherName: {
    type: String,
    trim: true,
    minlength: [3, "A name should be at least 3 characters"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Your email is required!"],
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  // uid: {
  //   type: String,
  //   unique: true,
  //   lowercase: true
  // },
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


// userSchema.pre("save", async function (next) {
//   // only run if password was actually modified 
//   if (!this.isModified("password")) return next(); //if password is only modified...

//   this.password = await bcrypt.hash(this.password, 12); //12 is the cost parameter and this can be done in two ways, and the first way will to be manually generating the salt, so that random string basically that is gonna be added to the password and then use that salt here in this hash function. But instead, to make it easier, we can also simple pass a cost parameter into this function here and so that is basically a measure of how CPU intensive this operation will be. And the default value here I believe is 10 but right is a better to actually use 12.

//   //delete the confirm password so as not to be persisted to database
//   this.passwordConfirm = undefined;
//   next();
// });

// userSchema.pre("save", function (next) {
//   if (!this.isModified("password") || this.isNew) return next();
//   //issue: jwt issued b4 time stamp because it is slower to send to database 
//   // So to fix this, 1000 is substracted. So it's one sec in the past
//   this.passwordChangedAt = Date.now() - 1000; //sometimes this causes issues, saving to the database is a bit slower than issuing the JSON web token
//   next();
// });

// userSchema.pre(/^find/, function (next) { //query middleware
//   //this points to the current query
//   this.find({
//     active: {
//       $ne: false
//     }
//   });
//   next();
// });

//instance method : this is the method that is going to be available on all documents
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  //since this is available on all documents, this keyword is pointing to the current document
  // this.password will not be available because it was not selected so that is need for user password
  return await bcrypt.compare(candidatePassword, userPassword); //this returns either true or false
};

//if user has changed password to validate token. JWT timestamp will be needed to be passed here
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  //By default, we will return false.
  //In instance method this keyword always point to current document
  //we need to create a field now in our schema for the data where the password has been changed.
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); // to convert to integer in case of necessity
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp; //100 < 200
  }

  //Password changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  // console.log(resetToken, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;