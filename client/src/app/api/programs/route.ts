/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getProgramsCached, getProgramsMultiPageCached } from "@/lib/api/cache";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const allLevels = searchParams.get("allLevels") === "true";
  const allFieldsAndPrograms = searchParams.get("allFieldsAndPrograms") === "true";

  // ─── allFieldsAndPrograms=true: categorise programs into academic fields ──
  if (allFieldsAndPrograms) {
    try {
      // Fetch programs from multi-page cache (up to 5 pages = 500 programs max)
      const programs = await getProgramsMultiPageCached(5);

      const fields = [
        "Business & Management",
        "Computer Science & IT",
        "Engineering",
        "Medicine & Health",
        "Law",
        "Arts & Humanities",
        "Social Sciences",
        "Data Science & AI",
        "Natural Sciences",
        "Hospitality & Tourism",
        "Architecture & Design",
        "Agriculture & Forestry",
        "Education & Teaching",
        "Media & Journalism",
        "Liberal Arts & General",
      ];

      const programsByField: Record<string, Set<string>> = {};
      fields.forEach((f) => {
        programsByField[f] = new Set<string>();
      });

      programs.forEach((prog: any) => {
        const name = (prog.name || "").trim();
        if (!name) return;
        const n = name.toLowerCase();

        let field = "Liberal Arts & General";
        if (n.includes("computer") || n.includes("software") || n.includes("information technology") || n.includes("cybersecurity") || n.includes("networking") || n.includes("systems") || n.includes("developer")) {
          field = "Computer Science & IT";
        } else if (n.includes("data science") || n.includes("artificial intelligence") || n.includes("machine learning") || n.includes("deep learning")) {
          field = "Data Science & AI";
        } else if (n.includes("business") || n.includes("management") || n.includes("mba") || n.includes("finance") || n.includes("marketing") || n.includes("accounting") || n.includes("commerce") || n.includes("economics") || n.includes("administration")) {
          field = "Business & Management";
        } else if (n.includes("mechanical") || n.includes("civil") || n.includes("electrical") || n.includes("chemical") || n.includes("aerospace") || n.includes("mechatronics") || n.includes("engineering")) {
          field = "Engineering";
        } else if (n.includes("nurs") || n.includes("medicine") || n.includes("health") || n.includes("pharmacy") || n.includes("medical") || n.includes("dental") || n.includes("clinical")) {
          field = "Medicine & Health";
        } else if (n.includes("law") || n.includes("legal") || n.includes("justice") || n.includes("criminology")) {
          field = "Law";
        } else if (n.includes("sociology") || n.includes("psychology") || n.includes("political") || n.includes("social science") || n.includes("global studies") || n.includes("international relations")) {
          field = "Social Sciences";
        } else if (n.includes("hospitality") || n.includes("tourism") || n.includes("hotel") || n.includes("culinary") || n.includes("event management")) {
          field = "Hospitality & Tourism";
        } else if (n.includes("architecture") || n.includes("interior design") || n.includes("urban planning") || n.includes("graphic design")) {
          field = "Architecture & Design";
        } else if (n.includes("agriculture") || n.includes("forestry") || n.includes("horticulture") || n.includes("environmental science")) {
          field = "Agriculture & Forestry";
        } else if (n.includes("education") || n.includes("teaching") || n.includes("curriculum") || n.includes("pedagogy")) {
          field = "Education & Teaching";
        } else if (n.includes("media") || n.includes("journalism") || n.includes("communication") || n.includes("broadcasting") || n.includes("film")) {
          field = "Media & Journalism";
        } else if (n.includes("biology") || n.includes("chemistry") || n.includes("physics") || n.includes("mathematics") || n.includes("math") || n.includes("science")) {
          field = "Natural Sciences";
        } else if (n.includes("art") || n.includes("humanities") || n.includes("music") || n.includes("history") || n.includes("philosophy") || n.includes("english literature") || n.includes("language") || n.includes("literature")) {
          field = "Arts & Humanities";
        }

        programsByField[field].add(name);
      });

      const responseData: Record<string, string[]> = {};
      fields.forEach((f) => {
        responseData[f] = Array.from(programsByField[f]).slice(0, 15);
      });

      const activeFields = fields.filter((f) => responseData[f].length > 0);

      return NextResponse.json({
        success: true,
        data: { fields: activeFields, programsByField: responseData },
      });
    } catch (error: any) {
      console.error("Proxy Programs GET all fields error:", error);
      return NextResponse.json({
        success: false,
        data: { fields: [], programsByField: {} },
        error: error.message || "Failed to fetch fields",
      });
    }
  }

  // ─── allLevels=true: extract unique study levels ──────────────────────────
  if (allLevels) {
    try {
      // Baseline list of all known study levels from the AbroadLift API database,
      // ordered in a premium, logical hierarchy (Higher degrees -> Undergrad -> Grades).
      const baseLevels = [
        { v: "masters_degree", l: "Master's Degree" },
        { v: "doctoral_phd", l: "Doctoral / PhD" },
        { v: "bachelors", l: "4-Year Bachelor's Degree" },
        { v: "3_year_bachelors", l: "3-Year Bachelor's Degree" },
        { v: "post_graduate_diploma", l: "Postgraduate Diploma" },
        { v: "post_graduate_certificate", l: "Postgraduate Certificate" },
        { v: "diploma", l: "Undergraduate Diploma" },
        { v: "advanced_diploma", l: "Undergraduate Advanced Diploma" },
        { v: "integrated_masters", l: "Integrated Masters" },
        { v: "certificate", l: "Post-Secondary Certificate" },
        { v: "english", l: "English as Second Language (ESL)" },
        { v: "grade_12", l: "Grade 12" },
        { v: "grade_11", l: "Grade 11" },
        { v: "grade_10", l: "Grade 10" },
        { v: "grade_9", l: "Grade 9" },
        { v: "grade_8", l: "Grade 8" },
        { v: "grade_7", l: "Grade 7" },
        { v: "grade_6", l: "Grade 6" },
        { v: "grade_5", l: "Grade 5" },
        { v: "grade_4", l: "Grade 4" },
        { v: "grade_3", l: "Grade 3" },
        { v: "grade_2", l: "Grade 2" },
        { v: "grade_1", l: "Grade 1" }
      ];

      // Dynamically fetch from the 3-page cache to catch any new additions
      const programs = await getProgramsMultiPageCached(3).catch(() => []);
      const levelsMap = new Map<string, string>();

      // Initialize with our base levels
      baseLevels.forEach((item) => {
        levelsMap.set(item.v, item.l);
      });

      // Add any new ones that might have been added to the API database
      programs.forEach((prog: any) => {
        const level = (prog.level || "").trim();
        const levelText = (prog.level_text || "").trim();
        if (level && levelText && !levelsMap.has(level)) {
          levelsMap.set(level, levelText);
        }
      });

      // Build the final list preserving the premium hierarchy order
      const orderedLevels: { v: string; l: string }[] = [];
      baseLevels.forEach((item) => {
        if (levelsMap.has(item.v)) {
          orderedLevels.push({ v: item.v, l: levelsMap.get(item.v)! });
          levelsMap.delete(item.v);
        }
      });

      // Append any remaining dynamically discovered levels
      levelsMap.forEach((l, v) => {
        orderedLevels.push({ v, l });
      });

      return NextResponse.json({ success: true, data: orderedLevels });
    } catch (error: any) {
      console.error("Proxy Programs GET all levels error:", error);
      return NextResponse.json(
        { success: false, data: [], error: error.message || "Failed to fetch levels" }
      );
    }
  }

  // ─── Default: page-based program list ────────────────────────────────────
  const page = parseInt(searchParams.get("page") || "1", 10);

  try {
    const programs = await getProgramsCached();
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const start = (page - 1) * limit;
    const pageData = programs.slice(start, start + limit);
    return NextResponse.json({
      success: true,
      data: pageData,
      pagination: {
        page,
        limit,
        total: programs.length,
        totalPages: Math.ceil(programs.length / limit),
      },
    });
  } catch (error: any) {
    console.error("Proxy Programs GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch programs" },
      { status: 500 }
    );
  }
}
