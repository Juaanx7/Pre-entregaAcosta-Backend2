import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Login con Passport Local
router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    // Generar JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
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

    res.json({ message: "Login exitoso con Passport", token });
  })(req, res, next);
});

// Ruta protegida con Passport JWT para obtener el usuario autenticado
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "Usuario autenticado con Passport JWT", user: req.user });
  }
);

// Ruta para cerrar sesión (Logout)
router.post("/logout", (req, res) => {
  res.clearCookie("currentUser", { path: "/" });
  res.json({ message: "Sesión cerrada exitosamente" });
});

export default router;