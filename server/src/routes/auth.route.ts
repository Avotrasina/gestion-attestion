import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/auth/register", authController.register);
authRouter.post("/auth/login", authController.login);

export default authRouter;
