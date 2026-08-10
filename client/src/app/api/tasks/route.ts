import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: `user_tasks_${userId}` },
    });

    if (!setting || !setting.value) {
      return NextResponse.json({ tasks: null });
    }

    return NextResponse.json({ tasks: setting.value });
  } catch (err) {
    console.error("Failed to fetch tasks", err);
    return NextResponse.json({ tasks: null });
  }
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { tasks } = await req.json();
    if (!Array.isArray(tasks)) {
      return NextResponse.json({ error: "Invalid tasks array" }, { status: 400 });
    }

    await prisma.systemSetting.upsert({
      where: { key: `user_tasks_${userId}` },
      create: {
        key: `user_tasks_${userId}`,
        value: tasks,
      },
      update: {
        value: tasks,
      },
    });

    return NextResponse.json({ success: true, tasks });
  } catch (err) {
    console.error("Failed to save tasks", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
