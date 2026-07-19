import { NextRequest, NextResponse } from "next/server";
import { touchSession, getActiveActivity } from "@/lib/store";

export const dynamic = "force-dynamic";

// น้อง short-poll ทุก ~2.5 วิ: อัปเดต heartbeat + คืนกิจกรรมที่พี่เปิดอยู่
export async function GET(req: NextRequest) {
  const sid = req.nextUrl.searchParams.get("sid") ?? "";
  touchSession(sid);
  return NextResponse.json(
    { activeActivity: getActiveActivity() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
