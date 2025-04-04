import CartManager from "../managers/CartManager.js";

export default class CartRepository {
  constructor() {
    this.manager = new CartManager();
  }

  getCartById(id) {
    return this.manager.getById(id);
  }

  createCart() {
    return this.manager.create();
  }

  updateCart(id, data) {
    return this.manager.update(id, data);
  }

  updateCartProducts(id, products) {
    return this.manager.updateProducts(id, products);
  }

  deleteCart(id) {
    return this.manager.delete(id);
  }
}