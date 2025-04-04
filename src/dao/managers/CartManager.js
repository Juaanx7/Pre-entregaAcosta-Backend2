import Cart from "../models/Cart.js";

export default class CartManager {
  async getById(id) {
    return await Cart.findById(id).populate("products.product").lean();
  }

  async create(cartData = { products: [] }) {
    return await Cart.create(cartData);
  }

  async update(id, data) {
    return await Cart.findByIdAndUpdate(id, data, { new: true });
  }

  async updateProducts(cartId, products) {
    return await Cart.findByIdAndUpdate(cartId, { products }, { new: true });
  }

  async delete(cartId) {
    return await Cart.findByIdAndDelete(cartId);
  }
}