// ก้อนข้อมูลสถานะสด ใช้ร่วมกันระหว่าง SSE (/api/events) กับ polling สำรอง (/api/results, /api/live)
// ให้ทั้งสองทางคืนโครงเดียวกัน client จะได้สลับไปมาได้โดยไม่ต้องแยกโค้ด
import { ACTIVITIES } from "./activities";
import {
  getActiveActivity,
  getJoinCount,
  getPollResults,
  getQuizResults,
  getTextResults,
} from "./store";

export type ActivityResults =
  | { kind: "poll"; total: number; counts: Record<string, number> }
  | { kind: "quiz"; total: number; primaryCounts: Record<string, number> }
  | { kind: "text"; total: number; entries: string[] };

export type StudentSnapshot = {
  activeActivity: string | null;
};

export type PresenterSnapshot = {
  joinCount: number;
  activeActivity: string | null;
  activityId?: string;
  results?: ActivityResults;
};

export function studentSnapshot(): StudentSnapshot {
  return { activeActivity: getActiveActivity() };
}

export function presenterSnapshot(activityId: string | null): PresenterSnapshot {
  const base: PresenterSnapshot = {
    joinCount: getJoinCount(),
    activeActivity: getActiveActivity(),
  };

  const activity = activityId ? ACTIVITIES[activityId] : null;
  if (!activity) return base;

  let results: ActivityResults;
  if (activity.kind === "poll") {
    results = getPollResults(activity.id);
  } else if (activity.kind === "text") {
    results = getTextResults(activity.id);
  } else {
    results = getQuizResults(activity.id);
  }

  return { ...base, activityId: activity.id, results };
}
