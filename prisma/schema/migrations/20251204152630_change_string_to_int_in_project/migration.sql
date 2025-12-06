/*
  Warnings:

  - The `no_of_beds` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `no_of_baths` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `no_of_balcony` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rate_per_sqft` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `floor_area` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `floor_no` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `total_price` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "no_of_beds",
ADD COLUMN     "no_of_beds" INTEGER,
DROP COLUMN "no_of_baths",
ADD COLUMN     "no_of_baths" INTEGER,
DROP COLUMN "no_of_balcony",
ADD COLUMN     "no_of_balcony" INTEGER,
DROP COLUMN "rate_per_sqft",
ADD COLUMN     "rate_per_sqft" INTEGER,
DROP COLUMN "floor_area",
ADD COLUMN     "floor_area" INTEGER,
DROP COLUMN "floor_no",
ADD COLUMN     "floor_no" INTEGER,
DROP COLUMN "total_price",
ADD COLUMN     "total_price" INTEGER;
