import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/client";

const PASSWORD_SALT_ROUNDS = 12;
const JWT_EXPIRES_IN = "1h";

function getJwtSecret() {
	const secret = process.env.JWT_SECRET;
	if (!secret || secret.length < 32) {
		throw new Error("JWT_SECRET doit contenir au moins 32 caractères");
	}
	return secret;
}

function normalizeEmail(email: string) {
	return email.trim().toLowerCase();
}

function publicUser(user: {
	id: number;
	email: string;
	nom: string;
	prenom: string;
}) {
	return {
		id: user.id,
		email: user.email,
		nom: user.nom,
		prenom: user.prenom,
	};
}

function createToken(userId: number) {
	return jwt.sign({ userId }, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export async function register(data: {
	email: string;
	mdp: string;
	nom: string;
	prenom: string;
}) {
	const email = normalizeEmail(data.email);
	const nom = data.nom.trim();
	const prenom = data.prenom.trim();

	if (!email || !email.includes("@")) throw new Error("Email invalide");
	if (data.mdp.length < 8)
		throw new Error("Le mot de passe doit contenir au moins 8 caractères");
	if (!nom || !prenom) throw new Error("Le nom et le prénom sont requis");

	const passwordHash = await bcrypt.hash(data.mdp, PASSWORD_SALT_ROUNDS);
	try {
		const user = await prisma.user.create({
			data: { email, mdp: passwordHash, nom, prenom },
		});
		return { user: publicUser(user), token: createToken(user.id) };
	} catch (error) {
		if (error instanceof Error && error.message.includes("Unique constraint")) {
			throw new Error("Impossible de créer le compte");
		}
		throw error;
	}
}

export async function login(emailInput: string, password: string) {
	const email = normalizeEmail(emailInput);
	const user = await prisma.user.findUnique({ where: { email } });
	const validPassword = user ? await bcrypt.compare(password, user.mdp) : false;

	if (!user || !validPassword)
		throw new Error("Email ou mot de passe invalide");
	return { user: publicUser(user), token: createToken(user.id) };
}

export function verifyToken(token: string) {
	const payload = jwt.verify(token, getJwtSecret());
	if (typeof payload !== "object" || typeof payload.userId !== "number") {
		throw new Error("Token invalide");
	}
	return payload.userId;
}
