import express from "express";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const router = express.Router();

// Crear un carrito vacío
router.post("/", async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json({ message: "Carrito creado con éxito", cart: newCart });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el carrito", error: error.message });
  }
});

// Obtener un carrito por ID
router.get("/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate("products.product");
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el carrito", error: error.message });
  }
});

// Agregar un producto a un carrito
router.post("/:cartId/product/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    // Verificar si el carrito existe
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    // Verificar si el producto existe
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.products.find(p => p.product.toString() === productId);
    if (existingProduct) {
      existingProduct.quantity += 1; 
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.json({ message: "Producto agregado al carrito", cart });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar producto al carrito", error: error.message });
  }
});

// 📌 Eliminar un producto específico del carrito
router.delete("/:cartId/product/:productId", async (req, res) => {
    try {
      const { cartId, productId } = req.params;
  
      // Verificar si el carrito existe
      const cart = await Cart.findById(cartId);
      if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
  
      // Filtrar los productos para eliminar el producto específico
      cart.products = cart.products.filter(p => p.product.toString() !== productId);
  
      await cart.save();
      res.json({ message: "Producto eliminado del carrito", cart });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar producto del carrito", error: error.message });
    }
  });
  
  // 📌 Vaciar completamente el carrito
  router.delete("/:cartId", async (req, res) => {
    try {
      const { cartId } = req.params;
  
      // Verificar si el carrito existe
      const cart = await Cart.findById(cartId);
      if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
  
      // Vaciar el carrito
      cart.products = [];
      await cart.save();
  
      res.json({ message: "Carrito vaciado correctamente", cart });
    } catch (error) {
      res.status(500).json({ message: "Error al vaciar el carrito", error: error.message });
    }
  });
  

export default router;