-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "age" INTEGER,
    "occupation" TEXT,
    "religion" TEXT,
    "presentAddress" TEXT,
    "permanentAddress" TEXT,
    "preferableAddress" TEXT,
    "presentDivision" TEXT,
    "permanentDivision" TEXT,
    "preferableDivision" TEXT,
    "presentDistrict" TEXT,
    "permanentDistrict" TEXT,
    "preferableDistrict" TEXT,
    "presentUpazila" TEXT,
    "permanentUpazila" TEXT,
    "preferableUpazila" TEXT,
    "monthlyIncome" DOUBLE PRECISION,
    "familyMembers" INTEGER,
    "preferableFlat" TEXT,
    "preferableFlatSize" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
