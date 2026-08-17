import express from "express";
import personneRouter from "./routes/personne.route";
import fonctionRouter from "./routes/fonction.route";
import uniteRouter from "./routes/unite.route";
import demandeRouter from "./routes/demande.route";
import fichierRouter from "./routes/fichier.route";
const app = express();

app.use(express.json());

app.use("/api", personneRouter);
app.use("/api", fonctionRouter);
app.use("/api", uniteRouter);
app.use("/api", demandeRouter);
app.use("/api", fichierRouter);

export default app;
