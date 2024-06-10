const { comparePassword, hashPassword } = require("../helper/authHelper");
const jwt = require("jsonwebtoken");
const Token = require('../models/tokenModel');
const User =require('../models/userModel')

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, contactNumber } = req.body;

    // Check if the email already exists
    const existEmail = await User.findOne({ where: { email } });
    if (existEmail) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Generate a token (adjust as needed)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Create a new user
    const user = await User.create({
      name,
      contactNumber,
      email,
      password: hashedPassword,
      userName: Math.random().toString(),
    });

    // Save the token to the database
    const tokenDocument = await Token.create({
      token,
      userId: user.id, // Use the generated user ID
    });

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user.id, // Use the generated user ID
        role: user.role,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Confirm email
exports.postEmailConfirmation = (req, res) => {
  const tokenValue = req.params.token;

  Token.findOne({ where: { token: tokenValue } })
    .then((token) => {
      if (!token) {
        return res.status(400).json({ error: "Invalid Token or Token may have expired." });
      }

      User.findOne({ where: { id: token.userId } })
        .then((user) => {
          if (!user) {
            return res.status(400).json({ error: "We are unable to find the valid user for this token." });
          }

          if (user.isVerified) {
            return res.status(400).json({ error: "Email is already verified, login to continue." });
          }

          user.isVerified = true;
          user
            .save()
            .then((user) => {
              if (!user) {
                return res.status(400).json({ error: "Failed to verify your email." });
              }
              res.json({
                message: "Congrats, Your email has been verified. login to continue.",
              });
            })
            .catch((err) => {
              return res.status(400).json({ error: err });
            });
        })
        .catch((err) => {
          return res.status(400).json({ error: err });
        });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};
// Signin
exports.signin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(201).json({ success: false, message: "User not found in the system" });
      }
  
      // Compare the provided password with the stored hashed password
      const isPasswordMatch = await comparePassword(password, user.password);
      if (!isPasswordMatch) {
        return res.status(201).json({ success: false, message: "Password didn't match" });
      }
  
      // Generate a JSON Web Token (JWT) for authentication
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  
      res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
        user: {
          role: user.role,
          name: user.name,
          email: user.email,
          contactNumber: user.contactNumber,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error while logging in",
        error: error.message,
      });
    }
  };
  
exports.userDetails = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      const userDetails = {
        id: user.id,
        role:user.role,
        name: user.name,
        email: user.email,
        contactNumber:user.contactNumber,
        
      };
  
      res.status(200).json({
        success: true,
        message: "User details retrieved successfully",
        user: userDetails,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error while fetching user details",
        error: error.message,
      });
    }
  };
  
   
  // Get all users
  exports.getUsers = async (req, res) => {
    try {
      const users = await User.findAll();
  
      if (!users || users.length === 0) {
        return res.status(201).json({ message: 'No Users found.' });
      }
  
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ message: 'Error while getting the list of users.' });
    }
  };
  
  // Signout
  exports.signout = (req, res) => {
    res.clearCookie('myCookie'); // Adjust as needed for your application
    res.json({ message: "Signout success." });
  };