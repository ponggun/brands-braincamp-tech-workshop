// นิยามกิจกรรมที่พี่ "เปิด" ให้น้องทำบนมือถือ
import { CLUSTER_ORDER, CLUSTERS } from "./clusters";

export type PollOption = { id: string; emoji: string; label: string };

export type PollActivity = {
  id: string;
  kind: "poll";
  title: string;
  subtitle?: string;
  options: PollOption[];
};

export type QuizActivityRef = {
  id: string;
  kind: "quiz";
  title: string;
  subtitle?: string;
};

export type TextActivity = {
  id: string;
  kind: "text";
  title: string;
  subtitle?: string;
  placeholder?: string;
};

export type Activity = PollActivity | QuizActivityRef | TextActivity;

const clusterGuessOptions: PollOption[] = CLUSTER_ORDER.map((key) => ({
  id: key,
  emoji: CLUSTERS[key].emoji,
  label: CLUSTERS[key].name,
}));

export const ACTIVITIES: Record<string, Activity> = {
  "know-neighbor": {
    id: "know-neighbor",
    kind: "poll",
    title: "รู้จักเพื่อนที่นั่งข้าง ๆ หรือยังเอ่ย? 🙂",
    subtitle: "ตอบตามจริงได้เลย — เดี๋ยวเราค่อยทำความรู้จักกัน",
    options: [
      { id: "known", emoji: "🤝", label: "รู้จักชื่อเพื่อนข้าง ๆ แล้ว" },
      { id: "not-yet", emoji: "👋", label: "ยังไม่รู้จักเลย" },
    ],
  },
  expectation: {
    id: "expectation",
    kind: "text",
    title: "คาดหวังยังไงกับ workshop นี้บ้าง? ✍️",
    subtitle: "พิมพ์สั้น ๆ ก็ได้ — ไม่มีผิดถูก",
    placeholder: "เช่น อยากลองเขียนโค้ดเป็นครั้งแรก, อยากรู้ว่าสายเทคทำอะไรบ้าง…",
  },
  icebreaker: {
    id: "icebreaker",
    kind: "poll",
    title: "มาแชร์กันหน่อย 😊 เคยลองเขียนโค้ด/โปรแกรมมาบ้างไหม?",
    subtitle: "ไม่มีผิดถูกนะ — ตอบตามจริงเลย",
    options: [
      { id: "lvl0", emoji: "🐣", label: "ยังไม่เคยเลย — มาเริ่มนับหนึ่งวันนี้แหละ!" },
      { id: "lvl1", emoji: "🌱", label: "เคยลองนิดหน่อย (เช่น ในวิชาเรียน)" },
      { id: "lvl2", emoji: "🛠️", label: "เขียนได้บ้าง เคยทำโปรเจกต์เล็ก ๆ" },
      { id: "lvl3", emoji: "🚀", label: "เขียนคล่อง จริงจังอยู่" },
    ],
  },
  "why-code": {
    id: "why-code",
    kind: "text",
    title: "เราเขียนโปรแกรมกันไปทำไมนะ? 🤔",
    subtitle: "เดา/แชร์ได้เลย ไม่มีผิดถูก — เดี๋ยวมาเฉลยไปด้วยกัน",
    placeholder: "เช่น ทำเกม, ทำแอป, ให้ชีวิตง่ายขึ้น, แก้ปัญหา, หาเงิน…",
  },
  "fe-be-quiz": {
    id: "fe-be-quiz",
    kind: "poll",
    title: "แอปที่น้องใช้อยู่ — ปุ่มโหวตบนมือถือ เป็นงานของใคร?",
    subtitle: "ทายเล่น ๆ เดี๋ยวเฉลย 👀",
    options: [
      { id: "fe", emoji: "🖼️", label: "Frontend (สิ่งที่เราเห็น/แตะ)" },
      { id: "be", emoji: "🧠", label: "Backend (สมองเบื้องหลัง)" },
      { id: "both", emoji: "🔀", label: "ทั้งคู่ทำงานร่วมกัน" },
      { id: "idk", emoji: "🤔", label: "ยังไม่แน่ใจเลย" },
    ],
  },
  "ai-idea-poll": {
    id: "ai-idea-poll",
    kind: "poll",
    title: "อยากให้ AI ช่วยสร้างเว็บ/ฟีเจอร์อะไรดี?",
    subtitle: "พี่จะหยิบตัวฮิตไปสร้างสดให้ดู 🔥",
    options: [
      { id: "profile", emoji: "🧑‍🎤", label: "เว็บโปรไฟล์/พอร์ตของฉัน" },
      { id: "game", emoji: "🎮", label: "เกมง่าย ๆ (เช่น ทายเลข)" },
      { id: "shop", emoji: "🛒", label: "ร้านค้า/เมนูออนไลน์" },
      { id: "study", emoji: "📚", label: "เครื่องมือช่วยเรียน (จับเวลา/สรุป)" },
    ],
  },
  "cluster-guess": {
    id: "cluster-guess",
    kind: "poll",
    title: "ลองเดา! คิดว่าตัวเองน่าจะอยู่สายไหน?",
    subtitle: "เดี๋ยวได้ทำควิซจริงต่อ — ดูซิว่าตรงไหม 👀",
    options: clusterGuessOptions,
  },
  "career-quiz": {
    id: "career-quiz",
    kind: "quiz",
    title: "ควิซจับกลุ่มสายเทค — 6 ข้อ",
    subtitle: "ตอบตามใจล้วน ๆ แล้วมาดูสายที่ใช่ของเรา",
  },
};

export const ACTIVITY_IDS = Object.keys(ACTIVITIES);

export function getActivity(id: string | null | undefined): Activity | null {
  if (!id) return null;
  return ACTIVITIES[id] ?? null;
}

export function isPoll(a: Activity | null): a is PollActivity {
  return !!a && a.kind === "poll";
}

export function isText(a: Activity | null): a is TextActivity {
  return !!a && a.kind === "text";
}
