const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var ejwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  const user = new User(req.body);
  user.save((error, user) => {
    if (error) {
      return res.status(400).json({
        error: "NOT able to save user in DB",
      });
    }
    res.json(user);
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  User.findOne({ email }, (errors, user) => {
    if (errors || !user) {
      return res.status(400).json({
        error: "USER not found",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Password didn't match. Please try again!",
      });
    }

    //create token for authentication
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //Put the token in the cookie
    res.cookie("token", token, { expire: new Date() + 2 });

    //send response to frontend
    const { _id, name, email, role } = user;
    res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User has been signed out!!",
  });
};

//protected routes

exports.isSignedIn = ejwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//custom middlewares

exports.isAuthencticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role == 0) {
    return res.status(403).json({
      error: "You are not admin",
    });
  }
  next();
};
