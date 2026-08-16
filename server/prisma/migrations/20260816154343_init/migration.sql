-- CreateTable
CREATE TABLE "Personne" (
    "id_personne" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "sexe" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Etudiant" (
    "id_personne" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "universite" TEXT NOT NULL,
    "annee_etude" INTEGER NOT NULL,
    "filiere" TEXT NOT NULL,
    CONSTRAINT "Etudiant_id_personne_fkey" FOREIGN KEY ("id_personne") REFERENCES "Personne" ("id_personne") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Personnel" (
    "id_personne" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matricule" TEXT NOT NULL,
    "date_entree" TEXT NOT NULL,
    "contrat" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "id_fonction" INTEGER NOT NULL,
    CONSTRAINT "Personnel_id_personne_fkey" FOREIGN KEY ("id_personne") REFERENCES "Personne" ("id_personne") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Personnel_id_fonction_fkey" FOREIGN KEY ("id_fonction") REFERENCES "Fonction" ("id_fonction") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fonction" (
    "id_fonction" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom_fonction" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Unite" (
    "id_unite" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_personne" INTEGER NOT NULL,
    CONSTRAINT "Unite_id_personne_fkey" FOREIGN KEY ("id_personne") REFERENCES "Personne" ("id_personne") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Agence" (
    "id_unite" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code_agence" TEXT NOT NULL,
    "nom_agence" TEXT NOT NULL,
    CONSTRAINT "Agence_id_unite_fkey" FOREIGN KEY ("id_unite") REFERENCES "Unite" ("id_unite") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Direction" (
    "id_unite" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code_direction" TEXT NOT NULL,
    "nom_direction" TEXT NOT NULL,
    CONSTRAINT "Direction_id_unite_fkey" FOREIGN KEY ("id_unite") REFERENCES "Unite" ("id_unite") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Demande" (
    "id_demande" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "id_personne" INTEGER NOT NULL,
    "id_fichier" INTEGER,
    CONSTRAINT "Demande_id_personne_fkey" FOREIGN KEY ("id_personne") REFERENCES "Personne" ("id_personne") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Demande_id_fichier_fkey" FOREIGN KEY ("id_fichier") REFERENCES "Fichier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fichier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL,
    "nom_fichier" TEXT NOT NULL,
    "date_insertion" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Personne_email_key" ON "Personne"("email");
