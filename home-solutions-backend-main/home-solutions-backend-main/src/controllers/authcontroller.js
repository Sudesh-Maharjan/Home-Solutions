const { hashSync } = require("bcrypt");
const { hashPassword, comparePassword } = require("../Helpers/authHelpers");
const userModel = require("../models/UserModel1");
const JWT = require("jsonwebtoken");

exports.registercontroller = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    // validation
    if (!name) {
      return res.send({success:false,
         message: "name is required" });
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    });
    const regsiteruser = await user.save();
    return res.status(201).send({
      success: true,
      message: "User Regsitered Successfully",
      regsiteruser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error",
      error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({message: "password is required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "email not found",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }
    // token
    // const token=await JWT.sign({._id:user._id},process.env.JWT_SECRET)
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: error,
    });
  }
};

exports.test = (req, res) => {
  res.send("protected");
};
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role != 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next()
    }
  } catch (error) {
    console.log(error);
  }
};
