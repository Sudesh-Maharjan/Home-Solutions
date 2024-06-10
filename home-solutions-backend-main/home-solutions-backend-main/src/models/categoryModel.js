const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: process.env.DIALECT,
    host:process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.MYSQL_DB,
  });


const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  parentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Category', 
      key: 'id', 
    },
  },
}, {
  timestamps: false,

});


module.exports = Category;
