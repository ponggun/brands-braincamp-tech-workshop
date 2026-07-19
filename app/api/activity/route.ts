import { NextRequest, NextResponse } from "next/server";
import { setActiveActivity } from "@/lib/store";
import { ACTIVITIES } from "@/lib/activities";

export const dynamic = "force-dynamic";

function checkKey(key: unknown): boolean {
  const required = process.env.PRESENTER_KEY;
  if (!required) return true;
  return key === required;
}

// presenter เปิด/ปิดกิจกรรม (activity=null = ปิด กลับ standby)
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  if (!checkKey(body?.key)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const activity = (body?.activity as string | null) ?? null;
  if (activity !== null && !ACTIVITIES[activity]) {
    return NextResponse.json({ ok: false, error: "unknown activity" }, { status: 400 });
  }
  setActiveActivity(activity);
  return NextResponse.json({ ok: true, activeActivity: activity });
}
