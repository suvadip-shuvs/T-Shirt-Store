var express = require("express");
var router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
} = require("../controllers/user");
const {
  isSignedIn,
  isAuthencticated,
  isAdmin,
} = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthencticated, getUser);

router.put("/user/:userId", isSignedIn, isAuthencticated, updateUser);

router.get(
  "orders/user/:userId",
  isSignedIn,
  isAuthencticated,
  userPurchaseList
);

// router.get("/user/:userId/getAll", isSignedIn, isAdmin, getAllUser);

// router.get("/user", isSignedIn, isAdmin, getAllUser);

module.exports = router;
