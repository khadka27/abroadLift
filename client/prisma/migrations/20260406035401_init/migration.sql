-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SAVED', 'APPLIED', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "countryDialCode" TEXT,
    "phoneNumber" TEXT,
    "phoneE164" TEXT,
    "prefersWhatsApp" BOOLEAN NOT NULL DEFAULT true,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "otpCodeHash" TEXT,
    "otpExpiresAt" TIMESTAMP(3),
    "otpLastChannel" TEXT,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nationality" TEXT,
    "currentCountry" TEXT,
    "highestEducation" TEXT,
    "passingYear" TEXT,
    "gpa" DOUBLE PRECISION,
    "backlogs" INTEGER DEFAULT 0,
    "studyGap" INTEGER DEFAULT 0,
    "hasEnglishTest" BOOLEAN,
    "testType" TEXT,
    "englishScore" DOUBLE PRECISION,
    "aptitudeTest" TEXT DEFAULT 'NONE',
    "greVerbal" DOUBLE PRECISION,
    "greQuant" DOUBLE PRECISION,
    "greAwa" DOUBLE PRECISION,
    "gmatTotal" DOUBLE PRECISION,
    "degreeLevel" TEXT,
    "field" TEXT,
    "program" TEXT,
    "preferredCountry" TEXT,
    "intake" TEXT,
    "yearlyBudget" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'USD',
    "bankBalance" DOUBLE PRECISION,
    "sponsorType" TEXT,
    "sponsorIncome" DOUBLE PRECISION,
    "univType" TEXT,
    "cityType" TEXT,
    "duration" INTEGER,
    "scholarshipNeeded" BOOLEAN DEFAULT false,
    "loanWilling" BOOLEAN DEFAULT false,
    "passportReady" BOOLEAN DEFAULT false,
    "testDone" BOOLEAN DEFAULT false,
    "docsReady" BOOLEAN DEFAULT false,
    "admissionProb" DOUBLE PRECISION,
    "visaSuccessProb" DOUBLE PRECISION,
    "estimatedAnnualCost" DOUBLE PRECISION,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "ranking" INTEGER,
    "tuitionFee" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "avgLivingCost" DOUBLE PRECISION NOT NULL,
    "ieltsRequirement" DOUBLE PRECISION NOT NULL,
    "degreeLevel" TEXT NOT NULL,
    "fieldCategory" TEXT NOT NULL,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scholarship" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "coverageAmount" DOUBLE PRECISION NOT NULL,
    "eligibilityCriteria" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SAVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchingRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "universityId" TEXT,
    "formData" JSONB NOT NULL,
    "matchData" JSONB NOT NULL,
    "admissionChance" DOUBLE PRECISION,
    "visaSuccess" DOUBLE PRECISION,
    "costEstimate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaRateCheck" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "degreeLevel" TEXT NOT NULL,
    "fundsAvailable" DOUBLE PRECISION NOT NULL,
    "ieltsScore" DOUBLE PRECISION,
    "pastRejections" INTEGER NOT NULL DEFAULT 0,
    "successRate" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisaRateCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneE164_key" ON "User"("phoneE164");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_studentId_universityId_key" ON "Application"("studentId", "universityId");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchingRecord" ADD CONSTRAINT "MatchingRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchingRecord" ADD CONSTRAINT "MatchingRecord_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaRateCheck" ADD CONSTRAINT "VisaRateCheck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
