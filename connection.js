const mysql = require("mysql2");

module.exports = mysql.createConnection({
  host: process.env.AWS_MYSQL_HOST || "localhost",
  user: process.env.AWS_MYSQL_USER || "root",
  database: process.env.AWS_MYSQL_DATABASE || "StudentDetails",
  password: process.env.AWS_MYSQL_PASSOWRD || "",
  port: process.env.AWS_MYSQL_PORT || 3306,
});
