import { Request, Response } from "express";
import * as fichierService from "../services/fichier.service";

// Fichier par ID
async function obtenirFichierParId(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID du fichier est requis",
			});
		}

		const fichierTrouve = await fichierService.obtenirFichier(Number(id));

		res.status(200).json({
			success: true,
			data: fichierTrouve,
			message: "Fichier récupéré avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Lister tous les fichiers
async function listerFichiers(req: Request, res: Response) {
	try {
		const fichiers = await fichierService.listerFichiers();
		res.status(200).json({
			success: true,
			data: fichiers,
			message: "Fichiers récupérés avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Ajouter un fichier
async function ajouterFichier(req: Request, res: Response) {
	try {
		const { type_fichier, role, id_demande } = req.body;
		const file = (req as any).file;

		if (!file) {
			return res.status(400).json({
				success: false,
				message: "Aucun fichier fourni",
			});
		}

		if (!type_fichier || !["ENTREE", "GENERE"].includes(type_fichier)) {
			return res.status(400).json({
				success: false,
				message: "Le type de fichier doit être ENTREE ou GENERE",
			});
		}

		if (!role) {
			return res.status(400).json({
				success: false,
				message: "Le rôle est requis",
			});
		}

		if (!id_demande) {
			return res.status(400).json({
				success: false,
				message: "L'ID de la demande est requis",
			});
		}

		// Validate role based on type
		if (type_fichier === "ENTREE") {
			const validEntreeRoles = ["DM", "CV", "LM", "LI", "ASS"];
			if (!validEntreeRoles.includes(role.toUpperCase())) {
				return res.status(400).json({
					success: false,
					message: "Pour ENTREE, le rôle doit être: DM, CV, LM, LI ou ASS",
				});
			}
		} else if (type_fichier === "GENERE") {
			if (role.toUpperCase() !== "ATTESTATION") {
				return res.status(400).json({
					success: false,
					message: "Pour GENERE, le rôle doit être ATTESTATION",
				});
			}
		}

		const fichier = await fichierService.creerFichier({
			type_fichier,
			role,
			nom_fichier: file.filename,
			id_demande: Number(id_demande),
		});

		res.status(201).json({
			success: true,
			data: fichier,
			message: "Fichier créé avec succès",
		});
	} catch (error) {
		// Delete uploaded file if database operation fails
		if ((req as any).file) {
			const fs = await import("fs");
			const path = await import("path");
			const filePath = path.join(
				process.cwd(),
				"uploads",
				"demandes",
				(req as any).file.filename,
			);
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
			}
		}

		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Supprimer un fichier
async function supprimerFichier(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID du fichier est requis",
			});
		}

		// Get file info before deletion
		const fichierInfo = await fichierService.obtenirFichier(Number(id));

		const fichier = await fichierService.supprimerFichier(
			Number(id),
			fichierInfo.nom_fichier,
		);

		res.status(200).json({
			success: true,
			data: fichier,
			message: "Fichier supprimé avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Modifier un fichier
async function modifierFichier(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { type_fichier, role, nom_fichier } = req.body;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID du fichier est requis",
			});
		}

		if (!type_fichier && !role && !nom_fichier) {
			return res.status(400).json({
				success: false,
				message: "Au moins un champ à modifier est requis",
			});
		}

		const fichier = await fichierService.modifierFichier(Number(id), {
			type_fichier,
			role,
			nom_fichier,
		});

		res.status(200).json({
			success: true,
			data: fichier,
			message: "Fichier modifié avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Lister les fichiers par demande
async function listerFichiersParDemande(req: Request, res: Response) {
	try {
		const { id_demande } = req.query;

		if (!id_demande) {
			return res.status(400).json({
				success: false,
				message: "L'ID de la demande est requis",
			});
		}

		const fichiers = await fichierService.listerFichiersParDemande(
			Number(id_demande),
		);

		res.status(200).json({
			success: true,
			data: fichiers,
			message: "Fichiers de la demande récupérés avec succès",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Télécharger un fichier
async function telechargerFichier(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID du fichier est requis",
			});
		}

		const fichierInfo = await fichierService.obtenirContenuFichier(Number(id));

		// Set proper headers for file download
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="${fichierInfo.nom_fichier}"`,
		);
		res.setHeader("Content-Type", "application/octet-stream");

		// Send file
		res.download(fichierInfo.path);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

// Afficher un fichier (preview)
async function afficherFichier(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "L'ID du fichier est requis",
			});
		}

		const fichierInfo = await fichierService.obtenirContenuFichier(Number(id));

		// Send file for inline display
		res.setHeader(
			"Content-Disposition",
			`inline; filename="${fichierInfo.nom_fichier}"`,
		);
		res.sendFile(fichierInfo.path);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Erreur serveur",
		});
	}
}

export {
	obtenirFichierParId,
	listerFichiers,
	ajouterFichier,
	supprimerFichier,
	modifierFichier,
	listerFichiersParDemande,
	telechargerFichier,
	afficherFichier,
};
