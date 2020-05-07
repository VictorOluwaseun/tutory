const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({

});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;