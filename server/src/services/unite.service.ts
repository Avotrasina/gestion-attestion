import prisma from "../utils/client";

// Lister toutes les unités
export async function listerUnites() {
	try {
		const unites = await prisma.unite.findMany({
			select: {
				id_unite: true,
				code: true,
				nom: true,
				type: true,
			},
		});
		return unites;
	} catch (error) {
		throw new Error(`Erreur lors de la récupération des unités: ${error}`);
	}
}

// Créer une nouvelle unité
export async function creerUnite(data: {
	code: string;
	nom: string;
	type: string;
}) {
	try {
		if (!data.code || data.code.trim() === "") {
			throw new Error("Le code de l'unité est requis");
		}

		if (!data.nom || data.nom.trim() === "") {
			throw new Error("Le nom de l'unité est requis");
		}

		if (!data.type || data.type.trim() === "") {
			throw new Error("Le type de l'unité est requis");
		}

		const validTypes = ["AGENCE", "DIRECTION"];
		if (!validTypes.includes(data.type.toUpperCase())) {
			throw new Error("Le type doit être AGENCE ou DIRECTION");
		}

		const unite = await prisma.unite.create({
			data: {
				code: data.code,
				nom: data.nom,
				type: data.type.toUpperCase() as "AGENCE" | "DIRECTION",
			},
			select: {
				id_unite: true,
				code: true,
				nom: true,
				type: true,
			},
		});
		return unite;
	} catch (error) {
		throw new Error(`Erreur lors de la création de l'unité: ${error}`);
	}
}

// Récupérer une unité par ID
export async function obtenirUnite(id_unite: number) {
	try {
		const unite = await prisma.unite.findUnique({
			where: {
				id_unite,
			},
			select: {
				id_unite: true,
				code: true,
				nom: true,
				type: true,
			},
		});

		if (!unite) {
			throw new Error(`Unité avec l'ID ${id_unite} non trouvée`);
		}

		return unite;
	} catch (error) {
		throw new Error(`Erreur lors de la récupération de l'unité: ${error}`);
	}
}

// Modifier une unité
export async function modifierUnite(
	id_unite: number,
	data: { code?: string; nom?: string; type?: string },
) {
	try {
		if (data.code !== undefined && data.code.trim() === "") {
			throw new Error("Le code de l'unité ne peut pas être vide");
		}

		if (data.nom !== undefined && data.nom.trim() === "") {
			throw new Error("Le nom de l'unité ne peut pas être vide");
		}

		if (data.type !== undefined && data.type.trim() === "") {
			throw new Error("Le type de l'unité ne peut pas être vide");
		}

		if (data.type !== undefined) {
			const validTypes = ["AGENCE", "DIRECTION"];
			if (!validTypes.includes(data.type.toUpperCase())) {
				throw new Error("Le type doit être AGENCE ou DIRECTION");
			}
		}

		// Vérifier que l'unité existe
		const unite = await prisma.unite.findUnique({
			where: { id_unite },
		});

		if (!unite) {
			throw new Error(`Unité avec l'ID ${id_unite} non trouvée`);
		}

		const updateData: any = {};
		if (data.code !== undefined) updateData.code = data.code;
		if (data.nom !== undefined) updateData.nom = data.nom;
		if (data.type !== undefined) updateData.type = data.type.toUpperCase();

		const uniteModifiee = await prisma.unite.update({
			where: { id_unite },
			data: updateData,
			select: {
				id_unite: true,
				code: true,
				nom: true,
				type: true,
			},
		});

		return uniteModifiee;
	} catch (error) {
		throw new Error(`Erreur lors de la modification de l'unité: ${error}`);
	}
}

// Supprimer une unité
export async function supprimerUnite(id_unite: number) {
	try {
		// Vérifier que l'unité existe
		const unite = await prisma.unite.findUnique({
			where: { id_unite },
		});

		if (!unite) {
			throw new Error(`Unité avec l'ID ${id_unite} non trouvée`);
		}

		const uniteSupprimee = await prisma.unite.delete({
			where: { id_unite },
		});

		return uniteSupprimee;
	} catch (error) {
		throw new Error(`Erreur lors de la suppression de l'unité: ${error}`);
	}
}
