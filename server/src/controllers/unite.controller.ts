import { Request, Response } from "express";
import * as uniteService from "../services/unite.service";

// Unité par ID
async function obtenirUniteParId(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID de l'unité est requis",
			});
		}

		const uniteTrouvee = await uniteService.obtenirUnite(Number(id));

		res.status(200).json({
			success: true,
			data: uniteTrouvee,
			message: "Unité récupérée avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Lister toutes les unités
async function listerUnites(req: Request, res: Response) {
	try {
		const unites = await uniteService.listerUnites();
		res.status(200).json({
			success: true,
			data: unites,
			message: "Unités récupérées avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Ajouter une nouvelle unité
async function ajouterUnite(req: Request, res: Response) {
	try {
		const { code, nom, type } = req.body;

		if (!code) {
			return res.status(400).json({
				success: false,
				message: "Le code de l'unité est requis",
			});
		}

		if (!nom) {
			return res.status(400).json({
				success: false,
				message: "Le nom de l'unité est requis",
			});
		}

		if (!type) {
			return res.status(400).json({
				success: false,
				message: "Le type de l'unité est requis",
			});
		}

		const unite = await uniteService.creerUnite({
			code,
			nom,
			type,
		});

		res.status(201).json({
			success: true,
			data: unite,
			message: "Unité créée avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Supprimer une unité
async function supprimerUnite(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID de l'unité est requis",
			});
		}

		const unite = await uniteService.supprimerUnite(Number(id));

		res.status(200).json({
			success: true,
			data: unite,
			message: "Unité supprimée avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Modifier une unité
async function modifierUnite(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { code, nom, type } = req.body;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID de l'unité est requis",
			});
		}

		if (!code && !nom && !type) {
			return res.status(400).json({
				success: false,
				message: "Au moins un champ à modifier est requis (code, nom ou type)",
			});
		}

		const unite = await uniteService.modifierUnite(Number(id), {
			code,
			nom,
			type,
		});

		res.status(200).json({
			success: true,
			data: unite,
			message: "Unité modifiée avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

export {
	obtenirUniteParId,
	listerUnites,
	ajouterUnite,
	supprimerUnite,
	modifierUnite,
};
