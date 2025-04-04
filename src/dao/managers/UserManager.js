import User from "../models/User.js";

export default class UserManager {
  async getById(id) {
    return await User.findById(id).lean();
  }

  async getByEmail(email) {
    return await User.findOne({ email }).lean();
  }

  async getAll() {
    return await User.find().lean();
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}