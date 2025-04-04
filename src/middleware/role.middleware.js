export function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
      const user = req.user;
  
      if (!user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
  
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "No tienes permiso para acceder a esta ruta" });
      }
  
      next();
    };
  }  