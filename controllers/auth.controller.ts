// controllers/auth.controller.js
import bcrypt from "bcryptjs";
import User from "../db/models/user.model.ts";
import { generateToken } from "../utils/token.js";
import { cookieOptions } from "../utils/cookiesOption.ts";
import connectToDatabase from "../db/connect.ts";

/**
 * REGISTER
 */

export const register = async (req, res) => {
  try {
    await connectToDatabase();
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

    if (!user) {
      return res.status(400).json({ message: "User not created" });
    }
    res.json({ user });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  try {
    await connectToDatabase();
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
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
    res.json({ user, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded?.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
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
