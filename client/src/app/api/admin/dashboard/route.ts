/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Verify path
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use a transaction or parallel queries for performance
    const [
      totalStudents,
      totalApplications,
      applicationsByStatus,
      totalVisaChecks,
      avgVisaSuccess,
      recentRegistrations,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.application.count(),
      prisma.application.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.visaRateCheck.count(),
      prisma.visaRateCheck.aggregate({
        _avg: { successRate: true },
      }),
      prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true },
      }),
    ]);

    // Format application status counts
    const appStats = {
      SAVED: 0,
      APPLIED: 0,
      ACCEPTED: 0,
      REJECTED: 0,
    };
    applicationsByStatus.forEach((stat) => {
      appStats[stat.status] = stat._count.status;
    });

    // Generate mock trend data for the chart (last 6 months)
    // In a real scenario, group by month from DB
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const applicationTrend = months.map((month) => ({
      name: month,
      applications: Math.floor(Math.random() * 50) + 10,
      visas: Math.floor(Math.random() * 40) + 5,
    }));

    return NextResponse.json({
      metrics: {
        totalStudents,
        totalApplications,
        acceptedOffers: appStats.ACCEPTED,
        rejectedApplications: appStats.REJECTED,
        pendingReviews: appStats.APPLIED,
        visaAssessments: totalVisaChecks,
        avgVisaSuccess: Math.round(avgVisaSuccess._avg.successRate || 0),
      },
      recentRegistrations,
      applicationTrend,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
