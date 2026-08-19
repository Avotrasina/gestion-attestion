import { Request, Response } from "express";
import * as demandeService from "../services/demande.service";

// Demande par ID
async function obtenirDemandeParId(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID de la demande est requis",
			});
		}

		const demandeTrouvee = await demandeService.obtenirDemande(Number(id));

		res.status(200).json({
			success: true,
			data: demandeTrouvee,
			message: "Demande récupérée avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Lister toutes les demandes
async function listerDemandes(req: Request, res: Response) {
	try {
		const demandes = await demandeService.listerDemandes();
		res.status(200).json({
			success: true,
			data: demandes,
			message: "Demandes récupérées avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Ajouter une nouvelle demande
async function ajouterDemande(req: Request, res: Response) {
	try {
		const { date, type, remarque, id_personne } = req.body;		

		if (!date) {
			return res.status(400).json({
				success: false,
				message: "La date est requise",
			});
		}

		if (!type) {
			return res.status(400).json({
				success: false,
				message: "Le type est requis",
			});
		}

		if (!id_personne) {
			return res.status(400).json({
				success: false,
				message: "L'ID de la personne est requis",
			});
		}

		// Par défaut le statut de la demande est : ENREGISTREE
		const statut = "ENREGISTREE";
		const demande = await demandeService.creerDemande({
			date,
			type,
			statut,
			remarque,
			id_personne,
		});

		res.status(201).json({
			success: true,
			data: demande,
			message: "Demande créée avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Supprimer une demande
async function supprimerDemande(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID de la demande est requis",
			});
		}

		const demande = await demandeService.supprimerDemande(Number(id));

		res.status(200).json({
			success: true,
			data: demande,
			message: "Demande supprimée avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Modifier une demande
async function modifierDemande(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { date, type, statut, remarque, id_personne } = req.body;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID de la demande est requis",
			});
		}

		if (
			date === undefined &&
			type === undefined &&
			statut === undefined &&
			remarque === undefined &&
			id_personne === undefined
		) {
			return res.status(400).json({
				success: false,
				message: "Au moins un champ à modifier est requis",
			});
		}

		const demande = await demandeService.modifierDemande(Number(id), {
			date,
			type,
			statut,
			remarque,
			id_personne,
		});

		res.status(200).json({
			success: true,
			data: demande,
			message: "Demande modifiée avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Lister les demandes par personne
async function listerDemandesParPersonne(req: Request, res: Response) {
	try {
		const { id_personne } = req.query;

		if (!id_personne) {
			return res.status(400).json({
				success: false,
				message: "L'ID de la personne est requis",
			});
		}

		const demandes = await demandeService.listerDemandesParPersonne(
			Number(id_personne),
		);

		res.status(200).json({
			success: true,
			data: demandes,
			message: "Demandes de la personne récupérées avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Lister les demandes par statut
async function listerDemandesParStatut(req: Request, res: Response) {
	try {
		const { statut } = req.query;

		if (!statut) {
			return res.status(400).json({
				success: false,
				message: "Le statut est requis",
			});
		}
		const validStatuts = [
			"enregistree",
			"en_attente_de_recuperation",
			"recuperee",
		];
		if (!validStatuts.includes(String(statut).toLowerCase())) {
			return res.status(400).json({
				success: false,
				message:
					"Le statut doit être l'un de: enregistree, en_attente_de_recuperation, recuperee",
			});
		}

		const demandes = await demandeService.listerDemandesParStatut(
			String(statut).toLowerCase(),
		);

		res.status(200).json({
			success: true,
			data: demandes,
			message: "Demandes avec le statut récupérées avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

export {
	obtenirDemandeParId,
	listerDemandes,
	ajouterDemande,
	supprimerDemande,
	modifierDemande,
	listerDemandesParPersonne,
	listerDemandesParStatut,
};
