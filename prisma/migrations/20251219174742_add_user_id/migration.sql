/*
  Warnings:

  - Added the required column `userId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Set a default userId for existing projects
ALTER TABLE "Project" ADD COLUMN "userId" TEXT NOT NULL DEFAULT 'legacy_user';

-- Remove the default for future inserts
ALTER TABLE "Project" ALTER COLUMN "userId" DROP DEFAULT;
