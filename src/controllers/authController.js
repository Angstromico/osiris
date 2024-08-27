const express = require("express");
require("dotenv").config();
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const authService = require("../services/authService"); // Assuming you have a service module
const User = require("../model/userSchema");

const router = express.Router();

router.post("/up", async (req, res) => {
  try {
    await userService.createUser(req, res);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});


router.post("/sendJwt", (req, res) => {
  try {
    const token = authService.generateToken(req, res);
    res.json({ token });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    await authService.loginLocal(req, res);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

router.post("/local", async (req, res) => {
  try {
    await authService.loginOther(req, res);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

router.post("/receip", async (req, res) => {
  try {
    await authService.receipJwt(req, res);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

router.post("/send-email", async (req, res) => {
  try {
    const token = req.body.token;
    const correo = req.body.correo;

    if (!token || !correo) {
      return res
        .status(400)
        .json({ error: "Missing required fields: token and/or correo" });
    }
    await authService.sendEmail(token, correo);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

router.get("/get-token", async (req, res) => {
  try {
    await authService.generateToken(req, res);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

router.post("/token-jwt", async (req, res) => {
  try {
    await authService.getTokenJwt(req, res);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// Configuración de Passport para JWT
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload._id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      console.error("Error finding user:", err);
      return done(err, false);
    }
  })
);

// Ruta protegida usando JWT
router.get("/protected", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
      message: "You have accessed a protected route",
      user: req.user,
    });
});

module.exports = router;
