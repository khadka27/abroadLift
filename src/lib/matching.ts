import { StudentProfile, University } from "@prisma/client";

type EligibilityStatus = "ELIGIBLE" | "PARTIALLY_ELIGIBLE" | "NOT_ELIGIBLE";

export function calculateMatchEligibility(
  student: StudentProfile,
  university: University,
): EligibilityStatus {
  if (
    !student.yearlyBudget ||
    !student.englishScore ||
    !student.degreeLevel ||
    !student.preferredCountry
  ) {
    return "NOT_ELIGIBLE";
  }

  const totalCost = university.tuitionFee + university.avgLivingCost;
  const budgetGap = totalCost - student.yearlyBudget;

  const meetsAcademic = student.degreeLevel === university.degreeLevel;
  const meetsLanguage = student.englishScore >= university.ieltsRequirement;
  const meetsLocation = student.preferredCountry === university.country;

  if (!meetsAcademic || !meetsLanguage || !meetsLocation) {
    return "NOT_ELIGIBLE";
  }

  if (student.yearlyBudget >= totalCost) {
    return "ELIGIBLE";
  }

  const percentageShort = (budgetGap / totalCost) * 100;
  if (
    percentageShort <= 20 ||
    student.scholarshipNeeded ||
    student.loanWilling
  ) {
    return "PARTIALLY_ELIGIBLE";
  }

  return "NOT_ELIGIBLE";
}
