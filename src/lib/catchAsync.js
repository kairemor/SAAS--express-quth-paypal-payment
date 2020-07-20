
/*
  high order function to catch error
  for a function  
*/
const catchAsync = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};
export default catchAsync;
