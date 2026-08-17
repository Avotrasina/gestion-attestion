import { Router } from "express";
import * as fichierController from "../controllers/fichier.controller";
import { upload } from "../config/multer";

const fichierRouter = Router();

// GET - Lister tous les fichiers
fichierRouter.route("/fichiers").get(fichierController.listerFichiers);

// GET - Lister les fichiers par demande
fichierRouter
	.route("/fichiers/demande")
	.get(fichierController.listerFichiersParDemande);

// POST - Créer un fichier avec upload
fichierRouter
	.route("/fichiers")
	.post(upload.single("file"), fichierController.ajouterFichier);

// PUT - Modifier un fichier
fichierRouter.route("/fichiers/:id").put(fichierController.modifierFichier);

// GET - Télécharger un fichier
fichierRouter
	.route("/fichiers/:id/telecharger")
	.get(fichierController.telechargerFichier);

// GET - Afficher un fichier (preview)
fichierRouter
	.route("/fichiers/:id/afficher")
	.get(fichierController.afficherFichier);

// DELETE - Supprimer un fichier
fichierRouter
	.route("/fichiers/:id")
	.get(fichierController.obtenirFichierParId)
	.delete(fichierController.supprimerFichier);

export default fichierRouter;
