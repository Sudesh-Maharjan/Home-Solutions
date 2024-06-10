const JWT = require("jsonwebtoken");
const UserModel1 = require("../models/UserModel1");

exports.requireSignin = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  } 
};
// admin access
