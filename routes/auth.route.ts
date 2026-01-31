// routes/auth.routes.js
import express from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  googleCallback,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback,
);

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

export default router;
