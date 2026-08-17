import { Request, Response } from "express";
import * as fonctionService from "../services/fonction.service";

// Fonction par ID
async function obtenirFonctionParId(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID de la fonction est requis",
			});
		}
		
		const fonctionTrouvee = await fonctionService.obtenirFonction(Number(id));

		res.status(200).json({
			success: true,
			data: fonctionTrouvee,
			message: "Fonction récupérée avec succès",
		}); 


		
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Lister toutes les fonctions
async function listerFonctions(req: Request, res: Response) {
	try {
		const fonctions = await fonctionService.listerFonctions();
		res.status(200).json({
			success: true,
			data: fonctions,
			message: "Fonctions récupérées avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Ajouter une nouvelle fonction
async function ajouterFonction(req: Request, res: Response) {
	try {
		console.log(req.body.nom_fonction);
		const { nom_fonction } = req.body;

		if (!nom_fonction) {
			return res.status(400).json({
				success: false,
				message: "Le nom de la fonction est requis",
			});
		}

		const fonction = await fonctionService.creerFonction({
			nom_fonction,
		});

		res.status(201).json({
			success: true,
			data: fonction,
			message: "Fonction créée avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Supprimer une fonction
async function supprimerFonction(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID de la fonction est requis",
			});
		}

		const fonction = await fonctionService.supprimerFonction(Number(id));

		res.status(200).json({
			success: true,
			data: fonction,
			message: "Fonction supprimée avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Modifier une fonction
async function modifierFonction(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { nom_fonction } = req.body;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID de la fonction est requis",
			});
		}

		if (!nom_fonction) {
			return res.status(400).json({
				success: false,
				message: "Le nom de la fonction est requis",
			});
		}

		const fonction = await fonctionService.modifierFonction(Number(id), {
			nom_fonction,
		});

		res.status(200).json({
			success: true,
			data: fonction,
			message: "Fonction modifiée avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

export {
	obtenirFonctionParId,
	listerFonctions,
	ajouterFonction,
	supprimerFonction,
	modifierFonction,
};
