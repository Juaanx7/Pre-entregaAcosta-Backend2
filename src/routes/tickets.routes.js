import express from "express";
import { getAllTickets } from "../controllers/tickets.controller.js";

const router = express.Router();

router.get("/", getAllTickets);

export default router;