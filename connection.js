const mysql = require("mysql2");

module.exports = mysql.createConnection({
  host: process.env.AZURE_MYSQL_HOST || "localhost",
  user: process.env.AZURE_MYSQL_USER || "root",
  database: process.env.AZURE_MYSQL_DATABASE || "StudentDetails",
  password: process.env.AZURE_MYSQL_PASSOWRD || "",
  port: process.env.AZURE_MYSQL_PORT || 3306,
});
