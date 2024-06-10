const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: process.env.DIALECT,
    host:process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.MYSQL_DB,
  });
const Contact = sequelize.define('Contact', {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactNumber: {
    type: DataTypes.STRING,
  },
  message: {
    type: DataTypes.TEXT,
  },
  receivedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, 
  },
},{timestamps:false});


// Middleware to format receivedAt field before saving
Contact.beforeCreate((contact, options) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0]; // Get the date portion
  contact.receivedAt = formattedDate; // Update the receivedAt field
});

module.exports = Contact;
