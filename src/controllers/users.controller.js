import bcrypt from "bcryptjs";
import User from "../dao/models/User.js";
import Cart from "../dao/models/Cart.js";

export const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "El email ya está registrado" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newCart = new Cart({ products: [] });
    await newCart.save();

    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      cart: newCart._id,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario creado con éxito", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    let updateData = { first_name, last_name, email, age, role };
    if (password) updateData.password = bcrypt.hashSync(password, 10);

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario actualizado con éxito", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error: error.message });
  }
};