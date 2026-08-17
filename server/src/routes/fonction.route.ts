import { Router } from "express";

import * as fonctionController from "./../controllers/fonction.controller";
const fonctionRouter = Router();

// GET - List all fonctions
fonctionRouter.route("/fonctions").get(fonctionController.listerFonctions);

// POST - Create a new fonction
fonctionRouter.route("/fonctions").post(fonctionController.ajouterFonction);

// PUT - Update a fonction
fonctionRouter.route("/fonctions/:id").put(fonctionController.modifierFonction);

// DELETE - Delete a fonction
fonctionRouter
	.route("/fonctions/:id")
	.get(fonctionController.obtenirFonctionParId)
	.delete(fonctionController.supprimerFonction);

export default fonctionRouter;
