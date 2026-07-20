// ข้อมูลช่วง "เจาะ Web Dev" — บันไดเรียน + ลิงก์ทรัพยากร
// อ้างอิง roadmap.thaiprogrammer.org/paths/web-guideline

export const LINKS = {
  webGuideline: "https://roadmap.thaiprogrammer.org/paths/web-guideline/",
  career: "https://roadmap.thaiprogrammer.org/paths/career/",
  freeCodeCamp: "https://www.freecodecamp.org/",
  repo: "https://github.com/ponggun/brands-braincamp-tech-workshop",
  talk: "https://youtube.com/playlist?list=PLbWE6xQS47vpOcP_7BfSrfruG16ECj1cU",
  handout:
    "https://github.com/ponggun/brands-braincamp-tech-workshop/raw/refs/heads/main/public/documents/BrainCamp2026-Tech-Slides.pdf",
};

export type LadderStep = {
  emoji: string;
  name: string;
  desc: string;
  highlight?: boolean;
};

// บันไดเรียน Web Dev — เป็น "แนวคิด/ขั้นตอน" ไม่อิงภาษาหรือเฟรมเวิร์ก
// ย่อจาก TPA web-guideline (roadmap.thaiprogrammer.org/paths/web-guideline)
export const LADDER: LadderStep[] = [
  {
    emoji: "🧱",
    name: "พื้นฐาน & เตรียมตัว",
    desc: "เข้าใจว่าเว็บทำงานยังไง + เตรียมเครื่องมือ + ฝึกอ่านอังกฤษ",
  },
  {
    emoji: "🎨",
    name: "หน้าบ้าน (Front End)",
    desc: "ทำสิ่งที่คนเห็นและกดใช้ — เริ่มตรงนี้ก่อน เห็นผลไวสุด 👈",
    highlight: true,
  },
  {
    emoji: "🧠",
    name: "หลังบ้าน (Back End)",
    desc: "ตรรกะเบื้องหลัง คิดเป็นขั้นตอน + ทำ API",
  },
  {
    emoji: "🗄️",
    name: "ฐานข้อมูล (Database)",
    desc: "เก็บและดึงข้อมูลอย่างเป็นระบบ",
  },
  {
    emoji: "🔀",
    name: "จัดการเวอร์ชัน (Git)",
    desc: "เก็บประวัติโค้ด + ทำงานเป็นทีมได้",
  },
  {
    emoji: "🚀",
    name: "ขึ้นออนไลน์ (Deploy & Cloud)",
    desc: "เอาเว็บออกสู่โลกให้คนใช้จริง",
  },
];

// ตัวคูณของ AI (จากทอล์กพี่ป้อง: No Tools=1 / Coding=10 / AI=100)
export type AmplifyRow = { tool: string; n: number };
export const AMPLIFY: AmplifyRow[] = [
  { tool: "ไม่มีเครื่องมือ", n: 1 },
  { tool: "เขียนโค้ดเป็น", n: 10 },
  { tool: "+ AI", n: 100 },
];
