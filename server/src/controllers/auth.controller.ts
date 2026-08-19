import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function register(req: Request, res: Response) {
	try {
		const { email, mdp, nom, prenom } = req.body;
		if ([email, mdp, nom, prenom].some((value) => typeof value !== "string")) {
			return res
				.status(400)
				.json({
					success: false,
					message: "email, mdp, nom et prenom sont requis",
				});
		}

		const result = await authService.register({ email, mdp, nom, prenom });
		return res
			.status(201)
			.json({
				success: true,
				data: result,
				message: "Compte créé avec succès",
			});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Erreur serveur";
		const status =
			message === "Impossible de créer le compte"
				? 409
				: message.includes("requis") ||
					  message.includes("invalide") ||
					  message.includes("8 caractères")
					? 400
					: 500;
		return res.status(status).json({ success: false, message });
	}
}

export async function login(req: Request, res: Response) {
	try {
		const { email, mdp } = req.body;
		if (typeof email !== "string" || typeof mdp !== "string") {
			return res
				.status(400)
				.json({ success: false, message: "email et mdp sont requis" });
		}

		const result = await authService.login(email, mdp);
		return res
			.status(200)
			.json({ success: true, data: result, message: "Connexion réussie" });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Erreur serveur";
		const status = message === "Email ou mot de passe invalide" ? 401 : 500;
		return res.status(status).json({ success: false, message });
	}
}
