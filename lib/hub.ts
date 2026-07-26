// Event hub สำหรับ SSE — แทน short polling ของทั้งจอพี่และจอน้อง
// แยกออกจาก lib/store.ts เพราะ resetAll() สร้าง store ใหม่ทั้งก้อน
// ถ้าเก็บ subscriber ไว้ในนั้นด้วย connection ของทุกคนจะหลุดตอน reset

export type Subscriber = {
  sid: string | null; // null = จอ presenter (ไม่นับเป็นคนออนไลน์)
  notify: () => void;
};

type Hub = {
  subs: Set<Subscriber>;
  flushTimer: ReturnType<typeof setTimeout> | null;
};

const globalForHub = globalThis as unknown as { __bbcHub?: Hub };

function getHub(): Hub {
  if (!globalForHub.__bbcHub) {
    globalForHub.__bbcHub = { subs: new Set(), flushTimer: null };
  }
  return globalForHub.__bbcHub;
}

// รวบอีเวนต์ที่เกิดใกล้ ๆ กันให้ส่งรอบเดียว (น้อง 50 คนกดโหวตพร้อมกัน = broadcast 1 ครั้ง)
const FLUSH_MS = 80;

export function subscribe(sub: Subscriber): () => void {
  const hub = getHub();
  hub.subs.add(sub);
  return () => {
    hub.subs.delete(sub);
  };
}

export function broadcast(): void {
  const hub = getHub();
  if (hub.flushTimer) return;
  hub.flushTimer = setTimeout(() => {
    hub.flushTimer = null;
    for (const sub of hub.subs) {
      try {
        sub.notify();
      } catch {
        /* connection ตายแล้ว — route จะ cleanup เอง */
      }
    }
  }, FLUSH_MS);
}

// sid ที่ยังมี SSE connection ค้างอยู่จริง — ใช้ประเมินจำนวนคนออนไลน์
export function liveSids(): Set<string> {
  const out = new Set<string>();
  for (const sub of getHub().subs) {
    if (sub.sid) out.add(sub.sid);
  }
  return out;
}
