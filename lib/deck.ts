// ลำดับสไลด์ของ presenter — เนื้อหา JSX อยู่ที่ components/present/SlideView.tsx
// slide ที่มี activityId = "activity slide" จะโชว์ปุ่มเปิดกิจกรรม + แผงผลสด

export type SlideMeta = {
  id: string;
  label: string; // ชื่อสั้นไว้โชว์ในแถบนำทาง presenter
  timeLabel?: string; // ช่วงเวลาโดยประมาณ
  activityId?: string; // ผูกกับกิจกรรมใน lib/activities.ts
};

export const SLIDES: SlideMeta[] = [
  // Part A — เปิด + หาตัวตน
  { id: "cover", label: "ปก + QR", timeLabel: "0:00" },
  { id: "intro", label: "ทำความรู้จักพี่ป้อง" },
  { id: "icebreaker", label: "Icebreaker", timeLabel: "0:00–0:05", activityId: "icebreaker" },
  { id: "why-tech", label: "ทำไมต้องเทค", timeLabel: "0:05–0:12" },
  { id: "cluster-guess", label: "เดาสาย", activityId: "cluster-guess" },
  { id: "lab-intro", label: "LAB intro", timeLabel: "0:12–0:25" },
  { id: "career-quiz", label: "ควิซจับกลุ่ม 5 สาย", activityId: "career-quiz" },
  // Part B — เจาะ Web Dev ให้เห็นภาพ
  { id: "focus-webdev", label: "เจาะ Web Dev", timeLabel: "0:25–0:37" },
  { id: "app-anatomy", label: "แกะแอปที่น้องใช้" },
  { id: "fe-be-quiz", label: "มินิควิซ FE/BE", activityId: "fe-be-quiz" },
  { id: "frontend-three", label: "Frontend 3 ชิ้น" },
  { id: "code-taste", label: "ชิมโค้ด" },
  { id: "webdev-ladder", label: "บันไดเรียน Web Dev" },
  // Part C — พื้นฐาน × AI → AI demo
  { id: "ai-amplify", label: "พื้นฐาน × AI", timeLabel: "0:37–0:50" },
  { id: "ai-idea", label: "โพลไอเดีย AI", activityId: "ai-idea-poll" },
  { id: "ai-live", label: "AI สด (แชร์จอ)" },
  // Part D — สรุป + ต่อยอด
  { id: "debrief", label: "Debrief · 5 ทักษะ", timeLabel: "0:50–0:57" },
  { id: "next-step", label: "Next step + QR", timeLabel: "0:57–1:00" },
];

export const SLIDE_COUNT = SLIDES.length;
