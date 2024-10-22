const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
//const { validationResult } = require("express-validator");

//param controller
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product Not Found!!!",
        });
      }
      req.product = product;
      next();
    });
};

//create controller
exports.createProduct = (req, res) => {
  //   const errors = validationResult(req);

  //   if (!errors.isEmpty()) {
  //     return res.status(422).json(errors);
  //   }

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "failed to upload file",
      });
    }
    //destructing the fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let product = new Product(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3 * 1024 * 1024) {
        return res.status(400).json({
          error: "File size is too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save the product in the db
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Saving T shirt in DB failed!!",
        });
      }
      res.json(product);
    });
  });
};

//read controller
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

//middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, product) => {
    if (err) {
      return res.status(400).json({
        message: "Bulk Operations Failed",
      });
    }
  });

  next();
};

//delete controller
exports.removeProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Cannot delete product",
      });
    }
    deletedProduct.photo = undefined;
    res.json({
      message: "Product has been deleted",
      deletedProduct,
    });
  });
};

//update controller
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem in form data",
      });
    }
    //destructing the fields

    //updation in fields
    let product = req.product;
    product = _.extend(product, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3 * 1024 * 1024) {
        return res.status(400).json({
          error: "File size is too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save the product in the db
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Updating T-shirt in DB failed!!",
        });
      }
      product.photo = undefined;
      res.json({
        message: "Updation Successfull",
        product,
      });
    });
  });
};

//listing all products
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? req.query.limit : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No products found",
        });
      }
      res.json(products);
    });
};

//get all categories
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "No category found",
      });
    }
    res.json(products);
  });
};
