import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "../../config/prisma.js"

const cookieName = process.env.AUTH_COOKIE_NAME || "auth_token";
const cookieMaxAgeMs = 1000 * 60 * 60 * 24 * 7; // 7 days

// VALIDATION 

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// TOKEN 

const buildToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,

    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const setAuthCookie = (res, token) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: cookieMaxAgeMs,
    path: "/",
  });
};


const serializeUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
});
// LOGIN 

export const login = async (req, res) => {
  try {
    const payload = loginSchema.parse(req.body);
    const email = payload.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });


    const passwordOk = await bcrypt.compare(
      payload.password,
      user.passwordHash
    );
    if (!passwordOk)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = buildToken(user);
    setAuthCookie(res, token);

    return res.json({
      user: serializeUser(user),
      token,
      expiresInDays: 7,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid input", issues: err.issues });
    }
    console.error("Login error:", err);
    return res.status(500).json({ message: "Unable to login" });
  }
};


// LOGOUT 
export const logout = (_req, res) => {
  try {
    res.clearCookie(cookieName, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/"
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Unable to logout" });
  }
};

