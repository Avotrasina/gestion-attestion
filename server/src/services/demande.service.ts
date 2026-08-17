import prisma from "../utils/client";

// Lister toutes les demandes
export async function listerDemandes() {
	try {
		const demandes = await prisma.demande.findMany({
			select: {
				id_demande: true,
				date: true,
				type: true,
				statut: true,
				id_personne: true,
				personne: {
					select: {
						id_personne: true,
						nom: true,
						prenom: true,
						email: true,
						telephone: true,
					},
				},
				fichiers: {
					select: {
						id: true,
						type_fichier: true,
						role: true,
						nom_fichier: true,
						date_insertion: true,
					},
				},
			},
		});
		return demandes;
	} catch (error) {
		throw new Error(`Erreur lors de la récupération des demandes: ${error}`);
	}
}

// Créer une nouvelle demande
export async function creerDemande(data: {
	date: string;
	type: string;
	statut: string;
	id_personne: number;
}) {
	try {
		if (!data.date || data.date.trim() === "") {
			throw new Error("La date est requise");
		}

		if (!data.type || data.type.trim() === "") {
			throw new Error("Le type est requis");
		}

		if (!data.statut || data.statut.trim() === "") {
			throw new Error("Le statut est requis");
		}

		const validStatuts = [
			"enregistree",
			"en_attente_de_recuperation",
			"recuperee",
		];
		if (!validStatuts.includes(data.statut.toLowerCase())) {
			throw new Error(
				"Le statut doit être l'un de: enregistree, en_attente_de_recuperation, recuperee",
			);
		}

		if (!data.id_personne || data.id_personne <= 0) {
			throw new Error("L'ID de la personne est requis");
		}

		// Vérifier que la personne existe
		const personne = await prisma.personne.findUnique({
			where: { id_personne: data.id_personne },
		});

		if (!personne) {
			throw new Error(`Personne avec l'ID ${data.id_personne} non trouvée`);
		}

		const demande = await prisma.demande.create({
			data: {
				date: new Date(data.date),
				type: data.type,
				statut: data.statut,
				id_personne: data.id_personne,
			},
			select: {
				id_demande: true,
				date: true,
				type: true,
				statut: true,
				id_personne: true,
				personne: {
					select: {
						id_personne: true,
						nom: true,
						prenom: true,
						email: true,
						telephone: true,
					},
				},
				fichiers: {
					select: {
						id: true,
						type_fichier: true,
						role: true,
						nom_fichier: true,
						date_insertion: true,
					},
				},
			},
		});
		return demande;
	} catch (error) {
		throw new Error(`Erreur lors de la création de la demande: ${error}`);
	}
}

// Récupérer une demande par ID
export async function obtenirDemande(id_demande: number) {
	try {
		const demande = await prisma.demande.findUnique({
			where: {
				id_demande,
			},
			select: {
				id_demande: true,
				date: true,
				type: true,
				statut: true,
				id_personne: true,
				personne: {
					select: {
						id_personne: true,
						nom: true,
						prenom: true,
						email: true,
						telephone: true,
					},
				},
				fichiers: {
					select: {
						id: true,
						type_fichier: true,
						role: true,
						nom_fichier: true,
						date_insertion: true,
					},
				},
			},
		});

		if (!demande) {
			throw new Error(`Demande avec l'ID ${id_demande} non trouvée`);
		}

		return demande;
	} catch (error) {
		throw new Error(`Erreur lors de la récupération de la demande: ${error}`);
	}
}

