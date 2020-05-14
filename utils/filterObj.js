exports.filterObj = (obj, ...allowedField) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedField.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.filterUnwanted = (obj, ...unwanted) => {
  Object.keys(obj).forEach(el => {
    if (unwanted.includes(el)) {
      delete obj[el];
    }
  })
  return obj;
}