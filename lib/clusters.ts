// 5 กลุ่มสายเทค — ย่อจาก roadmap สมาคมโปรแกรมเมอร์ไทย
// https://roadmap.thaiprogrammer.org/paths/career/

export type ClusterKey = "build" | "data" | "design" | "ops" | "connect";

export type ResourceLink = { label: string; url: string };

export type Cluster = {
  key: ClusterKey;
  emoji: string;
  name: string; // ชื่อกลุ่มไทย
  tagline: string; // "ถ้าคุณชอบ..."
  color: string; // hex สำหรับ UI
  careers: string[]; // อาชีพในกลุ่ม
  roadmap: string[]; // mini-roadmap 3–4 สเต็ป
  links: ResourceLink[]; // ลิงก์ฟรีเริ่มต้น
  advanced: ResourceLink[]; // โจทย์ท้าทาย/ลิงก์ลึก สำหรับเด็กสายลึก
};

export const CLUSTERS: Record<ClusterKey, Cluster> = {
  build: {
    key: "build",
    emoji: "🛠️",
    name: "Build — สร้างของ",
    tagline: "ชอบเห็นไอเดียในหัวกลายเป็นแอป เว็บ หรือเกมที่กดเล่นได้จริง",
    color: "#F26A21",
    careers: [
      "Frontend Developer",
      "Backend Developer",
      "Full-stack Developer",
      "Mobile Developer",
      "Game Developer",
      "Software Engineer",
    ],
    roadmap: [
      "เริ่มจาก HTML + CSS + JavaScript พื้นฐาน",
      "ลองทำเว็บ 1 หน้าเป็นของตัวเอง (โปรไฟล์/เกมทายคำ)",
      "เรียน Git แล้ว deploy ขึ้นเน็ตฟรี (GitHub Pages / Vercel)",
      "ต่อยอด framework เช่น React / Next.js",
    ],
    links: [
      { label: "roadmap.sh — Frontend", url: "https://roadmap.sh/frontend" },
      { label: "freeCodeCamp (เรียนฟรี)", url: "https://www.freecodecamp.org/" },
      {
        label: "แนวทาง Web Dev สมาคมฯ",
        url: "https://roadmap.thaiprogrammer.org/paths/web-guideline/",
      },
    ],
    advanced: [
      { label: "ทำ To-do app ที่เซฟข้อมูลได้จริง", url: "https://roadmap.sh/full-stack" },
      { label: "เรียน Git ให้ลึก + เปิด PR แรก", url: "https://learngitbranching.js.org/" },
    ],
  },
  data: {
    key: "data",
    emoji: "🤖",
    name: "Data & AI — ข้อมูล & สอนเครื่องให้ฉลาด",
    tagline: "ชอบเล่นกับตัวเลข จับแพตเทิร์น และสอนเครื่องให้ฉลาดขึ้น",
    color: "#7C3AED",
    careers: [
      "Data Analyst",
      "Data Scientist",
      "Data Engineer",
      "AI / ML Engineer",
      "BI Developer",
    ],
    roadmap: [
      "ฝึกใช้ Google Sheets/Excel + สถิติเบื้องต้น",
      "เรียน Python พื้นฐาน (ตัวแปร ลูป ฟังก์ชัน)",
      "เล่นกับชุดข้อมูลจริง แล้วลองตั้งคำถาม–หาคำตอบ",
      "ลองทำกราฟ/วิเคราะห์ และแตะ Machine Learning เบื้องต้น",
    ],
    links: [
      { label: "Kaggle Learn (เรียนฟรี)", url: "https://www.kaggle.com/learn" },
      { label: "roadmap.sh — AI & Data Scientist", url: "https://roadmap.sh/ai-data-scientist" },
      { label: "Python for Everybody", url: "https://www.py4e.com/" },
    ],
    advanced: [
      { label: "ลองแข่ง Kaggle ชุดข้อมูลจริง", url: "https://www.kaggle.com/competitions" },
      { label: "เล่นกับ AI API (เรียก LLM ด้วยโค้ด)", url: "https://roadmap.sh/ai-engineer" },
    ],
  },
  design: {
    key: "design",
    emoji: "🎨",
    name: "Design — ออกแบบประสบการณ์",
    tagline: "ชอบทำให้ของสวย ใช้ง่าย และเข้าใจหัวใจของคนใช้",
    color: "#EC4899",
    careers: ["UX Designer", "UI Designer", "Product Designer"],
    roadmap: [
      "เข้าใจหลักการออกแบบพื้นฐาน (สี ระยะ ลำดับสายตา)",
      "ลองใช้ Figma ทำหน้าจอแรกของตัวเอง",
      "เลือกแอปที่ใช้ยาก แล้ว redesign ให้ดีขึ้น",
      "ศึกษา UX research — ทำไมคนถึงกดตรงนั้น",
    ],
    links: [
      { label: "Figma (ใช้ฟรี)", url: "https://www.figma.com/" },
      { label: "roadmap.sh — UX Design", url: "https://roadmap.sh/ux-design" },
      {
        label: "Laws of UX (หลักคิด)",
        url: "https://lawsofux.com/",
      },
    ],
    advanced: [
      { label: "ออกแบบ + ต่อโค้ดจริงด้วย HTML/CSS", url: "https://roadmap.sh/design-system" },
      { label: "ทำ design system เล็ก ๆ", url: "https://www.designsystems.com/" },
    ],
  },
  ops: {
    key: "ops",
    emoji: "🛡️",
    name: "Operate & Secure — ดูแล/ป้องกัน",
    tagline: "ชอบทำให้ระบบเสถียร ปลอดภัย และไม่ล่มกลางดึก",
    color: "#0EA5E9",
    careers: [
      "DevOps Engineer",
      "Cloud Engineer",
      "System Admin",
      "Security Engineer",
      "QA / Tester",
    ],
    roadmap: [
      "เข้าใจระบบปฏิบัติการ + command line เบื้องต้น",
      "เรียนพื้นฐานเครือข่าย (network) และ cloud",
      "ลอง deploy บริการเล็ก ๆ แล้วดูแลให้มันรันอยู่",
      "ศึกษาพื้นฐานความปลอดภัย (security) และการทดสอบ",
    ],
    links: [
      { label: "roadmap.sh — DevOps", url: "https://roadmap.sh/devops" },
      { label: "roadmap.sh — Cyber Security", url: "https://roadmap.sh/cyber-security" },
      { label: "OverTheWire (เกมฝึก Linux/security)", url: "https://overthewire.org/wargames/" },
    ],
    advanced: [
      { label: "ตั้งเซิร์ฟเวอร์ + โดเมนของตัวเอง", url: "https://roadmap.sh/devops" },
      { label: "ลองโจทย์ CTF ด้านความปลอดภัย", url: "https://picoctf.org/" },
    ],
  },
  connect: {
    key: "connect",
    emoji: "🤝",
    name: "Connect & Consult — เชื่อมคน + ธุรกิจ",
    tagline: "ชอบคุยกับคน ฟังปัญหา แล้วแปลเป็นระบบที่ทีมสร้างต่อได้",
    color: "#16A34A",
    careers: [
      "Business Analyst",
      "Project Manager",
      "Product Owner",
      "Pre-sale",
      "Solution Architect",
      "Support",
    ],
    roadmap: [
      "ฝึกสื่อสารและสรุปความให้เข้าใจง่าย",
      "เรียนพื้นฐานการทำงานเป็นทีม (Agile / Scrum)",
      "ลองเป็น PM ของโปรเจกต์เล็ก ๆ กับเพื่อน",
      "ศึกษาการเก็บความต้องการ (requirement) แบบ BA",
    ],
    links: [
      { label: "roadmap.sh — Product Manager", url: "https://roadmap.sh/product-manager" },
      { label: "Atlassian Agile Coach", url: "https://www.atlassian.com/agile" },
      { label: "roadmap.sh — Career paths", url: "https://roadmap.sh/" },
    ],
    advanced: [
      { label: "เขียน user story + วางแผนสปรินต์", url: "https://www.atlassian.com/agile/project-management/user-stories" },
      { label: "จัดเวิร์กช็อปเล็ก ๆ เก็บ requirement", url: "https://www.atlassian.com/agile" },
    ],
  },
};

export const CLUSTER_ORDER: ClusterKey[] = [
  "build",
  "data",
  "design",
  "ops",
  "connect",
];
