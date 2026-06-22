import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { findUserByEmail, toPublicUser } from "../data/store.js";

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role
    },
    process.env.JWT_SECRET || "dev-secret",
    {
      expiresIn: "7d"
    }
  );
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isValid = user.comparePassword ? await user.comparePassword(password) : user.password === password;

  if (!isValid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const publicProfile = toPublicUser(user);

  res.json({
    token: signToken(publicProfile),
    user: publicProfile
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
