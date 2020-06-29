const express = require("express");
const router = express.Router();
const {
  isSignedIn,
  isAuthencticated,
  isAdmin,
} = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const {
  getOrderById,
  createOrder,
  getAllOrders,
  updateStatus,
  getOrderStatus,
} = require("../controllers/order");
const { updateStock } = require("../controllers/product");

//params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Actual Routes

//create route
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthencticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);

//read route
router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthencticated,
  isAdmin,
  getAllOrders
);

//get & update status routes
router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthencticated,
  isAdmin,
  getOrderStatus
);
router.put(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthencticated,
  isAdmin,
  updateStatus
);

module.exports = router;
