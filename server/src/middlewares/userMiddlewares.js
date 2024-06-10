const jwt = require('jsonwebtoken');
const { expressjwt } = require("express-jwt"); // authorization

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token)

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      console.log(req.user)
      next(); 
    } 
    catch (error) {
      // If token verification fails, it's not valid
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    // If there's no authorization header or token provided
    return res.status(401).json({ message: 'Authorization required.' });
  }
};

exports.requireUser = (req, res, next) => {
    
    if (req.user && req.user.role === 'user') {
        // User has 'user' role
        console.log('User Access Granted');
        next();
      } else {
        // User does not have 'user' role
        console.log('User Access Denied');
        return res.status(403).json({ message: 'User Access Denied' });
      }
};

exports.requireAdmin=(req,res,next)=>{
    expressjwt({
      secret: process.env.JWT_SECRET,
      algorithms: ["HS256"],
      userProperty: 'auth' // auth bata role check garne.
      //algorithms: ['RS256']
    })(req,res,(err)=>{
      if(err){
        return res.status(401).json({error:"Unauthorized: You are not authorized admin."})
      }
      if(req.auth.role=="admin"){
        next()
      } 
      else{
        return res.status(403).json({error:"You are not authorized to access this page."})
      }
    })
  }


