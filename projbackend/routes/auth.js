var express = require("express");
var router = express.Router();
const { signout, signup, signin,  } = require("../controllers/auth");
const { check, validationResult } = require("express-validator");

//Signing Up Route
router.post(
  "/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("name should be atleast 3 characters long"),
    check("email").isEmail().withMessage("invalid email address"),
    check("password")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .withMessage(
        "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:"
      ),
  ],
  signup
);

//Signing In Route
router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("invalid email address"),
    check("password").isLength({ min: 1 }).withMessage("password is required"),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
