import { NextRequest, NextResponse } from "next/server";
import { abroadliftApi } from "@/lib/api/abroadlift";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const programId = (await params).id;

  try {
    const data = await abroadliftApi.getProgramById(programId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Proxy Program GET error for ID ${programId}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch program" },
      { status: 500 }
    );
  }
}
