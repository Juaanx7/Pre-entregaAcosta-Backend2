import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import UserDTO from "../dao/dtos/UserDTO.js";

const router = express.Router();

// Login con Passport Local
router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/login?error=1");

    // Generar JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, first_name: user.first_name, last_name: user.last_name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Guardar token en una cookie firmada
    res.cookie("currentUser", token, {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res.redirect("/current");
  })(req, res, next);
});

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.json({ user: userDTO });
});

// Ruta para cerrar sesion
router.post("/logout", (req, res) => {
  res.clearCookie("currentUser", { path: "/" });
  res.json({ message: "Sesión cerrada exitosamente" });
});

export default router;