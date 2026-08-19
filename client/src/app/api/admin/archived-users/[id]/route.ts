import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role;
    if (userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const archivedUser = await prisma.archivedUser.findUnique({
      where: { id },
    });

    if (!archivedUser) {
      return NextResponse.json({ error: "Archived user record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: archivedUser });
  } catch (error: any) {
    console.error("Failed to fetch archived user detail:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch archived user detail" },
      { status: 500 }
    );
  }
}
