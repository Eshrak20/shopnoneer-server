/*
  Warnings:

  - Added the required column `type` to the `Upazila` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Upazila" ADD COLUMN     "type" TEXT NOT NULL;
