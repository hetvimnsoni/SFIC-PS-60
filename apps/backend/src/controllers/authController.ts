import type { Request, Response } from "express";
import { authService } from "../services/authService";

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, role } = req.body;
      const user = await authService.login(email, role);
      res.status(200).json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Login failed" });
    }
  }

  async logout(req: Request, res: Response) {
    res.status(200).json({ success: true, message: "Logged out successfully" });
  }

  async getCurrentUser(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const user = await authService.getCurrentUser(authHeader);
      res.status(200).json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const authController = new AuthController();
