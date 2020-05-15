const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./../../models/userModel');

dotenv.config({
  path: './config.env'
});

// const DB = process.env.DATABASE
// .replace(
//     '<PASSWORD>',
//     process.env.DATABASE_PASSWORD
// );

// mongoose
//   .connect(DB, {

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'))
  .catch(e => console.log(e));

// READ JSON FILE
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await User.create(users, {
      validateBeforeSave: false
    });
    console.log('Data successfully loaded!');
    console.log(User);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// const fs = require("fs");
// const usersJSON = require("./usersTemp.json");

// // console.log(users);

// const users = usersJSON.map(el => {
//   const fullName = el.name.split(" ");
//   // console.log(fullName);

//   el.firstName = fullName[0];
//   // console.log(el);
//   if (fullName[2]) {
//     el.surname = fullName[2];
//     el.otherName = fullName[1]
//   } else {
//     el.surname = fullName[1];
//   }
//   return el;
// })

// console.log(users);

// const writeFilePro = (file, data) => new Promise((resolve, reject) => {
//   fs.writeFile(file, data, err => {
//     if (err) reject(err, "=> Could not write file ⚠");
//     resolve("success");
//   })
// });

// let res;
// (async () => {
//   res = await writeFilePro("userss.json", JSON.stringify(users));
// })();
// console.log(res);



// const userss = fs.writeFile("users.json", JSON.stringify(users), err => {
//   return new Promise((res, rej) => {
//     res("success");
//     if (err) {
//       rej(err);
//     }
//   });
// })