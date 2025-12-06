-- CreateTable
CREATE TABLE "Facilities" (
    "id" SERIAL NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "upazilaId" INTEGER NOT NULL,

    CONSTRAINT "Facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Housing" (
    "id" SERIAL NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "upazilaId" INTEGER NOT NULL,

    CONSTRAINT "Housing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "housing_facilities" (
    "id" SERIAL NOT NULL,
    "housingId" INTEGER NOT NULL,
    "facilityId" INTEGER NOT NULL,

    CONSTRAINT "housing_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "housing_facilities_housingId_facilityId_key" ON "housing_facilities"("housingId", "facilityId");

-- AddForeignKey
ALTER TABLE "Facilities" ADD CONSTRAINT "Facilities_upazilaId_fkey" FOREIGN KEY ("upazilaId") REFERENCES "Upazila"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Housing" ADD CONSTRAINT "Housing_upazilaId_fkey" FOREIGN KEY ("upazilaId") REFERENCES "Upazila"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "housing_facilities" ADD CONSTRAINT "housing_facilities_housingId_fkey" FOREIGN KEY ("housingId") REFERENCES "Housing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "housing_facilities" ADD CONSTRAINT "housing_facilities_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
