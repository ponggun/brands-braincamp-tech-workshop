import { NextRequest, NextResponse } from "next/server";
import { presenterSnapshot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

// polling สำรองของจอ presenter (ปกติใช้ SSE ที่ /api/events)
export async function GET(req: NextRequest) {
  const activityId = req.nextUrl.searchParams.get("activityId");
  return NextResponse.json(presenterSnapshot(activityId), {
    headers: { "Cache-Control": "no-store" },
  });
}
