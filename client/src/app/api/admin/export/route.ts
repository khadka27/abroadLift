/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "students", "applications", "visas"

    let dataToExport = [];
    let headers: string[] = [];

    if (type === "students") {
      const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        include: { profile: true },
      });
      headers = ["ID", "Name", "Email", "Phone", "Is Active", "Nationality", "GPA", "Joined Date"];
      dataToExport = students.map((s) => [
        s.id,
        s.name,
        s.email,
        s.phoneE164 || "N/A",
        s.isActive ? "Yes" : "No",
        s.profile?.nationality || "N/A",
        s.profile?.gpa || "N/A",
        new Date(s.createdAt).toISOString(),
      ]);
    } else if (type === "applications") {
      const apps = await prisma.application.findMany({
        include: { user: true, university: true },
      });
      headers = ["App ID", "Student Name", "Student Email", "University", "Country", "Status", "Applied Date"];
      dataToExport = apps.map((a) => [
        a.id,
        a.user.name,
        a.user.email,
        a.university.name,
        a.university.country,
        a.status,
        new Date(a.createdAt).toISOString(),
      ]);
    } else if (type === "visas") {
      const visas = await prisma.visaRateCheck.findMany({
        include: { user: true },
      });
      headers = ["ID", "Student Name", "Nationality", "Destination", "Degree Level", "Success Rate", "Date"];
      dataToExport = visas.map((v) => [
        v.id,
        v.user.name,
        v.nationality,
        v.destination,
        v.degreeLevel,
        `${v.successRate}%`,
        new Date(v.createdAt).toISOString(),
      ]);
    } else {
      return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
    }

    // Convert to CSV
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((row) =>
        row
          .map((cell) => {
            const cellString = String(cell);
            // Escape quotes and wrap in quotes if contains comma
            if (cellString.includes(",") || cellString.includes('"')) {
              return `"${cellString.replace(/"/g, '""')}"`;
            }
            return cellString;
          })
          .join(",")
      ),
    ].join("\n");

    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: `EXPORT_${type.toUpperCase()}`,
        entityType: "SYSTEM",
      }
    });

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${type}_export_${new Date().getTime()}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error generating export:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
