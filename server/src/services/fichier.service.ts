import prisma from "../utils/client";
import fs from "fs";
import path from "path";

// Helper function to generate reference for GENERE files
function generateReference(
	id_demande: number,
	year: number = new Date().getFullYear(),
): string {
	// Format: 2026/001/SAP/DRH/CEM (pad id to 3 digits)
	const paddedId = String(id_demande).padStart(3, "0");
	return `${year}/${paddedId}/SAP/DRH/CEM`;
}

function validateFileRoleForDemande(
	demandeType: string,
	typeFichier: "ENTREE" | "GENERE",
	role: string,
) {
	const normalizedDemandeType = demandeType.trim().toUpperCase();
	const normalizedRole = role.trim().toUpperCase();

	if (typeFichier === "ENTREE") {
		const allowedRolesByDemande: Record<string, string[]> = {
			STAGE: ["LM", "CV", "ASS"],
			ATTESTATION_STAGE: ["DM"],
			ATTESTATION_TRAVAIL: ["DM"],
		};

		const allowedRoles = allowedRolesByDemande[normalizedDemandeType];
		if (!allowedRoles) {
			throw new Error(
				`Type de demande non pris en charge: ${normalizedDemandeType}`,
			);
		}

		if (!allowedRoles.includes(normalizedRole)) {
			throw new Error(
				`Pour une demande ${normalizedDemandeType}, le rôle doit être: ${allowedRoles.join(", ")}`,
			);
		}
		return;
	}

	if (normalizedRole !== "ATTESTATION") {
		throw new Error("Pour GENERE, le rôle doit être ATTESTATION");
	}
}

// Lister tous les fichiers
export async function listerFichiers() {
	try {
		const fichiers = await prisma.fichier.findMany({
			select: {
				id: true,
				type_fichier: true,
				reference: true,
				role: true,
				nom_fichier: true,
				date_insertion: true,
				id_demande: true,
				demande: {
					select: {
						id_demande: true,
						date: true,
						type: true,
						statut: true,
					},
				},
			},
		});
		return fichiers;
	} catch (error) {
		throw new Error(`Erreur lors de la récupération des fichiers: ${error}`);
	}
}

// Créer un nouveau fichier
export async function creerFichier(data: {
	type_fichier: "ENTREE" | "GENERE";
	role: string;
	nom_fichier: string;
	id_demande: number;
}) {
	try {
		if (
			!data.type_fichier ||
			!["ENTREE", "GENERE"].includes(data.type_fichier)
		) {
			throw new Error("Le type de fichier doit être ENTREE ou GENERE");
		}

		if (!data.role || data.role.trim() === "") {
			throw new Error("Le rôle est requis");
		}

		if (!data.nom_fichier || data.nom_fichier.trim() === "") {
			throw new Error("Le nom du fichier est requis");
		}

		if (!data.id_demande || data.id_demande <= 0) {
			throw new Error("L'ID de la demande est requis");
		}

		// Vérifier que la demande existe
		const demande = await prisma.demande.findUnique({
			where: { id_demande: data.id_demande },
		});

		if (!demande) {
			throw new Error(`Demande avec l'ID ${data.id_demande} non trouvée`);
		}

		validateFileRoleForDemande(demande.type, data.type_fichier, data.role);

		// Generate reference for GENERE files
		const reference =
			data.type_fichier === "GENERE"
				? generateReference(data.id_demande)
				: null;

		const fichier = await prisma.fichier.create({
			data: {
				type_fichier: data.type_fichier,
				reference,
				role: data.role.toUpperCase(),
				nom_fichier: data.nom_fichier,
				id_demande: data.id_demande,
			},
			select: {
				id: true,
				type_fichier: true,
				reference: true,
				role: true,
				nom_fichier: true,
				date_insertion: true,
				id_demande: true,
				demande: {
					select: {
						id_demande: true,
						date: true,
						type: true,
						statut: true,
					},
				},
			},
		});

		return fichier;
	} catch (error) {
		throw new Error(`Erreur lors de la création du fichier: ${error}`);
	}
}

// Récupérer un fichier par ID
export async function obtenirFichier(id: number) {
	try {
		const fichier = await prisma.fichier.findUnique({
			where: { id },
			select: {
				id: true,
				type_fichier: true,
				reference: true,
				role: true,
				nom_fichier: true,
				date_insertion: true,
				id_demande: true,
				demande: {
					select: {
						id_demande: true,
						date: true,
						type: true,
						statut: true,
					},
				},
			},
		});

		if (!fichier) {
			throw new Error(`Fichier avec l'ID ${id} non trouvé`);
		}

		return fichier;
	} catch (error) {
		throw new Error(`Erreur lors de la récupération du fichier: ${error}`);
	}
}

