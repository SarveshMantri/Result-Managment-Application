const { Router } = require("express");

const db = require("../connection.js");
const moment = require("moment");

const { check, validationResult } = require("express-validator");

const router = Router();

router.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("./");
  } else {
    res.render("teacher/login", { error: "" });
  }
});

router.get("", (req, res) => {
  if (req.session.user) {
    var passedVariable = req.query.valid;
    let sql = "SELECT * FROM students ORDER BY roll";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.render("teacher/view", {
        results: results,
        passedVariable: passedVariable,
        moment: moment,
      });
    });
  } else {
    res.redirect("login");
  }
});

router.post("/login", (req, res) => {
  const password = req.body.password;
  if (password === "Nodejs") {
    req.session.user = "teacher";
    res.redirect("./");
  } else {
    res.render("teacher/login", { error: "Please Enter Correct Password" });
  }
});

router.get("/add", (req, res) => {
  if (req.session.user) {
    res.render("teacher/addstudent");
  } else {
    res.redirect("./");
  }
});

router.post(
  "/add",
  [
    check("roll")
      .notEmpty()
      .withMessage("Roll no. cannot be empty")
      .isNumeric()
      .withMessage("Roll no. should be an integer"),
    check("name")
      .notEmpty()
      .withMessage("Name cannot be empty")
      .isString()
      .withMessage("Name should be a string"),
    check("dob")
      .notEmpty()
      .withMessage("Date cannot be empty")
      .isDate()
      .withMessage("Date should be of type DATE"),
    check("score")
      .notEmpty()
      .withMessage("Score cannot be empty")
      .isNumeric()
      .withMessage("Score should be an integer"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.errors);
      res.render("teacher/addstudent", { errors: errors.errors });
    } else {
      const { roll, name, dob, score } = req.body;
      let sql = `SELECT roll FROM students WHERE roll = ${roll}`;
      db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          var errors = [{ msg: "Roll Number already exist" }];
          res.render("teacher/addstudent", { errors: errors });
        } else {
          let s = { roll: roll, name: name, dob: dob, score: score };
          let add = "INSERT INTO students SET ?";
          db.query(add, s, (err) => {
            if (err) throw err;
            const str = `Record added successfully`;
            res.redirect("./?valid=" + str);
          });
        }
      });
    }
  }
);

router.get("/edit/:roll", (req, res) => {
  if (req.session.user) {
    const { roll } = req.params;
    console.log(roll);
    let sql = `SELECT * FROM students WHERE roll = ${roll}`;
    db.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length == 1) {
        res.render("teacher/edit", { details: result[0], moment: moment });
      } else {
        const str = "Record does not exist";
        res.redirect("../?valid=" + str);
      }
    });
  } else {
    res.redirect("../");
  }
});

router.post(
  "/edit/:rollno",
  [
    check("roll")
      .notEmpty()
      .withMessage("Roll no. cannot be empty")
      .isNumeric()
      .withMessage("Roll no. should be an integer"),
    check("name")
      .notEmpty()
      .withMessage("Name cannot be empty")
      .isString()
      .withMessage("Name should be a string"),
    check("dob")
      .notEmpty()
      .withMessage("Date cannot be empty")
      .isDate()
      .withMessage("Date should be of type DATE"),
    check("score")
      .notEmpty()
      .withMessage("Score cannot be empty")
      .isNumeric()
      .withMessage("Score should be an integer"),
  ],
  (req, res) => {
    const { rollno } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const str = "Update Failed: Invalid Data";
      res.redirect("../?valid=" + str);
    } else {
      const { roll, name, dob, score } = req.body;
      let sql = `SELECT roll FROM students WHERE roll = ${roll}`;
      db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0 && roll != rollno) {
          const str = "Update Failed: Same roll number already";
          res.redirect("../?valid=" + str);
        } else {
          console.log(dob);
          let add = `UPDATE students SET roll = ${roll}, name = '${name}', dob = '${dob}', score = ${score} WHERE roll = ${rollno}`;
          db.query(add, (err) => {
            if (err) throw err;
            const str = `Record updated successfully`;
            res.redirect("../?valid=" + str);
          });
        }
      });
    }
  }
);

router.get("/delete/:roll", (req, res) => {
  if (req.session.user) {
    const { roll } = req.params;
    let sql = `SELECT * FROM students WHERE roll = ${roll}`;
    db.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length == 1) {
        res.render("teacher/delete", { details: result[0], moment: moment });
      } else {
        const str = "Record does not exist";
        res.redirect("../?valid=" + str);
      }
    });
  } else {
    res.redirect("../");
  }
});

router.post("/delete/:roll", (req, res) => {
  if (req.session.user) {
    const { roll } = req.params;
    let sql = `SELECT * FROM students WHERE roll = ${roll}`;
    db.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length == 1) {
        let del = `DELETE FROM students WHERE roll = ${roll}`;
        db.query(del, (err, result) => {
          if (err) throw err;
          const str = "Record deleted successfully";
          res.redirect("../?valid=" + str);
        });
      } else {
        const str = "Record does not exist";
        res.redirect("../?valid=" + str);
      }
    });
  } else {
    res.redirect("../");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      res.render("index", { success: "Logout successfully" });
    }
  });
});

module.exports = router;
