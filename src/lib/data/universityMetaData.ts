export const REAL_ACCEPTANCE_RATES: Record<string, number> = {
  // Canada
  "University of Toronto": 43,
  "McGill University": 46,
  "University of British Columbia": 51,
  "University of Alberta": 58,
  "McMaster University": 58,
  "University of Waterloo": 53,
  "Western University": 31,
  "University of Ottawa": 13,
  "University of Calgary": 15,
  "Dalhousie University": 65,
  "University of Manitoba": 52,
  "University of Saskatchewan": 72,
  "Concordia University": 78,
  "Simon Fraser University": 59,
  "University of Victoria": 63,
  "York University": 27,
  "Carleton University": 21,
  "University of Guelph": 66,
  "Memorial University of Newfoundland": 67,
  "University of New Brunswick": 74,
  "Lakehead University": 83,
  "University of Lethbridge": 93,
  "Thompson Rivers University": 82,

  // UK
  "University of Oxford": 17,
  "University of Cambridge": 21,
  "Imperial College London": 14,
  "University College London": 38,
  "University of Edinburgh": 33,
  "University of Manchester": 56,
  "King's College London": 13,
  "London School of Economics": 9,
  "University of Bristol": 67,
  "University of Warwick": 14,
  "University of Glasgow": 70,
  "University of Birmingham": 14,
  "University of Southampton": 84,
  "University of Leeds": 77,
  "University of Sheffield": 13,
  "University of Nottingham": 14,
  "Queen Mary University of London": 44,
  "University of Liverpool": 14,
  "Newcastle University": 87,
  "University of Exeter": 15,
  "Cardiff University": 19,
  "University of York": 80,
  "University of Bath": 17,
  "Durham University": 18,

  // Australia
  "University of Melbourne": 70,
  "University of Sydney": 30,
  "University of Queensland": 40,
  "University of New South Wales": 30,
  "Australian National University": 35,
  "Monash University": 40,
  "University of Western Australia": 38,
  "University of Adelaide": 75,
  "University of Technology Sydney": 19,
  "University of Wollongong": 75,
  "Curtin University": 50,
  "Macquarie University": 40,
  "RMIT University": 40,
  "La Trobe University": 95,
  "University of Canberra": 88,
  "Charles Sturt University": 80,

  // Germany
  "Technical University of Munich": 8,
  "Ludwig Maximilian University of Munich": 10,
  "Heidelberg University": 17,
  "Humboldt University of Berlin": 18,
  "Free University of Berlin": 15,
  "RWTH Aachen University": 10,
  "Technical University of Berlin": 15,
  "University of Hamburg": 18,
  "University of Freiburg": 15,
  "University of Bonn": 18,
  "University of Goettingen": 29,
  "Karlsruhe Institute of Technology": 20,
  "University of Frankfurt": 20,
  "IU International University of Applied Sciences": 100,

  // Singapore
  "National University of Singapore": 5,
  "Nanyang Technological University": 10,
  "Singapore Management University": 10,

  // Ireland
  "Trinity College Dublin": 33,
  "University College Dublin": 20,
  "University College Cork": 41,

  // Netherlands
  "University of Amsterdam": 14,
  "Delft University of Technology": 15,
  "Wageningen University": 18,
  "Leiden University": 30,
  "Utrecht University": 24,
  "Erasmus University Rotterdam": 20,
  "University of Groningen": 30,
};

export const US_WORLD_RANKINGS: Record<string, number> = {
  "Massachusetts Institute of Technology": 1,
  "Stanford University": 2,
  "Harvard University": 3,
  "California Institute of Technology": 4,
  "University of Oxford": 5, // technically UK, but here for safety
  "University of Cambridge": 6,
  "ETH Zurich": 7,
  "University of California, Berkeley": 10,
  "University of Chicago": 11,
  "University of Pennsylvania": 12,
  "Cornell University": 13,
  "Yale University": 14,
  "Columbia University": 15,
  "Princeton University": 16,
  "Johns Hopkins University": 17,
  "University of Michigan": 21,
  "New York University": 38,
  "University of California, Los Angeles": 44,
  "University of California, San Diego": 48,
  "Georgia Institute of Technology": 88,
  "University of Illinois at Urbana-Champaign": 69,
  "University of Washington": 25,
  "University of Wisconsin-Madison": 83,
  "University of Texas at Austin": 72,
  "Duke University": 50,
  "Northwestern University": 32,
  "Carnegie Mellon University": 52,
  "Purdue University": 99,
  "University of Southern California": 110,
  "Boston University": 108,
};

export const RECOMMENDED_UNIVERSITIES: Record<string, Array<{ name: string; rate: string; rank: string; code: string }>> = {
  "US": [
    { name: "New York University", rate: "21%", rank: "#38", code: "US" },
    { name: "University of Southern California", rate: "12%", rank: "#65", code: "US" },
    { name: "Boston University", rate: "14%", rank: "#93", code: "US" },
  ],
  "CA": [
    { name: "University of Toronto", rate: "43%", rank: "#21", code: "CA" },
    { name: "University of British Columbia", rate: "51%", rank: "#34", code: "CA" },
    { name: "McGill University", rate: "46%", rank: "#30", code: "CA" },
  ],
  "GB": [
    { name: "University College London", rate: "38%", rank: "#9", code: "GB" },
    { name: "University of Edinburgh", rate: "33%", rank: "#22", code: "GB" },
    { name: "King's College London", rate: "13%", rank: "#40", code: "GB" },
  ],
  "AU": [
    { name: "University of Melbourne", rate: "70%", rank: "#14", code: "AU" },
    { name: "University of Sydney", rate: "30%", rank: "#18", code: "AU" },
    { name: "Monash University", rate: "40%", rank: "#42", code: "AU" },
  ],
  "DE": [
    { name: "Technical University of Munich", rate: "8%", rank: "#37", code: "DE" },
    { name: "Heidelberg University", rate: "17%", rank: "#47", code: "DE" },
    { name: "Ludwig Maximilian University", rate: "10%", rank: "#54", code: "DE" },
  ],
};

export function estimateAcceptanceRate(rankingWorld?: number): number {
  if (!rankingWorld) return 65; // Default average
  if (rankingWorld < 10) return 5;
  if (rankingWorld < 50) return 15;
  if (rankingWorld < 100) return 25;
  if (rankingWorld < 200) return 35;
  if (rankingWorld < 500) return 55;
  if (rankingWorld < 1000) return 75;
  return 85;
}
