const bcrypt =require("bcrypt");
exports.hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    // const salt =await bcrypt.genSalt(saltRounds); // Generate a salt
    const hashedPassword =await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } 
  catch (error) {
    console.log(error);
  }
};

exports.comparePassword = async (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};