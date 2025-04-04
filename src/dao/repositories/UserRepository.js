import UserManager from "../managers/UserManager.js";

export default class UserRepository {
  constructor() {
    this.manager = new UserManager();
  }

  getUserByEmail(email) {
    return this.manager.getByEmail(email);
  }

  getUserById(id) {
    return this.manager.getById(id);
  }

  createUser(data) {
    return this.manager.create(data);
  }

  getAllUsers() {
    return this.manager.getAll();
  }

  updateUser(id, data) {
    return this.manager.update(id, data);
  }

  deleteUser(id) {
    return this.manager.delete(id);
  }
}