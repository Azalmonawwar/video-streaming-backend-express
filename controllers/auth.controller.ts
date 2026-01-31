// controllers/auth.controller.js
import bcrypt from "bcryptjs";
import User from "../db/models/user.model.ts";
import { generateToken } from "../utils/token.js";
import { cookieOptions } from "../utils/cookiesOption.ts";

/**
 * REGISTER
 */

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user);
  res.cookie("token", token, cookieOptions);

  res.status(201).json({ user });
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user);
  res.cookie("token", token, cookieOptions);
  res.json({ user });
};

export const logout = (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out successfully" });
};

// controllers/auth.controller.js (add this)
export const googleCallback = async (req, res) => {
  const user = req.user;

  const token = generateToken(user);

  res.cookie("token", token, cookieOptions);
  res.redirect(process.env.CLIENT_URL);
};
