import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  inStock: Boolean
});

export const Product = mongoose.model("Product", productSchema);