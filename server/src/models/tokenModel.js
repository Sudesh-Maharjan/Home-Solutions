const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: process.env.DIALECT,
    host:process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.MYSQL_DB,
  });
const Token = sequelize.define('Token', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER, // Assuming userId is an integer
    allowNull: false,
    references: {
      model: 'Users', // Replace 'Users' with the actual table name for users
      key: 'id',       // Replace 'id' with the actual primary key of the users table
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    expires: 86400, // Token will expire in seconds (24 hours)
  },
}, {
  timestamps: false, // Disable Sequelize's automatic timestamps
});

module.exports = Token;
