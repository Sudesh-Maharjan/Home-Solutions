
const { comparePassword, hashPassword } = require("../../Helper/authHelper");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, contactNumber } = req.body;

    // Check if the email already exists
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already registered." });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      contactNumber,
      email,
      password: hashedPassword,
      role:'admin',
      userName: Math.random().toString(), // Generate a random userName (consider using a more robust method)
    });

    // Save the user to the database
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Admin created successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found in the system" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Password didn't match" });
    }

    // Generate a JSON Web Token (JWT) for authentication
    if(user.role==='admin'){
        const token = jwt.sign({ _id: user._id,role:user.role }, process.env.JWT_SECRET);
        res.status(200).json({
          success: true,
          message: "Login Successful",
          token,
          user: {
            _id:user._id,
            role:user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            contactNumber: user.contactNumber,
          },
        });
    }
   
    console.log(`password is ${password}`);
    console.log(`user.password is ${user.password}`);
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Error while logging in",
        error: error.message,
      });
  }
};



