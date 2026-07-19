// In-memory store สำหรับ session สด — ไม่มี DB, ไม่เก็บ PII
// เก็บบน globalThis เพื่อให้รอด hot-reload ตอน dev
import type { ClusterKey } from "./clusters";

export type QuizRecord = {
  top: ClusterKey[];
  primary: ClusterKey;
};

type Store = {
  activeActivity: string | null;
  // sid -> เวลาล่าสุดที่เห็น (ms) ใช้ประเมินจำนวนคนออนไลน์
  sessions: Map<string, number>;
  // activityId -> (sid -> optionId) : 1 คน 1 เสียง (เปลี่ยนได้)
  polls: Map<string, Map<string, string>>;
  // activityId -> (sid -> ผลควิซ)
  quiz: Map<string, Map<string, QuizRecord>>;
};

const globalForStore = globalThis as unknown as { __bbcStore?: Store };

function createStore(): Store {
  return {
    activeActivity: null,
    sessions: new Map(),
    polls: new Map(),
    quiz: new Map(),
  };
}

export function getStore(): Store {
  if (!globalForStore.__bbcStore) {
    globalForStore.__bbcStore = createStore();
  }
  return globalForStore.__bbcStore;
}

const ONLINE_WINDOW_MS = 12_000; // ถือว่ายังออนไลน์ถ้าเห็นภายใน 12 วิ

export function touchSession(sid: string): void {
  if (!sid) return;
  getStore().sessions.set(sid, Date.now());
}

export function getJoinCount(): number {
  const now = Date.now();
  let count = 0;
  for (const lastSeen of getStore().sessions.values()) {
    if (now - lastSeen <= ONLINE_WINDOW_MS) count++;
  }
  return count;
}

export function setActiveActivity(activityId: string | null): void {
  getStore().activeActivity = activityId;
}

export function getActiveActivity(): string | null {
  return getStore().activeActivity;
}

export function recordPoll(
  activityId: string,
  sid: string,
  optionId: string
): void {
  const store = getStore();
  let map = store.polls.get(activityId);
  if (!map) {
    map = new Map();
    store.polls.set(activityId, map);
  }
  map.set(sid, optionId);
}

export function recordQuiz(
  activityId: string,
  sid: string,
  record: QuizRecord
): void {
  const store = getStore();
  let map = store.quiz.get(activityId);
  if (!map) {
    map = new Map();
    store.quiz.set(activityId, map);
  }
  map.set(sid, record);
}

export type PollResults = {
  kind: "poll";
  total: number;
  counts: Record<string, number>; // optionId -> จำนวน
};

export type QuizResults = {
  kind: "quiz";
  total: number;
  primaryCounts: Record<string, number>; // clusterKey -> จำนวนที่ได้เป็นสายหลัก
};

export function getPollResults(activityId: string): PollResults {
  const map = getStore().polls.get(activityId);
  const counts: Record<string, number> = {};
  let total = 0;
  if (map) {
    for (const optionId of map.values()) {
      counts[optionId] = (counts[optionId] ?? 0) + 1;
      total++;
    }
  }
  return { kind: "poll", total, counts };
}

export function getQuizResults(activityId: string): QuizResults {
  const map = getStore().quiz.get(activityId);
  const primaryCounts: Record<string, number> = {};
  let total = 0;
  if (map) {
    for (const rec of map.values()) {
      primaryCounts[rec.primary] = (primaryCounts[rec.primary] ?? 0) + 1;
      total++;
    }
  }
  return { kind: "quiz", total, primaryCounts };
}

export function resetActivity(activityId: string): void {
  const store = getStore();
  store.polls.delete(activityId);
  store.quiz.delete(activityId);
}

export function resetAll(): void {
  globalForStore.__bbcStore = createStore();
}
