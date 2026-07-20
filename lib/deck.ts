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
  { id: "know-neighbor", label: "รู้จักเพื่อนข้าง ๆ", timeLabel: "0:00–0:05", activityId: "know-neighbor" },
  { id: "expectation", label: "ความคาดหวัง", activityId: "expectation" },
  { id: "why-code", label: "ชวนคิด: เขียนโปรแกรมไปทำไม", timeLabel: "0:05–0:12", activityId: "why-code" },
  { id: "why-tech-problem", label: "ปัญหา: ล้อเหลี่ยม" },
  { id: "why-tech-compare", label: "ไม่มี vs มีเทค" },
  { id: "why-tech-single", label: "คูณคู่เดียว สบาย" },
  { id: "why-tech-manual", label: "คูณมือจนร้องไห้" },
  { id: "why-tech-demo", label: "เดโม: โปรแกรมคูณเลขสด" },
  { id: "plife-divide", label: "แบ่งปัญหาใหญ่ (Divide & Conquer)" },
  { id: "plife-customer", label: "งานจริง: ลูกค้า → Software House" },
  { id: "plife-sdlc", label: "ขั้นตอนโปรเจกต์จริง (SDLC)" },
  { id: "plife-jobtask", label: "Job → Task" },
  { id: "fundamentals", label: "พื้นฐานที่ควรมี" },
  { id: "why-tech-benefits", label: "ข้อดีของการเขียนโปรแกรม (สรุป)" },
  { id: "cluster-guess", label: "เดาสาย", activityId: "cluster-guess" },
  { id: "lab-intro", label: "LAB intro", timeLabel: "0:12–0:25" },
  { id: "career-quiz", label: "ควิซจับกลุ่ม 5 สาย", activityId: "career-quiz" },
  // Part B — เจาะ Web Dev ให้เห็นภาพ
  { id: "focus-webdev", label: "เจาะ Web Dev", timeLabel: "0:25–0:37" },
  { id: "webdev-why", label: "ทำไมเจาะ Web (สถิติ)" },
  { id: "app-anatomy", label: "แกะแอปที่น้องใช้" },
  { id: "fe-be-quiz", label: "มินิควิซ FE/BE", activityId: "fe-be-quiz" },
  { id: "frontend-three", label: "Frontend 3 ชิ้น" },
  { id: "icebreaker", label: "เคยเขียนโค้ดไหม (แชร์)", activityId: "icebreaker" },
  { id: "code-taste", label: "ชิมโค้ด" },
  { id: "webdev-ladder", label: "บันไดเรียน Web Dev" },
  { id: "code-preview", label: "เกริ่นโค้ดจริง + โครงสร้าง" },
  // Part C — AI ช่วยงานเขียนโปรแกรม → เดโมสด
  { id: "ai-help", label: "AI ช่วยงานเขียนโปรแกรม", timeLabel: "0:37–0:50" },
  { id: "ai-idea", label: "โพลไอเดีย AI", activityId: "ai-idea-poll" },
  { id: "ai-live", label: "AI สด (แชร์จอ)" },
  { id: "ai-amplify", label: "พื้นฐาน × AI (ตัวคูณ)" },
  { id: "ai-meme-debug", label: "meme: เจนไว แต่ debug ยาว" },
  { id: "ai-meme-vibe", label: "meme: Vibe Coding รก" },
  { id: "ai-behind", label: "เบื้องหลัง: สร้างแอปนี้ด้วย AI" },
  // Part D — สรุป + ต่อยอด
  { id: "ai-jobs", label: "AI จะแย่งงานโปรแกรมเมอร์ไหม?", timeLabel: "0:50–0:57" },
  { id: "next-step", label: "Next step + QR", timeLabel: "0:57–1:00" },
];

export const SLIDE_COUNT = SLIDES.length;
