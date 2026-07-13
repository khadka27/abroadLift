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

    // Calculate dynamic last 6 months using real data
    const monthsData: Array<{
      name: string;
      year: number;
      month: number;
      applications: number;
      visas: number;
    }> = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const name = d.toLocaleString('en-US', { month: 'short' });
      monthsData.push({
        name,
        year: d.getFullYear(),
        month: d.getMonth(),
        applications: 0,
        visas: 0,
      });
    }

    const startDate = new Date(monthsData[0].year, monthsData[0].month, 1);

    const [realApps, realVisas] = await Promise.all([
      prisma.application.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          createdAt: true,
        },
      }),
      prisma.visaRateCheck.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          createdAt: true,
        },
      }),
    ]);

    realApps.forEach((app) => {
      const date = new Date(app.createdAt);
      const monthIndex = monthsData.findIndex(
        (m) => m.year === date.getFullYear() && m.month === date.getMonth()
      );
      if (monthIndex !== -1) {
        monthsData[monthIndex].applications++;
      }
    });

    realVisas.forEach((visa) => {
      const date = new Date(visa.createdAt);
      const monthIndex = monthsData.findIndex(
        (m) => m.year === date.getFullYear() && m.month === date.getMonth()
      );
      if (monthIndex !== -1) {
        monthsData[monthIndex].visas++;
      }
    });

    const applicationTrend = monthsData.map(({ name, applications, visas }) => ({
      name,
      applications,
      visas,
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
