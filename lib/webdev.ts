// ข้อมูลช่วง "เจาะ Web Dev" — บันไดเรียน + ลิงก์ทรัพยากร
// อ้างอิง roadmap.thaiprogrammer.org/paths/web-guideline

export const LINKS = {
  webGuideline: "https://roadmap.thaiprogrammer.org/paths/web-guideline/",
  career: "https://roadmap.thaiprogrammer.org/paths/career/",
  freeCodeCamp: "https://www.freecodecamp.org/",
  // TODO: ใส่ลิงก์ทอล์ก/ช่อง YouTube ของพี่ป้อง
  talk: "",
};

export type LadderStep = {
  emoji: string;
  name: string;
  desc: string;
  highlight?: boolean;
};

// บันไดเรียน Web Dev (ย่อจาก web-guideline ให้ ม.ปลาย ไต่ทีละขั้น)
export const LADDER: LadderStep[] = [
  { emoji: "🏗️", name: "HTML", desc: "โครงหน้าเว็บ + เนื้อหา" },
  { emoji: "🎨", name: "CSS", desc: "แต่งให้สวย จัด layout" },
  { emoji: "⚡", name: "JavaScript", desc: "ทำให้กดแล้วโต้ตอบได้" },
  { emoji: "🛡️", name: "TypeScript", desc: "JS ที่ปลอดภัย ผิดพลาดยากขึ้น" },
  {
    emoji: "⚛️",
    name: "React / Next.js",
    desc: "framework ทำเว็บจริงจัง — แอปนี้ก็สร้างด้วย Next.js!",
    highlight: true,
  },
  { emoji: "🗄️", name: "Backend · DB · Git · Deploy", desc: "เก็บข้อมูล + เอาขึ้นเน็ตจริง" },
];

// ตัวคูณของ AI (จากทอล์กพี่ป้อง: No Tools=1 / Coding=10 / AI=100)
export type AmplifyRow = { tool: string; n: number };
export const AMPLIFY: AmplifyRow[] = [
  { tool: "ไม่มีเครื่องมือ", n: 1 },
  { tool: "เขียนโค้ดเป็น", n: 10 },
  { tool: "+ AI", n: 100 },
];
