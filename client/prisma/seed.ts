import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database with test user...");

  const hashedPassword = await bcrypt.hash("test@123", 12);

  const testUser = await prisma.user.upsert({
    where: { email: "test@gmail.com" },
    update: {},
    create: {
      username: "test123",
      email: "test@gmail.com",
      name: "Test User",
      password: hashedPassword,
      countryDialCode: "+91",
      phoneNumber: "9876543220",
      phoneE164: "+919876543220",
      prefersWhatsApp: true,
      phoneVerified: false,
      role: "STUDENT",
      profile: {
        create: {
          nationality: "India",
          currentCountry: "India",
        },
      },
    },
  });

  console.log(`✅ Test user created: ${testUser.username} (${testUser.email})`);
  console.log(`   Phone: +91 9876543220`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
