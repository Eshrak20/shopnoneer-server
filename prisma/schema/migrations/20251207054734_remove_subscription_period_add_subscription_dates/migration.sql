/*
  Warnings:

  - You are about to drop the column `subscription_period` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "subscription_period",
ADD COLUMN     "subscription_end" TIMESTAMP(3),
ADD COLUMN     "subscription_start" TIMESTAMP(3);
