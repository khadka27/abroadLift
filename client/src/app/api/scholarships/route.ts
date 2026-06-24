import { NextRequest, NextResponse } from "next/server";
import { abroadliftApi } from "@/lib/api/abroadlift";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  try {
    const data = await abroadliftApi.getScholarships(page, limit);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Proxy Scholarships GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch scholarships" },
      { status: 500 }
    );
  }
}
