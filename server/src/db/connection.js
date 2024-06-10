
module.exports = {
    database:process.env.MYSQL_DB,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT, 
  };
