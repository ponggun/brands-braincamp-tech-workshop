import { NextRequest, NextResponse } from "next/server";
import {
  getJoinCount,
  getActiveActivity,
  getPollResults,
  getQuizResults,
} from "@/lib/store";
import { ACTIVITIES } from "@/lib/activities";

export const dynamic = "force-dynamic";

// presenter poll ผลรวม + จำนวนคนออนไลน์
export async function GET(req: NextRequest) {
  const activityId = req.nextUrl.searchParams.get("activityId");
  const base = {
    joinCount: getJoinCount(),
    activeActivity: getActiveActivity(),
  };
  const headers = { "Cache-Control": "no-store" };

  const activity = activityId ? ACTIVITIES[activityId] : null;
  if (!activity) {
    return NextResponse.json(base, { headers });
  }

  const results =
    activity.kind === "poll"
      ? getPollResults(activity.id)
      : getQuizResults(activity.id);

  return NextResponse.json({ ...base, activityId, results }, { headers });
}
