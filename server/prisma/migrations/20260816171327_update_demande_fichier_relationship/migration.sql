/*
  Warnings:

  - You are about to drop the column `id_fichier` on the `Demande` table. All the data in the column will be lost.
  - You are about to alter the column `date` on the `Demande` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `date_insertion` on the `Fichier` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `date_entree` on the `Personnel` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to drop the column `id_personne` on the `Unite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code_agence]` on the table `Agence` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code_direction]` on the table `Direction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_demande` to the `Fichier` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Demande" (
    "id_demande" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "id_personne" INTEGER NOT NULL,
    CONSTRAINT "Demande_id_personne_fkey" FOREIGN KEY ("id_personne") REFERENCES "Personne" ("id_personne") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Demande" ("date", "id_demande", "id_personne", "statut", "type") SELECT "date", "id_demande", "id_personne", "statut", "type" FROM "Demande";
DROP TABLE "Demande";
ALTER TABLE "new_Demande" RENAME TO "Demande";
CREATE TABLE "new_Fichier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL,
    "nom_fichier" TEXT NOT NULL,
    "date_insertion" DATETIME NOT NULL,
    "id_demande" INTEGER NOT NULL,
    CONSTRAINT "Fichier_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "Demande" ("id_demande") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Fichier" ("date_insertion", "id", "nom_fichier", "role") SELECT "date_insertion", "id", "nom_fichier", "role" FROM "Fichier";
DROP TABLE "Fichier";
ALTER TABLE "new_Fichier" RENAME TO "Fichier";
CREATE TABLE "new_Personne" (
    "id_personne" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "sexe" TEXT NOT NULL,
    "id_unite" INTEGER,
    CONSTRAINT "Personne_id_unite_fkey" FOREIGN KEY ("id_unite") REFERENCES "Unite" ("id_unite") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Personne" ("email", "id_personne", "nom", "prenom", "sexe", "telephone") SELECT "email", "id_personne", "nom", "prenom", "sexe", "telephone" FROM "Personne";
DROP TABLE "Personne";
ALTER TABLE "new_Personne" RENAME TO "Personne";
CREATE UNIQUE INDEX "Personne_email_key" ON "Personne"("email");
CREATE TABLE "new_Personnel" (
    "id_personne" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matricule" TEXT NOT NULL,
    "date_entree" DATETIME NOT NULL,
    "contrat" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "id_fonction" INTEGER NOT NULL,
    CONSTRAINT "Personnel_id_personne_fkey" FOREIGN KEY ("id_personne") REFERENCES "Personne" ("id_personne") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Personnel_id_fonction_fkey" FOREIGN KEY ("id_fonction") REFERENCES "Fonction" ("id_fonction") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Personnel" ("categorie", "contrat", "date_entree", "id_fonction", "id_personne", "matricule") SELECT "categorie", "contrat", "date_entree", "id_fonction", "id_personne", "matricule" FROM "Personnel";
DROP TABLE "Personnel";
ALTER TABLE "new_Personnel" RENAME TO "Personnel";
CREATE UNIQUE INDEX "Personnel_matricule_key" ON "Personnel"("matricule");
CREATE TABLE "new_Unite" (
    "id_unite" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);
INSERT INTO "new_Unite" ("id_unite") SELECT "id_unite" FROM "Unite";
DROP TABLE "Unite";
ALTER TABLE "new_Unite" RENAME TO "Unite";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Agence_code_agence_key" ON "Agence"("code_agence");

-- CreateIndex
CREATE UNIQUE INDEX "Direction_code_direction_key" ON "Direction"("code_direction");
