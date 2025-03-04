import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.signedCookies.currentUser;
    if (!token) return res.status(401).json({ message: "Acceso no autorizado, token faltante" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};