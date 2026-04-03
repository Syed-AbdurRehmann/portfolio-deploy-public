import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const DEFAULT_SECRET = "replace-me-with-a-secure-jwt-secret";

const jwtSecret = process.env.JWT_SECRET || DEFAULT_SECRET;
const tokenTtl = process.env.JWT_EXPIRES_IN || "12h";

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

export const generateAdminToken = (admin) => {
  return jwt.sign(
    {
      adminId: admin.id,
      email: admin.email,
      role: "admin",
    },
    jwtSecret,
    { expiresIn: tokenTtl },
  );
};

export const verifyAdminToken = (token) => {
  return jwt.verify(token, jwtSecret);
};
