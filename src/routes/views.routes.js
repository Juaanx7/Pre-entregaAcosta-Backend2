import express from "express";
import passport from "passport";

const router = express.Router();

// 📌 Página de inicio - Redirigir al login
router.get("/", (req, res) => {
  res.redirect("/login");
});

// Página de login
router.get("/login", (req, res) => {
  res.render("login");
});

// Página de perfil (protegida con JWT)
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.render("current", { 
    user: {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Cerrar sesión y redirigir a login
router.get("/logout", (req, res) => {
  res.clearCookie("currentUser");
  res.redirect("/login");
});

export default router;
