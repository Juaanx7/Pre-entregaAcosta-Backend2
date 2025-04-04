import express from "express";
import passport from "passport";
import { authorizeRoles } from "../middleware/role.middleware.js";
import Cart from "../dao/models/Cart.js";
import Product from "../dao/models/Product.js";
import Ticket from "../dao/models/Ticket.js";
import { generateCode } from "../utils/generateCode.js";

const router = express.Router();

// Crear un carrito vacio
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
router.post(
  "/:cartId/product/:productId",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("user"),
  async (req, res) => {
    try {
      const { cartId, productId } = req.params;

      const cart = await Cart.findById(cartId);
      if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });

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
  }
);

// Eliminar un producto del carrito
router.delete(
  "/:cartId/product/:productId",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("user"),
  async (req, res) => {
    try {
      const { cartId, productId } = req.params;

      const cart = await Cart.findById(cartId);
      if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

      cart.products = cart.products.filter(p => p.product.toString() !== productId);

      await cart.save();
      res.json({ message: "Producto eliminado del carrito", cart });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar producto del carrito", error: error.message });
    }
  }
);

// Vaciar completamente el carrito
router.delete(
  "/:cartId",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("user"),
  async (req, res) => {
    try {
      const { cartId } = req.params;

      const cart = await Cart.findById(cartId);
      if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

      cart.products = [];
      await cart.save();

      res.json({ message: "Carrito vaciado correctamente", cart });
    } catch (error) {
      res.status(500).json({ message: "Error al vaciar el carrito", error: error.message });
    }
  }
);

// Finalizar compra de un carrito
router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("user"),
  async (req, res) => {
    try {
      const cartId = req.params.cid;
      const userEmail = req.user.email;

      const cart = await Cart.findById(cartId).populate("products.product");
      if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

      const purchasedProducts = [];
      const notPurchasedProducts = [];
      let totalAmount = 0;

      for (const item of cart.products) {
        const product = item.product;
        const quantity = item.quantity;

        if (product.stock >= quantity) {
          // Descontar stock
          product.stock -= quantity;
          await product.save();

          // Agregar al total y al resumen
          totalAmount += product.price * quantity;
          purchasedProducts.push(item);
        } else {
          notPurchasedProducts.push(item);
        }
      }

      if (purchasedProducts.length === 0) {
        return res.status(400).json({ message: "No se pudo procesar la compra por falta de stock" });
      }

      // Crear ticket
      const ticketData = {
        code: generateCode(),
        amount: totalAmount,
        purchaser: userEmail,
      };

      const newTicket = await Ticket.create(ticketData);

      // Filtrar productos no comprados en el carrito
      cart.products = notPurchasedProducts;
      await cart.save();

      res.status(200).json({
        message: "Compra finalizada",
        ticket: newTicket,
        noComprados: notPurchasedProducts.map(p => ({
          product: p.product._id,
          title: p.product.title,
          requestedQty: p.quantity,
          stockDisponible: p.product.stock,
        }))
      });
    } catch (error) {
      res.status(500).json({ message: "Error al finalizar la compra", error: error.message });
    }
  }
);

export default router;