/*
  Warnings:

  - Added the required column `type_fichier` to the `Fichier` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Fichier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type_fichier" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "nom_fichier" TEXT NOT NULL,
    "date_insertion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_demande" INTEGER NOT NULL,
    CONSTRAINT "Fichier_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "Demande" ("id_demande") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Fichier" ("date_insertion", "id", "id_demande", "nom_fichier", "role") SELECT "date_insertion", "id", "id_demande", "nom_fichier", "role" FROM "Fichier";
DROP TABLE "Fichier";
ALTER TABLE "new_Fichier" RENAME TO "Fichier";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
