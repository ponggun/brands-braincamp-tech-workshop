// In-memory store สำหรับ session สด — ไม่มี DB, ไม่เก็บ PII
// เก็บบน globalThis เพื่อให้รอด hot-reload ตอน dev
import type { ClusterKey } from "./clusters";
import { broadcast, liveSids } from "./hub";

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
  // activityId -> (sid -> ข้อความ) : free text 1 คน 1 คำตอบ (เปลี่ยนได้)
  texts: Map<string, Map<string, string>>;
};

const globalForStore = globalThis as unknown as { __bbcStore?: Store };

function createStore(): Store {
  return {
    activeActivity: null,
    sessions: new Map(),
    polls: new Map(),
    quiz: new Map(),
    texts: new Map(),
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
  // รวม 2 แหล่ง: คนที่ต่อ SSE ค้างอยู่ + คนที่ fallback ไป polling (ดูจาก lastSeen)
  const online = liveSids();
  for (const [sid, lastSeen] of getStore().sessions) {
    if (now - lastSeen <= ONLINE_WINDOW_MS) online.add(sid);
  }
  return online.size;
}

export function setActiveActivity(activityId: string | null): void {
  getStore().activeActivity = activityId;
  broadcast();
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
  broadcast();
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
  broadcast();
}

export function recordText(
  activityId: string,
  sid: string,
  text: string
): void {
  const store = getStore();
  let map = store.texts.get(activityId);
  if (!map) {
    map = new Map();
    store.texts.set(activityId, map);
  }
  map.set(sid, text);
  broadcast();
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

export type TextResults = {
  kind: "text";
  total: number;
  entries: string[]; // ข้อความล่าสุดอยู่บนสุด
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

export function getTextResults(activityId: string): TextResults {
  const map = getStore().texts.get(activityId);
  // Map เก็บตามลำดับที่ใส่ — reverse ให้ข้อความล่าสุดขึ้นก่อน
  const entries = map ? [...map.values()].reverse() : [];
  return { kind: "text", total: entries.length, entries };
}

export function resetActivity(activityId: string): void {
  const store = getStore();
  store.polls.delete(activityId);
  store.quiz.delete(activityId);
  store.texts.delete(activityId);
  broadcast();
}

export function resetAll(): void {
  globalForStore.__bbcStore = createStore();
  broadcast();
}
