import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

const cookieName = process.env.AUTH_COOKIE_NAME || "auth_token";

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const tokenCookie = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${cookieName}=`));

  return tokenCookie ? decodeURIComponent(tokenCookie.split("=").slice(1).join("=")) : null;
};

export const requireAuth = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid session" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
