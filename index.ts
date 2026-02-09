import express from "express";
import passport from "passport";
import "./config/passport.ts";
import authRoutes from "./routes/auth.route.ts";
import videoRoutes from "./routes/video.route.ts";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: "*/",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/video", videoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;
