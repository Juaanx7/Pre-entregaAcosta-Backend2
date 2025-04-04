import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import path from "path";
import passport from "passport";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import "./config/passport.js";
import authRouter from "./routes/auth.routes.js";
import usersRouter from "./routes/users.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import productsRouter from "./routes/products.routes.js";
import viewsRouter from "./routes/views.routes.js";
import ticketsRouter from "./routes/tickets.routes.js";

dotenv.config();

const app = express();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("🟢 Conectado a MongoDB");
  } catch (error) {
    console.error("🔴 Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

connectDB();

// Manejo de eventos de conexión
mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB conectado correctamente");
});

mongoose.connection.on("error", (err) => {
  console.error("🔴 Error en la conexión con MongoDB:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB desconectado");
});

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(path.resolve(), "src/views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(passport.initialize());

// Rutas API
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/api/tickets", ticketsRouter);

// Rutas de vistas con Handlebars
app.use("/", viewsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});