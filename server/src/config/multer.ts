import multer from "multer";
import path from "path";
import fs from "fs";

// Define upload directory structure
const uploadDir = path.join(process.cwd(), "uploads");
const demandesDir = path.join(uploadDir, "demandes");

// Ensure directories exist
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(demandesDir)) {
	fs.mkdirSync(demandesDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		// Store all files in demandes folder with id structure
		cb(null, demandesDir);
	},
	filename: (req, file, cb) => {
		// Generate unique filename with timestamp
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname);
		const name = path.basename(file.originalname, ext);
		cb(null, `${name}-${uniqueSuffix}${ext}`);
	},
});

// Filter to accept only common document types
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
	const allowedMimes = [
		"application/pdf",
		"image/jpeg",
		"image/png",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.ms-excel",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	];

	if (allowedMimes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Type de fichier non accepté"));
	}
};

export const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB
	},
});

export { demandesDir as uploadDir };
