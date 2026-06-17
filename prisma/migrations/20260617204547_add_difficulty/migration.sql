-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Puzzle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "grid" TEXT NOT NULL,
    "hints" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'hard',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Puzzle" ("active", "createdAt", "grid", "height", "hints", "id", "name", "width") SELECT "active", "createdAt", "grid", "height", "hints", "id", "name", "width" FROM "Puzzle";
DROP TABLE "Puzzle";
ALTER TABLE "new_Puzzle" RENAME TO "Puzzle";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
