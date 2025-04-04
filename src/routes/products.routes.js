import express from "express";
import passport from "passport";
import Product from "../dao/models/Product.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// 🔐 Crear un producto → SOLO admin
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { title, description, price, stock, category, thumbnails } = req.body;
      const newProduct = new Product({ title, description, price, stock, category, thumbnails });
      await newProduct.save();
      res.status(201).json({ message: "Producto creado con éxito", product: newProduct });
    } catch (error) {
      res.status(500).json({ message: "Error al crear producto", error: error.message });
    }
  }
);

// 🟢 Obtener todos los productos → acceso público
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
});

// 🟢 Obtener un producto por ID → acceso público
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener producto", error: error.message });
  }
});

// 🔐 Actualizar un producto → SOLO admin
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado" });

      res.json({ message: "Producto actualizado", product: updatedProduct });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar producto", error: error.message });
    }
  }
);

// 🔐 Eliminar un producto → SOLO admin
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado" });

      res.json({ message: "Producto eliminado con éxito" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar producto", error: error.message });
    }
  }
);

export default router;