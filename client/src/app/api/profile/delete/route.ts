import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch complete user data and all relations
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        applications: {
          include: {
            university: true,
          },
        },
        matchingRecords: true,
        visaChecks: true,
        documents: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User record not found" }, { status: 404 });
    }

    // 1. Save full user details snapshot to ArchivedUser table in separate storage
    await prisma.archivedUser.create({
      data: {
        originalUserId: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        countryDialCode: user.countryDialCode,
        phoneNumber: user.phoneNumber,
        phoneE164: user.phoneE164,
        role: user.role,
        profileData: user.profile ? (user.profile as any) : null,
        applicationsData: user.applications ? (user.applications as any) : [],
        matchesData: user.matchingRecords ? (user.matchingRecords as any) : [],
        visaChecksData: user.visaChecks ? (user.visaChecks as any) : [],
        documentsData: user.documents ? (user.documents as any) : [],
        deletedReason: "User self-service account deletion",
        deletedAt: new Date(),
      },
    });

    // 2. Audit log entry for tracking
    await prisma.auditLog.create({
      data: {
        adminId: user.id,
        action: "ACCOUNT_DELETED_AND_ARCHIVED",
        entityType: "User",
        entityId: user.id,
        details: {
          email: user.email,
          username: user.username,
          deletedAt: new Date().toISOString(),
        },
      },
    });

    // 3. Delete active user record (cascade deletes active profile, matches, applications, documents)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { success: true, message: "Account deleted and archived successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Account deletion failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete and archive account" },
      { status: 500 }
    );
  }
}
