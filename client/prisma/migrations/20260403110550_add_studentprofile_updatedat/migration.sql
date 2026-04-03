/*
  Warnings:

  - You are about to drop the column `englishLevel` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `fieldOfStudy` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `passoutYear` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `recentAcademicField` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "englishLevel",
DROP COLUMN "fieldOfStudy",
DROP COLUMN "passoutYear",
DROP COLUMN "recentAcademicField",
ADD COLUMN     "admissionProb" DOUBLE PRECISION,
ADD COLUMN     "aptitudeTest" TEXT DEFAULT 'NONE',
ADD COLUMN     "backlogs" INTEGER DEFAULT 0,
ADD COLUMN     "bankBalance" DOUBLE PRECISION,
ADD COLUMN     "cityType" TEXT,
ADD COLUMN     "currency" TEXT DEFAULT 'USD',
ADD COLUMN     "docsReady" BOOLEAN DEFAULT false,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "estimatedAnnualCost" DOUBLE PRECISION,
ADD COLUMN     "field" TEXT,
ADD COLUMN     "gmatTotal" DOUBLE PRECISION,
ADD COLUMN     "greAwa" DOUBLE PRECISION,
ADD COLUMN     "greQuant" DOUBLE PRECISION,
ADD COLUMN     "greVerbal" DOUBLE PRECISION,
ADD COLUMN     "hasEnglishTest" BOOLEAN,
ADD COLUMN     "highestEducation" TEXT,
ADD COLUMN     "passingYear" TEXT,
ADD COLUMN     "passportReady" BOOLEAN DEFAULT false,
ADD COLUMN     "program" TEXT,
ADD COLUMN     "sponsorIncome" DOUBLE PRECISION,
ADD COLUMN     "sponsorType" TEXT,
ADD COLUMN     "studyGap" INTEGER DEFAULT 0,
ADD COLUMN     "testDone" BOOLEAN DEFAULT false,
ADD COLUMN     "univType" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "visaSuccessProb" DOUBLE PRECISION;

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

-- AddForeignKey
ALTER TABLE "MatchingRecord" ADD CONSTRAINT "MatchingRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchingRecord" ADD CONSTRAINT "MatchingRecord_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;
