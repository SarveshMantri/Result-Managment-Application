const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const session = require('express-session');
const {v4: uuidv4} = require('uuid');

const app = express();

// register view engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use( bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//session
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));


app.get("/", (req, res) => {
    res.render('index');
});

// Configuring Routes
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
app.use("/student",studentRoutes);
app.use("/teacher",teacherRoutes);


// Connection to Mysql
const db = require('./connection.js');

db.connect((err) =>{
    if(err){
        console.log(err);
    }
    else{
        console.log('Mysql Connected');
    }
});


// create DB
// app.get('/createdb', (req, res) =>{
//     let sql = 'CREATE DATABASE StudentDetails';
//     db.query(sql, (err, result) =>{
//         if(err) throw err;
//         console.log(result);
//         res.send('Database created');
//     });
// });


app.listen(3000, ()=> {
    console.log("Server is running");
});

// 404 page  
app.use((req, res) => {
    res.status(404).render('404', { title: '404'});
});