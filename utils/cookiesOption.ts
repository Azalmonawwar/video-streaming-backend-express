export const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/", // IMPORTANT
  maxAge: 15 * 60 * 1000,
};
