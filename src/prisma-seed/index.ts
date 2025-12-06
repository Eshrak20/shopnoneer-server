import { PrismaClient } from "@prisma/client";
import { divisions } from "./divisions";
import { districts } from "./districts";
import { upazilas } from "./upazilas";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Started...\n");

  // ----- 1. Insert Divisions -----
  await prisma.division.createMany({
    data: divisions,
    skipDuplicates: true,
  });

  // ----- 2. Insert Districts -----
  // ----- 2. Insert Districts -----
  for (const district of districts) {
    const division = await prisma.division.findUnique({
      where: { code: district.divisionCode },
    });

    await prisma.district.upsert({
      where: { code: district.code },
      update: {}, // no need to update
      create: {
        name_en: district.name_en,
        name_bn: district.name_bn,
        code: district.code,
        divisionId: division!.id,
      },
    });
  }

  // ----- 3. Insert Upazilas / Thanas -----
  for (const upa of upazilas) {
    const district = await prisma.district.findUnique({
      where: { code: upa.districtCode },
    });

    await prisma.upazila.upsert({
      where: { code: upa.code },
      update: {}, // no need to update
      create: {
        type: upa.type,
        name_en: upa.name_en,
        name_bn: upa.name_bn,
        code: upa.code,
        districtId: district!.id,
      },
    });
  }

  console.log("\nSeeding Completed!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
