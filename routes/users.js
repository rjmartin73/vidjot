const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load user model
require('../models/User');
const User = mongoose.model('users');


// login route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// register route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// login post route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req,res,next);
});

//registration form route  
router.post('/register', (req, res) => {
  let errors = [];

  // validate passwords match
  if (req.body.password != req.body.confirm) {
    errors.push({ text: 'Passwords do not match.' });
  }

  // validate password length
  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters in length.' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      confirm: req.body.confirm
    });
  } else {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email already registered, please log in.');
          res.redirect('/users/register');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in.');
                  res.redirect('/users/login')
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  // console.log(newUser)
  }
});

//logout user router
router.get('/logout', (req,res) => {
  req.logout();
  req.flash('success_msg','You have succesfully logged out.');
  res.redirect('/users/login');
});

module.exports = router;