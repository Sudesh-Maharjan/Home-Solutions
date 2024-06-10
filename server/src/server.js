const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const cors=require('cors')
const morgan= require('morgan')

const db=require('../src/db/connection')
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  dialect: db.dialect,
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const contactRoute=require('./routes/contactRoutes')
const productRoute= require('./routes/productRoutes')
const categoryRoute =require('./routes/categoryRoutes')
const blogRoute=require('./routes/blogRoutes')
const userRoute=require('./routes/userRoutes')

app.use('/api', contactRoute)
app.use('/api', productRoute)
app.use('/api', categoryRoute)
app.use('/api', blogRoute)
app.use('/api', userRoute)
app.use('/public',express.static(path.join(__dirname,'uploads')))


app.get('/api', (req,res)=>{
    res.status(200).json({success: 1, message:"This is suwas server route"})
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
