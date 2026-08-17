import express from "express";
import fonctionRouter from "./routes/fonction.route";

const app = express();

app.use(express.json());

app.use('/api', fonctionRouter);  


export default app;