const router = require("express").Router();
const { isSignedIn, isAuthencticated } = require("../controllers/auth");
const { getToken, processPayment } = require("../controllers/payment");
const { getUserById } = require("../controllers/user");


router.param("userId", getUserById);

router.get("/payment/getToken/:userId", isSignedIn, isAuthencticated, getToken);
router.post(
  "/payment/braintree/:userId",
  isSignedIn,
  isAuthencticated,
  processPayment
);

module.exports = router;
