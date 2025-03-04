import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Crear un producto
router.post("/", async (req, res) => {
  try {
    const { title, description, price, stock, category, thumbnails } = req.body;
    const newProduct = new Product({ title, description, price, stock, category, thumbnails });
    await newProduct.save();
    res.status(201).json({ message: "Producto creado con éxito", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error al crear producto", error: error.message });
  }
});

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener producto", error: error.message });
  }
});

export default router;
