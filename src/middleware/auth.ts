import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

export interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export function authenticationJwt(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, config.jwtSecret) as AuthRequest["user"];
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
