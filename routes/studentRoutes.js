const { Router } = require('express');
const db = require('../connection.js');
const moment = require('moment');

const router = Router();

router.get('/', (req, res) =>{
    res.render('student/login');  
});

router.post('/', (req, res) =>{
    const { rollNo, studentName} = req.body
    console.log(rollNo, studentName);
    let sql = `SELECT * FROM students WHERE roll = ${rollNo} AND name LIKE '${studentName}'`;
    db.query(sql, (err, result) =>{
        if(err) throw err;
        console.log(result, result[0]);
        if(result.length == 1){
            res.render('student/result', {result: result[0], moment: moment});
        }
        else{
            res.render('student/login', {error: 'Wrong Credentials'});
        }
    });  
});

module.exports = router;