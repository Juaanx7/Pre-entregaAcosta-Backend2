import Product from "../models/Product.js";

export default class ProductManager {
  async getAll() {
    return await Product.find().lean();
  }

  async getById(id) {
    return await Product.findById(id).lean();
  }

  async create(productData) {
    return await Product.create(productData);
  }

  async update(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }
}