import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";

export function authenticate(req: Request, res: Response, next: NextFunction) {
	const authorization = req.headers.authorization;
	if (!authorization?.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({ success: false, message: "Authentification requise" });
	}

	try {
		req.auth = { userId: authService.verifyToken(authorization.slice(7)) };
		return next();
	} catch {
		return res
			.status(401)
			.json({ success: false, message: "Token invalide ou expiré" });
	}
}
