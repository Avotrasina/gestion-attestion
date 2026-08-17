import { Router } from "express";
import * as demandeController from "../controllers/demande.controller";

const demandeRouter = Router();

// GET - Lister toutes les demandes
demandeRouter.route("/demandes").get(demandeController.listerDemandes);

// GET - Lister les demandes par personne
demandeRouter
	.route("/demandes/personne")
	.get(demandeController.listerDemandesParPersonne);

// GET - Lister les demandes par statut
demandeRouter
	.route("/demandes/statut")
	.get(demandeController.listerDemandesParStatut);

// POST - Créer une demande
demandeRouter.route("/demandes").post(demandeController.ajouterDemande);

// PUT - Modifier une demande
demandeRouter.route("/demandes/:id").put(demandeController.modifierDemande);

// DELETE - Supprimer une demande
demandeRouter
	.route("/demandes/:id")
	.get(demandeController.obtenirDemandeParId)
	.delete(demandeController.supprimerDemande);

export default demandeRouter;
