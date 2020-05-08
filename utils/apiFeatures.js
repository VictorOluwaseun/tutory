class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = {
      ...this.queryString
    };
    const excludedFields = ["page", "sort", "limit", "fields"];

    excludedFields.forEach(el => delete queryObj[el]);
    // console.log(queryObj);

    //1b. Adevanced filetering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b{gte|gt|lte|lt}\b/g, match => `$${match}`);

    // console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr));
    return this;
  }
}

module.exports = APIFeatures;