const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: process.env.DIALECT,
    host:process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.MYSQL_DB,
  });
const Category =require('../models/categoryModel')

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(5000),
    allowNull: false,
    trim: true,
  },
  offers: {
    type: DataTypes.INTEGER,
  },
  productPictures: {
    type: DataTypes.JSON,
  },
 

}, {
  timestamps: true,
  updatedAt: 'updatedAt',
 createdAt:'createdAt'
});

// Define associations
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category',
  onDelete: 'CASCADE',
});

// Product.belongsTo(Brand, {
//   foreignKey: 'brandId',
//   as: 'brand',
//   onDelete: 'SET NULL', // Define the appropriate action on brand deletion
// });
// Product.hasMany(Review, {
//   foreignKey: 'productId',
//   as: 'reviews',
//   onDelete: 'CASCADE',
// });

module.exports = Product;
