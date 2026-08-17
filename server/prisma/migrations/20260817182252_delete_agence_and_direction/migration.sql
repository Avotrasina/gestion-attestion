/*
  Warnings:

  - You are about to drop the `Agence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Direction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `code` to the `Unite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom` to the `Unite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Unite` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Agence_code_agence_key";

-- DropIndex
DROP INDEX "Direction_code_direction_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Agence";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Direction";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Unite" (
    "id_unite" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Unite" ("id_unite") SELECT "id_unite" FROM "Unite";
DROP TABLE "Unite";
ALTER TABLE "new_Unite" RENAME TO "Unite";
CREATE UNIQUE INDEX "Unite_code_key" ON "Unite"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
