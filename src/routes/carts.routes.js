import express from "express";
import {
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  emptyCart,
} from "../controllers/carts.controller.js";

const router = express.Router();

router.post("/", createCart);
router.get("/:id", getCartById);
router.post("/:cartId/product/:productId", addProductToCart);
router.delete("/:cartId/product/:productId", removeProductFromCart);
router.delete("/:cartId", emptyCart);

export default router;