// Modifier un fichier
export async function modifierFichier(
	id: number,
	data: {
		type_fichier?: "ENTREE" | "GENERE";
		role?: string;
		nom_fichier?: string;
	},
) {
	try {
		// Vérifier que le fichier existe
		const fichier = await prisma.fichier.findUnique({
			where: { id },
		});

		if (!fichier) {
			throw new Error(`Fichier avec l'ID ${id} non trouvé`);
		}

		if (
			data.type_fichier &&
			!["ENTREE", "GENERE"].includes(data.type_fichier)
		) {
			throw new Error("Le type de fichier doit être ENTREE ou GENERE");
		}

		if (data.role !== undefined && data.role.trim() === "") {
			throw new Error("Le rôle ne peut pas être vide");
		}

		if (data.nom_fichier !== undefined && data.nom_fichier.trim() === "") {
			throw new Error("Le nom du fichier ne peut pas être vide");
		}

		const demande = await prisma.demande.findUnique({
			where: { id_demande: fichier.id_demande },
		});

		if (!demande) {
			throw new Error(`Demande avec l'ID ${fichier.id_demande} non trouvée`);
		}

		const updateData: any = {};
		if (data.type_fichier) updateData.type_fichier = data.type_fichier;
		if (data.role) updateData.role = data.role.toUpperCase();
		if (data.nom_fichier) updateData.nom_fichier = data.nom_fichier;

		const finalTypeFichier = (data.type_fichier ?? fichier.type_fichier) as
			| "ENTREE"
			| "GENERE";
		const finalRole = (data.role ?? fichier.role).trim().toUpperCase();
		validateFileRoleForDemande(demande.type, finalTypeFichier, finalRole);

		const fichierModifie = await prisma.fichier.update({
			where: { id },
			data: updateData,
			select: {
				id: true,
				type_fichier: true,
				reference: true,
				role: true,
				nom_fichier: true,
				date_insertion: true,
				id_demande: true,
				demande: {
					select: {
						id_demande: true,
						date: true,
						type: true,
						statut: true,
					},
				},
			},
		});

		return fichierModifie;
	} catch (error) {
		throw new Error(`Erreur lors de la modification du fichier: ${error}`);
	}
}

// Supprimer un fichier
export async function supprimerFichier(id: number, nomFichier: string) {
	try {
		// Vérifier que le fichier existe
		const fichier = await prisma.fichier.findUnique({
			where: { id },
		});

		if (!fichier) {
			throw new Error(`Fichier avec l'ID ${id} non trouvé`);
		}

		// Delete file from server
		const uploadDir = path.join(process.cwd(), "uploads", "demandes");
		const filePath = path.join(uploadDir, nomFichier);

		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}

		const fichierSupprime = await prisma.fichier.delete({
			where: { id },
		});

		return fichierSupprime;
	} catch (error) {
		throw new Error(`Erreur lors de la suppression du fichier: ${error}`);
	}
}

// Lister les fichiers par demande
export async function listerFichiersParDemande(id_demande: number) {
	try {
		if (!id_demande || id_demande <= 0) {
			throw new Error("L'ID de la demande est requis");
		}

		// Vérifier que la demande existe
		const demande = await prisma.demande.findUnique({
			where: { id_demande },
		});

		if (!demande) {
			throw new Error(`Demande avec l'ID ${id_demande} non trouvée`);
		}

		const fichiers = await prisma.fichier.findMany({
			where: { id_demande },
			select: {
				id: true,
				type_fichier: true,
				reference: true,
				role: true,
				nom_fichier: true,
				date_insertion: true,
				id_demande: true,
			},
		});

		return fichiers;
	} catch (error) {
		throw new Error(`Erreur lors de la récupération des fichiers: ${error}`);
	}
}

// Obtenir le contenu du fichier pour téléchargement
export async function obtenirContenuFichier(id: number) {
	try {
		const fichier = await prisma.fichier.findUnique({
			where: { id },
		});

		if (!fichier) {
			throw new Error(`Fichier avec l'ID ${id} non trouvé`);
		}

		const uploadDir = path.join(process.cwd(), "uploads", "demandes");
		const filePath = path.join(uploadDir, fichier.nom_fichier);

		if (!fs.existsSync(filePath)) {
			throw new Error("Le fichier n'existe pas sur le serveur");
		}

		return {
			path: filePath,
			nom_fichier: fichier.nom_fichier,
			type_fichier: fichier.type_fichier,
			reference: fichier.reference,
		};
	} catch (error) {
		throw new Error(`Erreur lors de la récupération du fichier: ${error}`);
	}
}
