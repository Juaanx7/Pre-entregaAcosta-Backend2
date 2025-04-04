import express from "express";
import passport from "passport";
import { authorizeRoles } from "../middleware/role.middleware.js";
import Ticket from "../dao/models/Ticket.js";

const router = express.Router();

// Obtener todos los tickets (solo admin)
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const tickets = await Ticket.find().sort({ purchase_datetime: -1 }).lean();
      res.json({ tickets });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los tickets", error: error.message });
    }
  }
);

export default router;