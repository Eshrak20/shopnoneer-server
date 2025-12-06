/*
  Warnings:

  - You are about to drop the column `amenityId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Project` table. All the data in the column will be lost.
  - Added the required column `name_bn` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_amenityId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "amenityId",
DROP COLUMN "title",
ADD COLUMN     "name_bn" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT NOT NULL;
