import jwt from "jsonwebtoken";

export const generateToken = (user: { _id: string; email: string }): string => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    },
  );
};
