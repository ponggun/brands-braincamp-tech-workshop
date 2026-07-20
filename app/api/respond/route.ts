import { NextRequest, NextResponse } from "next/server";
import { touchSession, recordPoll, recordQuiz, recordText } from "@/lib/store";
import { ACTIVITIES } from "@/lib/activities";
import { CLUSTER_ORDER, type ClusterKey } from "@/lib/clusters";

export const dynamic = "force-dynamic";

const isCluster = (v: unknown): v is ClusterKey =>
  typeof v === "string" && (CLUSTER_ORDER as string[]).includes(v);

// น้องส่งคำตอบ poll หรือผลควิซ
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  const sid = String(body?.sid ?? "");
  const activityId = String(body?.activityId ?? "");
  const activity = ACTIVITIES[activityId];
  if (!sid || !activity) {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }
  touchSession(sid);

  if (activity.kind === "poll") {
    const optionId = String(body?.optionId ?? "");
    const valid = activity.options.some((o) => o.id === optionId);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "bad option" }, { status: 400 });
    }
    recordPoll(activityId, sid, optionId);
  } else if (activity.kind === "text") {
    const text = String(body?.text ?? "").trim().slice(0, 280);
    if (!text) {
      return NextResponse.json({ ok: false, error: "empty text" }, { status: 400 });
    }
    recordText(activityId, sid, text);
  } else {
    const primary = body?.primary;
    const topRaw = Array.isArray(body?.top) ? (body.top as unknown[]) : [];
    const top = topRaw.filter(isCluster);
    if (!isCluster(primary)) {
      return NextResponse.json({ ok: false, error: "bad quiz result" }, { status: 400 });
    }
    recordQuiz(activityId, sid, { primary, top });
  }

  return NextResponse.json({ ok: true });
}
