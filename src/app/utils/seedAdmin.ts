// prisma/seedAdmin.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { envVars } from "../config/env";

const prisma = new PrismaClient();

export const seedSuperAdmin = async () => {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: envVars.ADMIN_EMAIL },
    });

    if (existingAdmin) {
      console.log("Admin already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const admin = await prisma.user.create({
      data: {
        email: envVars.ADMIN_EMAIL,
        password: hashedPassword,
        role_id: 1, // ADMIN
      },
    });

    console.log("Admin created successfully:", admin);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
