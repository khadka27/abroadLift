import prisma from "./src/lib/db";
const dotenv = require("dotenv");
dotenv.config();

async function main() {
  const userId = "8f1a360c-cc1f-4e20-ae9f-373e1df040bc"; // From user logs
  const count = await prisma.matchingRecord.count({
    where: { userId }
  });
  console.log(`Matching records for user ${userId}: ${count}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
