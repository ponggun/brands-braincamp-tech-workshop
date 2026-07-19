import { NextRequest, NextResponse } from "next/server";
import { resetActivity, resetAll } from "@/lib/store";

export const dynamic = "force-dynamic";

function checkKey(key: unknown): boolean {
  const required = process.env.PRESENTER_KEY;
  if (!required) return true;
  return key === required;
}

// presenter ล้างผล: ถ้าส่ง activityId = ล้างเฉพาะกิจกรรมนั้น, ไม่ส่ง = ล้างทั้ง session
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  if (!checkKey(body?.key)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const activityId = body?.activityId ? String(body.activityId) : null;
  if (activityId) {
    resetActivity(activityId);
  } else {
    resetAll();
  }
  return NextResponse.json({ ok: true });
}
