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
  console.log("Cleaning database...");
  await prisma.application.deleteMany();
  await prisma.scholarship.deleteMany();
  await prisma.university.deleteMany();
  await prisma.visaRateCheck.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding database with test user...");

  const hashedPassword = await bcrypt.hash("test@123", 12);

  const testUser = await prisma.user.create({
    data: {
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

  console.log("Seeding universities...");

  const universities = [
    {
      name: "Massachusetts Institute of Technology (MIT)",
      country: "USA",
      city: "Cambridge",
      ranking: 1,
      tuitionFee: 55000,
      currency: "USD",
      avgLivingCost: 20000,
      ieltsRequirement: 7.0,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Engineering & Technology",
      website: "https://web.mit.edu",
    },
    {
      name: "Stanford University",
      country: "USA",
      city: "Stanford",
      ranking: 2,
      tuitionFee: 56000,
      currency: "USD",
      avgLivingCost: 21000,
      ieltsRequirement: 7.0,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Multidisciplinary",
      website: "https://www.stanford.edu",
    },
    {
      name: "University of Oxford",
      country: "UK",
      city: "Oxford",
      ranking: 3,
      tuitionFee: 40000,
      currency: "GBP",
      avgLivingCost: 15000,
      ieltsRequirement: 7.5,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Multidisciplinary",
      website: "https://www.ox.ac.uk",
    },
    {
      name: "University of Cambridge",
      country: "UK",
      city: "Cambridge",
      ranking: 4,
      tuitionFee: 39000,
      currency: "GBP",
      avgLivingCost: 14000,
      ieltsRequirement: 7.5,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Multidisciplinary",
      website: "https://www.cam.ac.uk",
    },
    {
      name: "University of Toronto",
      country: "Canada",
      city: "Toronto",
      ranking: 21,
      tuitionFee: 45000,
      currency: "CAD",
      avgLivingCost: 18000,
      ieltsRequirement: 6.5,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Multidisciplinary",
      website: "https://www.utoronto.ca",
    },
    {
      name: "University of Melbourne",
      country: "Australia",
      city: "Melbourne",
      ranking: 33,
      tuitionFee: 44000,
      currency: "AUD",
      avgLivingCost: 22000,
      ieltsRequirement: 6.5,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Multidisciplinary",
      website: "https://www.unimelb.edu.au",
    },
    {
      name: "National University of Singapore (NUS)",
      country: "Singapore",
      city: "Singapore",
      ranking: 8,
      tuitionFee: 35000,
      currency: "SGD",
      avgLivingCost: 16000,
      ieltsRequirement: 6.5,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Multidisciplinary",
      website: "https://nus.edu.sg",
    },
    {
      name: "ETH Zurich",
      country: "Switzerland",
      city: "Zurich",
      ranking: 11,
      tuitionFee: 1500,
      currency: "CHF",
      avgLivingCost: 24000,
      ieltsRequirement: 7.0,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Science & Technology",
      website: "https://ethz.ch",
    },
    {
      name: "Technical University of Munich",
      country: "Germany",
      city: "Munich",
      ranking: 37,
      tuitionFee: 0,
      currency: "EUR",
      avgLivingCost: 12000,
      ieltsRequirement: 6.5,
      degreeLevel: "Postgraduate",
      fieldCategory: "Engineering",
      website: "https://www.tum.de",
    },
    {
      name: "University of British Columbia",
      country: "Canada",
      city: "Vancouver",
      ranking: 34,
      tuitionFee: 42000,
      currency: "CAD",
      avgLivingCost: 19000,
      ieltsRequirement: 6.5,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Multidisciplinary",
      website: "https://www.ubc.ca",
    },
    {
      name: "UCL (University College London)",
      country: "UK",
      city: "London",
      ranking: 9,
      tuitionFee: 32000,
      currency: "GBP",
      avgLivingCost: 18000,
      ieltsRequirement: 7.0,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Multidisciplinary",
      website: "https://www.ucl.ac.uk",
    },
    {
      name: "University of Sydney",
      country: "Australia",
      city: "Sydney",
      ranking: 19,
      tuitionFee: 48000,
      currency: "AUD",
      avgLivingCost: 24000,
      ieltsRequirement: 7.0,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Multidisciplinary",
      website: "https://www.sydney.edu.au",
    },
    {
      name: "McGill University",
      country: "Canada",
      city: "Montreal",
      ranking: 30,
      tuitionFee: 35000,
      currency: "CAD",
      avgLivingCost: 15000,
      ieltsRequirement: 6.5,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Multidisciplinary",
      website: "https://www.mcgill.ca",
    },
    {
      name: "TU Berlin",
      country: "Germany",
      city: "Berlin",
      ranking: 154,
      tuitionFee: 0,
      currency: "EUR",
      avgLivingCost: 11000,
      ieltsRequirement: 6.5,
      degreeLevel: "Postgraduate",
      fieldCategory: "Technology",
      website: "https://www.tu.berlin",
    },
    {
      name: "Australian National University",
      country: "Australia",
      city: "Canberra",
      ranking: 30,
      tuitionFee: 47000,
      currency: "AUD",
      avgLivingCost: 20000,
      ieltsRequirement: 6.5,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Research",
      website: "https://www.anu.edu.au",
    },
    {
      name: "Imperial College London",
      country: "UK",
      city: "London",
      ranking: 6,
      tuitionFee: 36000,
      currency: "GBP",
      avgLivingCost: 19000,
      ieltsRequirement: 7.0,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Science & Medicine",
      website: "https://www.imperial.ac.uk",
    },
    {
      name: "King's College London",
      country: "UK",
      city: "London",
      ranking: 40,
      tuitionFee: 31000,
      currency: "GBP",
      avgLivingCost: 17500,
      ieltsRequirement: 7.0,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Humanities & Social Sciences",
      website: "https://www.kcl.ac.uk",
    },
    {
      name: "University of Waterloo",
      country: "Canada",
      city: "Waterloo",
      ranking: 112,
      tuitionFee: 38000,
      currency: "CAD",
      avgLivingCost: 14000,
      ieltsRequirement: 6.5,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Computer Science & Math",
      website: "https://uwaterloo.ca",
    },
    {
      name: "University of Manchester",
      country: "UK",
      city: "Manchester",
      ranking: 32,
      tuitionFee: 28000,
      currency: "GBP",
      avgLivingCost: 13000,
      ieltsRequirement: 6.5,
      degreeLevel: "Undergraduate, Postgraduate",
      fieldCategory: "Engineering & Multidisciplinary",
      website: "https://www.manchester.ac.uk",
    }
  ];

  for (const uniData of universities) {
    await prisma.university.create({
      data: uniData,
    });
  }

  console.log("✅ Universities seeded");

  console.log("Seeding scholarships...");

  const scholarships = [
    {
      name: "Global Excellence Scholarship",
      country: "Global",
      coverageAmount: 10000,
      eligibilityCriteria: "Excellent academic record (GPA 3.8+). Open to all international students.",
      deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
    {
      name: "Women in STEM Support Grant",
      country: "USA",
      coverageAmount: 15000,
      eligibilityCriteria: "Female identifying students pursuing STEM fields in the USA.",
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    },
    {
      name: "Chevening Scholarships",
      country: "UK",
      coverageAmount: 35000,
      eligibilityCriteria: "Future leaders from eligible countries with required work experience.",
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 5)),
    },
    {
      name: "Canada Graduate Scholarships",
      country: "Canada",
      coverageAmount: 17500,
      eligibilityCriteria: "High academic standing, researching at Canadian Institutions.",
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    }
  ];

  for (const schData of scholarships) {
    await prisma.scholarship.create({
      data: schData,
    });
  }

  console.log("✅ Scholarships seeded");
}

main()
  .catch((e) => {
    require("fs").writeFileSync("seed_error_raw.txt", e.message + "\n\n" + e.stack);
    console.error("❌ Seed error written to seed_error_raw.txt");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
