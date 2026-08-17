import prisma from "../utils/client";

// Lister toutes les fonctions
export async function listerFonctions() {
	try {
		const fonctions = await prisma.fonction.findMany({
			select: {
				id_fonction: true,
				nom_fonction: true
			}
		});
		return fonctions;
	} catch (error) {
		throw new Error(`Erreur lors de la récupération des fonctions: ${error}`);
	}
}

// Créer une nouvelle fonction
export async function creerFonction(data: { nom_fonction: string }) {
	try {
		if (!data.nom_fonction || data.nom_fonction.trim() === "") {
			throw new Error("Le nom de la fonction est requis");
		}

		const fonction = await prisma.fonction.create({
			data: {
				nom_fonction: data.nom_fonction,			
			},
			select: {
				id_fonction: true,
				nom_fonction: true
			}
		});
		return fonction;
	} catch (error) {
		throw new Error(`Erreur lors de la création de la fonction: ${error}`);
	}
}

// Récupérer une fonction par ID
export async function obtenirFonction(id_fonction: number) {
	try {
		const fonction = await prisma.fonction.findUnique({
			where: {
				id_fonction
			},
			select: {
				id_fonction: true,
				nom_fonction: true
			}
		});

		if (!fonction) {
			throw new Error(`Fonction avec l'ID ${id_fonction} non trouvée`);
		}

		return fonction;
	} catch (error) {
		throw new Error(`Erreur lors de la récupération de la fonction: ${error}`);
	}
}

// Modifier une fonction
export async function modifierFonction(
	id_fonction: number,
	data: { nom_fonction: string },
) {
	try {
		if (!data.nom_fonction || data.nom_fonction.trim() === "") {
			throw new Error("Le nom de la fonction est requis");
		}

		// Vérifier que la fonction existe
		const fonction = await prisma.fonction.findUnique({
			where: { id_fonction },
		});

		if (!fonction) {
			throw new Error(`Fonction avec l'ID ${id_fonction} non trouvée`);
		}

		const fonctionModifiee = await prisma.fonction.update({
			where: { id_fonction },
			data: {
				nom_fonction: data.nom_fonction,
			},
			select: {
				id_fonction: true,
				nom_fonction: true
			}
		});

		return fonctionModifiee;
	} catch (error) {
		throw new Error(`Erreur lors de la modification de la fonction: ${error}`);
	}
}

// Supprimer une fonction
export async function supprimerFonction(id_fonction: number) {
	try {
		// Vérifier que la fonction existe
		const fonction = await prisma.fonction.findUnique({
			where: { id_fonction }
		});

		if (!fonction) {
			throw new Error(`Fonction avec l'ID ${id_fonction} non trouvée`);
		}

		const fonctionSupprimee = await prisma.fonction.delete({
			where: { id_fonction },
		});

		return fonctionSupprimee;
	} catch (error) {
		throw new Error(`Erreur lors de la suppression de la fonction: ${error}`);
	}
}
