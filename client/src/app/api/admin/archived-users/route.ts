import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role;
    if (userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const archivedUsers = await prisma.archivedUser.findMany({
      orderBy: { deletedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: archivedUsers });
  } catch (error: any) {
    console.error("Failed to fetch archived users:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch archived users" },
      { status: 500 }
    );
  }
}
