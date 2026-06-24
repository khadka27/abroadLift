import { NextRequest, NextResponse } from "next/server";
import { abroadliftApi } from "@/lib/api/abroadlift";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const schoolId = (await params).id;

  try {
    const data = await abroadliftApi.getSchoolById(schoolId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Proxy School GET error for ID ${schoolId}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch school" },
      { status: 500 }
    );
  }
}
