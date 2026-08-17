import { Router } from "express";
import * as uniteController from "../controllers/unite.controller";

const uniteRouter = Router();

// GET - Lister toutes les Unites
uniteRouter.route("/unites").get(uniteController.listerUnites);

// POST - Créer une unité
uniteRouter.route("/unites").post(uniteController.ajouterUnite);

// PUT - Modifier une unité
uniteRouter.route("/unites/:id").put(uniteController.modifierUnite);

// DELETE - Supprimer une unité
uniteRouter
	.route("/unites/:id")
	.get(uniteController.obtenirUniteParId)
	.delete(uniteController.supprimerUnite);

export default uniteRouter;
