import { Router } from "express";

import * as personneController from "../controllers/personne.controller";

const personneRouter = Router();

// GET - Lister toutes les Personnes
personneRouter.route("/personnes").get(personneController.listerPersonnes);

// GET - Lister les personnes par type (ETUDIANT ou PERSONNEL)
personneRouter
	.route("/personnes/type")
	.get(personneController.listerPersonnesParType);

// POST - Créer une personne
personneRouter.route("/personnes").post(personneController.ajouterPersonne);

// PUT - Modifier une personne
personneRouter.route("/personnes/:id").put(personneController.modifierPersonne);

// DELETE - Supprimer une personne
personneRouter
	.route("/personnes/:id")
	.get(personneController.obtenirPersonneParId)
	.delete(personneController.supprimerPersonne);

export default personneRouter;
