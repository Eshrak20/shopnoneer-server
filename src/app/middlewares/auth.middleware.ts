import { Request, Response, NextFunction } from "express";
import { envVars } from "../config/env";
import jwt, { JwtPayload } from "jsonwebtoken";

export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user?.role_id !== 1) {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1️⃣ Check cookie first
    let token = req.cookies?.accessToken;

    // 2️⃣ If no cookie, check Authorization header (Bearer token)
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;

      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No access token found",
      });
    }


    // 3️⃣ Verify token
    const decoded = jwt.verify(
      token,
      envVars.JWT_ACCESS_SECRET as string
    ) as JwtPayload & { userId: number; role_id?: number };

    // 4️⃣ Attach user to request
    req.user = decoded;

    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
