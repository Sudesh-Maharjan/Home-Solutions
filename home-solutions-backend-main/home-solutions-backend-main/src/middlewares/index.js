const jwt = require('jsonwebtoken');

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

exports.userMiddleware = (req, res, next) => {
 
  next();
};

exports.adminMiddleware = (req, res, next) => {
console.log(req.user.role)
  if (req.user && req.user.role === 'admin') {
    // User has 'admin' role
    console.log('Admin Access Granted');
    next();
  } else {
    // User does not have 'admin' role
    console.log('Admin Access Denied');
    return res.status(403).json({ message: 'Access Denied' });
  }
};


