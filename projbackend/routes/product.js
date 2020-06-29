const express = require("express");
const router = express.Router();
//const { check } = require("express-validator");
const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  removeProduct,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product");
const {
  isSignedIn,
  isAuthencticated,
  isAdmin,
} = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//All params goes here
router.param("userId", getUserById);
router.param("productId", getProductById);

//All routes goes here

//create route
router.post(
  "/products/create/:userId",
  isSignedIn,
  isAuthencticated,
  isAdmin,
  // [
  //   check("name")
  //     .isLength({ min: 3 })
  //     .withMessage("Name is required and must be atleast 3 characters long"),
  //   check("description")
  //     .isLength({ min: 10 })
  //     .withMessage(
  //       "Description is required and must be atleast 10 characters long"
  //     ),
  //   check("price").isEmpty().withMessage("Price is required"),
  //   check("category").isEmpty().withMessage("Category is required"),
  // ],
  createProduct
);

//read route
router.get("/products/:productId", getProduct);
router.get("/products/photo/:productId", photo);

//delete route
router.delete(
  "/products/:productId/:userId",
  isSignedIn,
  isAuthencticated,
  isAdmin,
  removeProduct
);

//update route
router.put(
  "/products/:productId/:userId",
  isSignedIn,
  isAuthencticated,
  isAdmin,
  updateProduct
);

//listing route
router.get("/products", getAllProducts);

//get all unique categories
router.get("/products/category", getAllUniqueCategories);

module.exports = router;
