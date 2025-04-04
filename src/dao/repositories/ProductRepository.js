import ProductManager from "../managers/ProductManager.js";

export default class ProductRepository {
  constructor() {
    this.manager = new ProductManager();
  }

  getAllProducts() {
    return this.manager.getAll();
  }

  getProductById(id) {
    return this.manager.getById(id);
  }

  createProduct(data) {
    return this.manager.create(data);
  }

  updateProduct(id, data) {
    return this.manager.update(id, data);
  }

  deleteProduct(id) {
    return this.manager.delete(id);
  }
}