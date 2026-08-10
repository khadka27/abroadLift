import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import prisma from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const DEFAULT_DOCUMENT_SLOTS = [
  { name: "Passport", category: "Identification" },
  { name: "Academic Transcript", category: "Education" },
  { name: "Degree Certificate", category: "Education" },
  { name: "Curriculum Vitae (CV)", category: "Career" },
  { name: "Statement of Purpose (SOP)", category: "Admissions" },
  { name: "Recommendation Letters (LORs)", category: "Admissions" },
  { name: "English Language Test Report", category: "Language" },
];

/* ── GET /api/documents ─────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let docs = await prisma.document.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  // Seed default slots if first time
  if (docs.length === 0) {
    await prisma.document.createMany({
      data: DEFAULT_DOCUMENT_SLOTS.map((slot) => ({
        userId,
        name: slot.name,
        category: slot.category,
        status: "Pending",
      })),
    });
    docs = await prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  }

  return NextResponse.json({ documents: docs });
}

/* ── POST /api/documents ─────────────────────────────────────── */
// multipart/form-data: file (binary), docId (string), name, category
export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const docId = formData.get("docId") as string | null;
    const name = formData.get("name") as string | null;
    const category = formData.get("category") as string | null;
    const file = formData.get("file") as File | null;

    let fileName: string | undefined;
    let fileUrl: string | undefined;
    let uploadedAt: Date | undefined;

    if (file && file.size > 0) {
      const userDir = path.join(process.cwd(), "public", "uploads", userId);
      await mkdir(userDir, { recursive: true });
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const destPath = path.join(userDir, safeName);
      const bytes = await file.arrayBuffer();
      await writeFile(destPath, Buffer.from(bytes));
      fileName = safeName;
      fileUrl = `/uploads/${userId}/${safeName}`;
      uploadedAt = new Date();
    }

    if (docId) {
      // Update existing slot
      const existing = await prisma.document.findFirst({ where: { id: docId, userId } });
      if (!existing) return NextResponse.json({ error: "Document not found" }, { status: 404 });

      const updated = await prisma.document.update({
        where: { id: docId },
        data: {
          ...(fileName !== undefined && { fileName }),
          ...(fileUrl !== undefined && { fileUrl }),
          ...(uploadedAt !== undefined && { uploadedAt }),
          status: file && file.size > 0 ? "Uploaded" : existing.status,
        },
      });
      return NextResponse.json({ document: updated });
    } else {
      // Create new custom document slot
      const doc = await prisma.document.create({
        data: {
          userId,
          name: name || "Untitled Document",
          category: category || "Other",
          status: file && file.size > 0 ? "Uploaded" : "Pending",
          fileName,
          fileUrl,
          uploadedAt,
        },
      });
      return NextResponse.json({ document: doc });
    }
  } catch (err) {
    console.error("Document upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

/* ── DELETE /api/documents?id=<docId> ───────────────────────── */
// Resets the document slot back to Pending (keeps the slot, clears the file)
export async function DELETE(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const docId = searchParams.get("id");
  if (!docId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const doc = await prisma.document.findFirst({ where: { id: docId, userId } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.document.update({
    where: { id: docId },
    data: { status: "Pending", fileName: null, fileUrl: null, uploadedAt: null },
  });

  return NextResponse.json({ success: true });
}