// Modifier une demande
export async function modifierDemande(
	id_demande: number,
	data: {
		date?: string;
		type?: string;
		statut?: string;
		id_personne?: number;
	},
) {
	try {
		if (data.date !== undefined && data.date.trim() === "") {
			throw new Error("La date ne peut pas être vide");
		}

		if (data.type !== undefined && data.type.trim() === "") {
			throw new Error("Le type ne peut pas être vide");
		}

		if (data.statut !== undefined && data.statut.trim() === "") {
			throw new Error("Le statut ne peut pas être vide");
		}

		if (data.statut !== undefined) {
			const validStatuts = [
				"enregistree",
				"en_attente_de_recuperation",
				"recuperee",
			];
			if (!validStatuts.includes(data.statut.toLowerCase())) {
				throw new Error(
					"Le statut doit être l'un de: enregistree, en_attente_de_recuperation, recuperee",
				);
			}
		}

		if (data.id_personne !== undefined && data.id_personne <= 0) {
			throw new Error("L'ID de la personne doit être valide");
		}

		// Vérifier que la demande existe
		const demande = await prisma.demande.findUnique({
			where: { id_demande },
		});

		if (!demande) {
			throw new Error(`Demande avec l'ID ${id_demande} non trouvée`);
		}

		// Vérifier que la personne existe si elle est modifiée
		if (data.id_personne !== undefined) {
			const personne = await prisma.personne.findUnique({
				where: { id_personne: data.id_personne },
			});

			if (!personne) {
				throw new Error(`Personne avec l'ID ${data.id_personne} non trouvée`);
			}
		}

		const updateData: any = {};
		if (data.date !== undefined) updateData.date = new Date(data.date);
		if (data.type !== undefined) updateData.type = data.type;
		if (data.statut !== undefined) updateData.statut = data.statut;
		if (data.id_personne !== undefined)
			updateData.id_personne = data.id_personne;

		const demandeModifiee = await prisma.demande.update({
			where: { id_demande },
			data: updateData,
			select: {
				id_demande: true,
				date: true,
				type: true,
				statut: true,
				id_personne: true,
				personne: {
					select: {
						id_personne: true,
						nom: true,
						prenom: true,
						email: true,
						telephone: true,
					},
				},
				fichiers: {
					select: {
						id: true,
						type_fichier: true,
						role: true,
						nom_fichier: true,
						date_insertion: true,
					},
				},
			},
		});

		return demandeModifiee;
	} catch (error) {
		throw new Error(`Erreur lors de la modification de la demande: ${error}`);
	}
}

// Supprimer une demande
export async function supprimerDemande(id_demande: number) {
	try {
		// Vérifier que la demande existe
		const demande = await prisma.demande.findUnique({
			where: { id_demande },
		});

		if (!demande) {
			throw new Error(`Demande avec l'ID ${id_demande} non trouvée`);
		}

		const demandeSupprimee = await prisma.demande.delete({
			where: { id_demande },
		});

		return demandeSupprimee;
	} catch (error) {
		throw new Error(`Erreur lors de la suppression de la demande: ${error}`);
	}
}

// Lister les demandes par personne
export async function listerDemandesParPersonne(id_personne: number) {
	try {
		if (!id_personne || id_personne <= 0) {
			throw new Error("L'ID de la personne est requis");
		}

		// Vérifier que la personne existe
		const personne = await prisma.personne.findUnique({
			where: { id_personne },
		});

		if (!personne) {
			throw new Error(`Personne avec l'ID ${id_personne} non trouvée`);
		}

		const demandes = await prisma.demande.findMany({
			where: { id_personne },
			select: {
				id_demande: true,
				date: true,
				type: true,
				statut: true,
				id_personne: true,
				personne: {
					select: {
						id_personne: true,
						nom: true,
						prenom: true,
						email: true,
						telephone: true,
					},
				},
				fichiers: {
					select: {
						id: true,
						type_fichier: true,
						role: true,
						nom_fichier: true,
						date_insertion: true,
					},
				},
			},
		});

		return demandes;
	} catch (error) {
		throw new Error(`Erreur lors de la récupération des demandes: ${error}`);
	}
}

// Lister les demandes par statut
export async function listerDemandesParStatut(statut: string) {
	try {
		if (!statut || statut.trim() === "") {
			throw new Error("Le statut est requis");
		}

		const validStatuts = [
			"enregistree",
			"en_attente_de_recuperation",
			"recuperee",
		];
		if (!validStatuts.includes(statut.toLowerCase())) {
			throw new Error(
				"Le statut doit être l'un de: enregistree, en_attente_de_recuperation, recuperee",
			);
		}

		const demandes = await prisma.demande.findMany({
			where: { statut },
			select: {
				id_demande: true,
				date: true,
				type: true,
				statut: true,
				id_personne: true,
				personne: {
					select: {
						id_personne: true,
						nom: true,
						prenom: true,
						email: true,
						telephone: true,
					},
				},
				fichiers: {
					select: {
						id: true,
						type_fichier: true,
						role: true,
						nom_fichier: true,
						date_insertion: true,
					},
				},
			},
		});

		return demandes;
	} catch (error) {
		throw new Error(`Erreur lors de la récupération des demandes: ${error}`);
	}
}
