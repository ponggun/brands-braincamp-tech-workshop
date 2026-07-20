import { NextRequest, NextResponse } from "next/server";
import {
  getJoinCount,
  getActiveActivity,
  getPollResults,
  getQuizResults,
  getTextResults,
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

  let results;
  if (activity.kind === "poll") {
    results = getPollResults(activity.id);
  } else if (activity.kind === "text") {
    results = getTextResults(activity.id);
  } else {
    results = getQuizResults(activity.id);
  }

  return NextResponse.json({ ...base, activityId, results }, { headers });
}
