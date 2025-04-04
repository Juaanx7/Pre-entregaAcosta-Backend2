import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcryptjs";
import User from "../dao/models/User.js";
import dotenv from "dotenv";

dotenv.config();

// Estrategia Local (Login con email y contraseña)
passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password", session: false },
    async (email, password, done) => {
      try {
        // Buscar usuario por email
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "Usuario no encontrado" });

        // Comparar la contraseña
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return done(null, false, { message: "Contraseña incorrecta" });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Estrategia JWT (Autenticación con token)
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.signedCookies.currentUser]),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (!user) return done(null, false, { message: "Token inválido" });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialización del usuario
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;