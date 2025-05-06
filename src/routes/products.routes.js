import express from "express";
import passport from "passport";
import { authorizeRoles } from "../middleware/role.middleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/products.controller.js";

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin"),
  createProduct
);

router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;