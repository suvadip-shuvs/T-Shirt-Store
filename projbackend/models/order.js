const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productInCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product",
  },
  name: String,
  count: Number,
  price: Number,
});

const ProductCart = mongoose.model("ProductCart", productInCartSchema);

const orderSchema = new mongoose.Schema(
  {
    products: [productInCartSchema],
    transaction_id: {},
    amount: Number,
    address: String,
    updated: Date,
    status: {
      type: String,
      default: "Received",
      enum: ["Cancelled", "Shipped", "Processing", "Received", "Delivered"],
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductCart };
