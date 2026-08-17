import prisma from "../utils/client";

// Lister toutes les personnes
export async function listerPersonnes() {
	try {
		const personnes = await prisma.personne.findMany({
			select: {
				id_personne: true,
				nom: true,
				prenom: true,
				email: true,
				telephone: true,
				sexe: true,
				id_unite: true,
				etudiant: {
					select: {
						universite: true,
						annee_etude: true,
						filiere: true,
					},
				},
				personnel: {
					select: {
						matricule: true,
						date_entree: true,
						contrat: true,
						categorie: true,
						id_fonction: true,
						fonction: {
							select: {
								id_fonction: true,
								nom_fonction: true,
							},
						},
					},
				},
				demandes: {
					select: {
						id_demande: true,
						date: true,
						type: true,
						statut: true,
					},
				},
			},
		});
		return personnes;
	} catch (error) {
		throw new Error(`Erreur lors de la récupération des personnes: ${error}`);
	}
}

// Créer une nouvelle personne
export async function creerPersonne(data: {
	nom: string;
	prenom: string;
	email: string;
	telephone: string;
	sexe: string;
	id_unite: number | null;
	type: "ETUDIANT" | "PERSONNEL";
	etudiant?: {
		universite: string;
		annee_etude: number;
		filiere: string;
	};
	personnel?: {
		matricule: string;
		date_entree: string;
		contrat: string;
		categorie: string;
		id_fonction: number;
	};
}) {
	try {
		// Validation des champs obligatoires
		if (!data.nom || data.nom.trim() === "") {
			throw new Error("Le nom est requis");
		}
		if (!data.prenom || data.prenom.trim() === "") {
			throw new Error("Le prénom est requis");
		}
		if (!data.email || data.email.trim() === "") {
			throw new Error("L'email est requis");
		}
		if (
			!data.telephone ||
			data.telephone.trim() === "" ||
			data.telephone.length !== 10
		) {
			throw new Error("Le téléphone est requis et de taille 10");
		}
		if (!data.sexe || data.sexe.trim() === "" || !["H", "F"].includes(data.sexe)) {
			throw new Error("Le sexe est requis");
		}
		if (!data.type || !["ETUDIANT", "PERSONNEL"].includes(data.type)) {
			throw new Error("Le type doit être ETUDIANT ou PERSONNEL");
		}

		// Validation par type
		if (data.type === "ETUDIANT") {
			if (!data.etudiant) {
				throw new Error("Les données d'étudiant sont requises");
			}
			if (!data.etudiant.universite || data.etudiant.universite.trim() === "") {
				throw new Error("L'université est requise");
			}
			if (
				data.etudiant.annee_etude === undefined ||
				data.etudiant.annee_etude <= 0
			) {
				throw new Error("L'année d'étude est requise et doit être positive");
			}
			if (!data.etudiant.filiere || data.etudiant.filiere.trim() === "") {
				throw new Error("La filière est requise");
			}
		} else if (data.type === "PERSONNEL") {
			if (!data.personnel) {
				throw new Error("Les données de personnel sont requises");
			}
			if (!data.personnel.matricule || data.personnel.matricule.trim() === "") {
				throw new Error("Le matricule est requis");
			}
			if (!data.personnel.date_entree) {
				throw new Error("La date d'entrée est requise");
			}
			if (!data.personnel.contrat || data.personnel.contrat.trim() === "") {
				throw new Error("Le contrat est requis");
			}
			if (!data.personnel.categorie || data.personnel.categorie.trim() === "") {
				throw new Error("La catégorie est requise");
			}
			if (!data.personnel.id_fonction || data.personnel.id_fonction <= 0) {
				throw new Error("L'ID de fonction est requis");
			}
		}

		// Créer la personne
		let personne;

		if (data.type === "ETUDIANT") {
			personne = await prisma.personne.create({
				data: {
					nom: data.nom,
					prenom: data.prenom,
					email: data.email,
					telephone: data.telephone,
					sexe: data.sexe,
					id_unite: data.id_unite || null,
					etudiant: {
						create: {
							universite: data.etudiant!.universite,
							annee_etude: data.etudiant!.annee_etude,
							filiere: data.etudiant!.filiere,
						},
					},
				},
				select: {
					id_personne: true,
					nom: true,
					prenom: true,
					email: true,
					telephone: true,
					sexe: true,
					id_unite: true,
					etudiant: {
						select: {
							universite: true,
							annee_etude: true,
							filiere: true,
						},
					},
					personnel: true,
					demandes: {
						select: {
							id_demande: true,
							date: true,
							type: true,
							statut: true,
						},
					},
				},
			});
		} else {
			personne = await prisma.personne.create({
				data: {
					nom: data.nom,
					prenom: data.prenom,
					email: data.email,
					telephone: data.telephone,
					sexe: data.sexe,
					id_unite: data.id_unite || null,
					personnel: {
						create: {
							matricule: data.personnel!.matricule,
							date_entree: new Date(data.personnel!.date_entree),
							contrat: data.personnel!.contrat,
							categorie: data.personnel!.categorie,
							id_fonction: data.personnel!.id_fonction,
						},
					},
				},
				select: {
					id_personne: true,
					nom: true,
					prenom: true,
					email: true,
					telephone: true,
					sexe: true,
					id_unite: true,
					etudiant: true,
					personnel: {
						select: {
							matricule: true,
							date_entree: true,
							contrat: true,
							categorie: true,
							id_fonction: true,
							fonction: {
								select: {
									id_fonction: true,
									nom_fonction: true,
								},
							},
						},
					},
					demandes: {
						select: {
							id_demande: true,
							date: true,
							type: true,
							statut: true,
						},
					},
				},
			});
		}

		return personne;
	} catch (error) {
		throw new Error(`Erreur lors de la création de la personne: ${error}`);
	}
}

// Récupérer une personne par ID
export async function obtenirPersonne(id_personne: number) {
	try {
		const personne = await prisma.personne.findUnique({
			where: { id_personne },
			select: {
				id_personne: true,
				nom: true,
				prenom: true,
				email: true,
				telephone: true,
				sexe: true,
				id_unite: true,
				etudiant: {
					select: {
						universite: true,
						annee_etude: true,
						filiere: true,
					},
				},
				personnel: {
					select: {
						matricule: true,
						date_entree: true,
						contrat: true,
						categorie: true,
						id_fonction: true,
						fonction: {
							select: {
								id_fonction: true,
								nom_fonction: true,
							},
						},
					},
				},
				demandes: {
					select: {
						id_demande: true,
						date: true,
						type: true,
						statut: true,
					},
				},
			},
		});

		if (!personne) {
			throw new Error(`Personne avec l'ID ${id_personne} non trouvée`);
		}

		return personne;
	} catch (error) {
		throw new Error(`Erreur lors de la récupération de la personne: ${error}`);
	}
}

// Modifier une personne
export async function modifierPersonne(
	id_personne: number,
	data: {
		nom?: string;
		prenom?: string;
		email?: string;
		telephone?: string;
		sexe?: string;
		id_unite?: number | null;
		etudiant?: {
			universite?: string;
			annee_etude?: number;
			filiere?: string;
		};
		personnel?: {
			matricule?: string;
			date_entree?: string;
			contrat?: string;
			categorie?: string;
		};
	},
) {
	try {
		// Vérifier que la personne existe
		const personne = await prisma.personne.findUnique({
			where: { id_personne },
			select: {
				id_personne: true,
				etudiant: true,
				personnel: true,
			},
		});

		if (!personne) {
			throw new Error(`Personne avec l'ID ${id_personne} non trouvée`);
		}

		// Validation des champs non vides s'ils sont fournis
		if (data.nom !== undefined && data.nom.trim() === "") {
			throw new Error("Le nom ne peut pas être vide");
		}
		if (data.prenom !== undefined && data.prenom.trim() === "") {
			throw new Error("Le prénom ne peut pas être vide");
		}
		if (data.email !== undefined && data.email.trim() === "") {
			throw new Error("L'email ne peut pas être vide");
		}
		if (data.telephone !== undefined && data.telephone.trim() === "") {
			throw new Error("Le téléphone ne peut pas être vide");
		}
		if (data.sexe !== undefined && data.sexe.trim() === "") {
			throw new Error("Le sexe ne peut pas être vide");
		}

		// Construire l'objet de mise à jour pour Personne
		const updateData: any = {};
		if (data.nom !== undefined) updateData.nom = data.nom;
		if (data.prenom !== undefined) updateData.prenom = data.prenom;
		if (data.email !== undefined) updateData.email = data.email;
		if (data.telephone !== undefined) updateData.telephone = data.telephone;
		if (data.sexe !== undefined) updateData.sexe = data.sexe;
		if (data.id_unite !== undefined) updateData.id_unite = data.id_unite;

		// Mettre à jour les données spécifiques d'Etudiant si fournies
		if (data.etudiant) {
			if (!personne.etudiant) {
				throw new Error("Cette personne n'est pas un étudiant");
			}

			if (
				data.etudiant.universite !== undefined &&
				data.etudiant.universite.trim() === ""
			) {
				throw new Error("L'université ne peut pas être vide");
			}
			if (
				data.etudiant.annee_etude !== undefined &&
				data.etudiant.annee_etude <= 0
			) {
				throw new Error("L'année d'étude doit être positive");
			}
			if (
				data.etudiant.filiere !== undefined &&
				data.etudiant.filiere.trim() === ""
			) {
				throw new Error("La filière ne peut pas être vide");
			}

			await prisma.etudiant.update({
				where: { id_personne },
				data: {
					universite: data.etudiant.universite,
					annee_etude: data.etudiant.annee_etude,
					filiere: data.etudiant.filiere,
				},
			});
		}

		// Mettre à jour les données spécifiques de Personnel si fournies
		if (data.personnel) {
			if (!personne.personnel) {
				throw new Error("Cette personne n'est pas un personnel");
			}

			if (
				data.personnel.matricule !== undefined &&
				data.personnel.matricule.trim() === ""
			) {
				throw new Error("Le matricule ne peut pas être vide");
			}
			if (
				data.personnel.contrat !== undefined &&
				data.personnel.contrat.trim() === ""
			) {
				throw new Error("Le contrat ne peut pas être vide");
			}
			if (
				data.personnel.categorie !== undefined &&
				data.personnel.categorie.trim() === ""
			) {
				throw new Error("La catégorie ne peut pas être vide");
			}

			await prisma.personnel.update({
				where: { id_personne },
				data: {
					matricule: data.personnel.matricule,
					date_entree: data.personnel.date_entree
						? new Date(data.personnel.date_entree)
						: undefined,
					contrat: data.personnel.contrat,
					categorie: data.personnel.categorie,
				},
			});
		}

		// Mettre à jour la personne et retourner les données complètes
		const personneModifiee = await prisma.personne.update({
			where: { id_personne },
			data: updateData,
			select: {
				id_personne: true,
				nom: true,
				prenom: true,
				email: true,
				telephone: true,
				sexe: true,
				id_unite: true,
				etudiant: {
					select: {
						universite: true,
						annee_etude: true,
						filiere: true,
					},
				},
				personnel: {
					select: {
						matricule: true,
						date_entree: true,
						contrat: true,
						categorie: true,
						id_fonction: true,
						fonction: {
							select: {
								id_fonction: true,
								nom_fonction: true,
							},
						},
					},
				},
				demandes: {
					select: {
						id_demande: true,
						date: true,
						type: true,
						statut: true,
					},
				},
			},
		});

		return personneModifiee;
	} catch (error) {
		throw new Error(`Erreur lors de la modification de la personne: ${error}`);
	}
}

// Supprimer une personne
export async function supprimerPersonne(id_personne: number) {
	try {
		// Vérifier que la personne existe
		const personne = await prisma.personne.findUnique({
			where: { id_personne },
		});

		if (!personne) {
			throw new Error(`Personne avec l'ID ${id_personne} non trouvée`);
		}

		const personneSupprimee = await prisma.personne.delete({
			where: { id_personne },
		});

		return personneSupprimee;
	} catch (error) {
		throw new Error(`Erreur lors de la suppression de la personne: ${error}`);
	}
}

// Lister les personnes par type (ETUDIANT ou PERSONNEL)
export async function listerPersonnesParType(type: "ETUDIANT" | "PERSONNEL") {
	try {
		if (!type || !["ETUDIANT", "PERSONNEL"].includes(type)) {
			throw new Error("Le type doit être ETUDIANT ou PERSONNEL");
		}

		let personnes;

		if (type === "ETUDIANT") {
			personnes = await prisma.personne.findMany({
				where: {
					etudiant: {
						isNot: null,
					},
				},
				select: {
					id_personne: true,
					nom: true,
					prenom: true,
					email: true,
					telephone: true,
					sexe: true,
					id_unite: true,
					etudiant: {
						select: {
							universite: true,
							annee_etude: true,
							filiere: true,
						},
					},
					demandes: {
						select: {
							id_demande: true,
							date: true,
							type: true,
							statut: true,
						},
					},
				},
			});
		} else {
			personnes = await prisma.personne.findMany({
				where: {
					personnel: {
						isNot: null,
					},
				},
				select: {
					id_personne: true,
					nom: true,
					prenom: true,
					email: true,
					telephone: true,
					sexe: true,
					id_unite: true,
					personnel: {
						select: {
							matricule: true,
							date_entree: true,
							contrat: true,
							categorie: true,
							id_fonction: true,
							fonction: {
								select: {
									id_fonction: true,
									nom_fonction: true,
								},
							},
						},
					},
					demandes: {
						select: {
							id_demande: true,
							date: true,
							type: true,
							statut: true,
						},
					},
				},
			});
		}

		return personnes;
	} catch (error) {
		throw new Error(`Erreur lors de la récupération des ${type}s: ${error}`);
	}
}
