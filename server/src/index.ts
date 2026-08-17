import express from "express";
import fonctionRouter from "./routes/fonction.route";
import uniteRouter from "./routes/unite.route";
const app = express();

app.use(express.json());

app.use('/api', fonctionRouter);  
app.use('/api', uniteRouter);

export default app;