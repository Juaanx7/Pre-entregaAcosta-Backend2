import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import usersRouter from "./routes/users.routes.js";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import passport from "passport";
import "./config/passport.js";
import cartsRouter from "./routes/carts.routes.js";
import productsRouter from "./routes/products.routes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());
app.use(morgan("dev"));
app.use("/api/auth", authRouter);
app.use(passport.initialize());
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

// Rutas
app.use("/api/users", usersRouter);

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
