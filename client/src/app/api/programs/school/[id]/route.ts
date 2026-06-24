import { NextRequest, NextResponse } from "next/server";
import { abroadliftApi } from "@/lib/api/abroadlift";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const schoolId = (await params).id;

  try {
    const data = await abroadliftApi.getProgramsBySchool(schoolId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Proxy Programs for School GET error for School ID ${schoolId}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch programs for this school" },
      { status: 500 }
    );
  }
}
