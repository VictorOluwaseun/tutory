class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // async
  filter() {
    const queryObj = {
      ...this.queryString
    };

    const excludedFields = ["page", "sort", "limit", "fields"];
    // debugger
    excludedFields.forEach(el => delete queryObj[el]);
    // console.log(queryObj);
    // console.log(queryObj);

    //1b. Adevanced filetering
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b{gte|gt|lte|lt|ne|lt}\b/g, match => `$${match}`);

    console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));
    // this.query = this.query.find();
    // console.log(this.query);
    // let query = Subject.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      console.log(this.queryString.sort);
      const sortBy = this.queryString.sort.split(',').join(" ");
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("surname");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      // console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this.query;
  }

}

module.exports = APIFeatures;


// console.log(queryObj);
// { role: { ne: 'student' } }
// console.log(req.query);
//Project method
// const users = await User.find({
//   role: {
//     $ne: "tutor"
//   }
// });

// .where("role")
// .equals("tutor");

// console.log(users);


// const features =
//   new APIFeatures(
//     User.find());
// // .filter()
// // .sort()
// // .limitFields()
// // .paginate();