module.exports = (obj, ...allowedField) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedField.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};