import { NextRequest, NextResponse } from "next/server";
import { touchSession } from "@/lib/store";
import { studentSnapshot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

// polling สำรองของจอน้อง (ปกติใช้ SSE ที่ /api/events)
export async function GET(req: NextRequest) {
  const sid = req.nextUrl.searchParams.get("sid") ?? "";
  touchSession(sid);
  return NextResponse.json(studentSnapshot(), {
    headers: { "Cache-Control": "no-store" },
  });
}
