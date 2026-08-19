import { NextFunction, Request, Response } from "express";
import prisma from "../utils/client";

export function auditRequest(req: Request, res: Response, next: NextFunction) {
	res.on("finish", () => {
		void prisma.auditLog
			.create({
				data: {
					userId: req.auth?.userId,
					action: `${req.method} ${req.path}`,
					method: req.method,
					path: req.path,
					statusCode: res.statusCode,
					entity: req.path.split("/")[1] || null,
					entityId: req.params.id ? String(req.params.id) : null,
					ipAddress: req.ip,
				},
			})
			.catch((error) => console.error("Erreur d'audit:", error));
	});
	next();
}
