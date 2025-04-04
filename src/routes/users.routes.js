import express from "express";
import bcrypt from "bcryptjs";
import User from "../dao/models/User.js";
import passport from "passport";
import Cart from "../dao/models/Cart.js";

const router = express.Router();

// Obtener todos los usuarios (Solo autenticados con Passport JWT)
router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
});

// Obtener un usuario por ID (Solo autenticados)
router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
  }
});

// Crear un usuario
router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "El email ya está registrado" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear un carrito vacío para el usuario
    const newCart = new Cart({ products: [] });
    await newCart.save();

    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      cart: newCart._id
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario creado con éxito", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
});

// Actualizar un usuario por ID (Solo autenticados)
router.put("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
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
});

// Eliminar un usuario por ID (Solo autenticados)
router.delete("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error: error.message });
  }
});

export default router;
