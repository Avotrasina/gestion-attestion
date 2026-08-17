import { Request, Response } from "express";
import * as personneService from "../services/personne.service";

// Personne par ID
async function obtenirPersonneParId(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID de la personne est requis",
			});
		}

		const personneTrouvee = await personneService.obtenirPersonne(Number(id));

		res.status(200).json({
			success: true,
			data: personneTrouvee,
			message: "Personne récupérée avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Lister toutes les personnes
async function listerPersonnes(req: Request, res: Response) {
	try {
		const personnes = await personneService.listerPersonnes();
		res.status(200).json({
			success: true,
			data: personnes,
			message: "Personnes récupérées avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Ajouter une nouvelle personne
async function ajouterPersonne(req: Request, res: Response) {
	try {
		const {
			nom,
			prenom,
			email,
			telephone,
			sexe,
			id_unite,
			type,
			etudiant,
			personnel,
		} = req.body;

		if (!nom) {
			return res.status(400).json({
				success: false,
				message: "Le nom est requis",
			});
		}

		if (!prenom) {
			return res.status(400).json({
				success: false,
				message: "Le prénom est requis",
			});
		}

		if (!email) {
			return res.status(400).json({
				success: false,
				message: "L'email est requis",
			});
		}

		if (!telephone) {
			return res.status(400).json({
				success: false,
				message: "Le téléphone est requis",
			});
		}

		if (!sexe) {
			return res.status(400).json({
				success: false,
				message: "Le sexe est requis",
			});
		}

		if (!type || !["ETUDIANT", "PERSONNEL"].includes(type)) {
			return res.status(400).json({
				success: false,
				message: "Le type doit être ETUDIANT ou PERSONNEL",
			});
		}

		const personne = await personneService.creerPersonne({
			nom,
			prenom,
			email,
			telephone,
			sexe,
			id_unite: id_unite || null,
			type,
			etudiant,
			personnel,
		});

		res.status(201).json({
			success: true,
			data: personne,
			message: "Personne créée avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Supprimer une personne
async function supprimerPersonne(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID de la personne est requis",
			});
		}

		const personne = await personneService.supprimerPersonne(Number(id));

		res.status(200).json({
			success: true,
			data: personne,
			message: "Personne supprimée avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Modifier une personne
async function modifierPersonne(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const {
			nom,
			prenom,
			email,
			telephone,
			sexe,
			id_unite,
			etudiant,
			personnel,
		} = req.body;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID de la personne est requis",
			});
		}

		if (
			!nom &&
			!prenom &&
			!email &&
			!telephone &&
			!sexe &&
			!etudiant &&
			!personnel &&
			id_unite === undefined
		) {
			return res.status(400).json({
				success: false,
				message: "Au moins un champ à modifier est requis",
			});
		}

		const personne = await personneService.modifierPersonne(Number(id), {
			nom,
			prenom,
			email,
			telephone,
			sexe,
			id_unite,
			etudiant,
			personnel,
		});

		res.status(200).json({
			success: true,
			data: personne,
			message: "Personne modifiée avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Lister les personnes par type
async function listerPersonnesParType(req: Request, res: Response) {
	try {
		const { type } = req.query;

		if (
			!type ||
			!["ETUDIANT", "PERSONNEL"].includes(String(type).toUpperCase())
		) {
			return res.status(400).json({
				success: false,
				message: "Le type doit être ETUDIANT ou PERSONNEL",
			});
		}

		const personnes = await personneService.listerPersonnesParType(
			String(type).toUpperCase() as "ETUDIANT" | "PERSONNEL",
		);

		res.status(200).json({
			success: true,
			data: personnes,
			message: `${type}s récupérés avec succès`,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

export {
	obtenirPersonneParId,
	listerPersonnes,
	ajouterPersonne,
	supprimerPersonne,
	modifierPersonne,
	listerPersonnesParType,
};
