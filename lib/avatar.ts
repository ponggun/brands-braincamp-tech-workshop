// สร้าง avatar แบบ deterministic จากข้อความ — ไม่ใช้ Math.random
// เพื่อให้ avatar ของคำตอบเดิม "นิ่ง" ไม่เปลี่ยนทุกครั้งที่ poll ผลใหม่
// ทุกอย่าง self-contained (emoji + gradient) ไม่ต้องโหลดรูปจากเน็ต

const FACES = [
  "🦊", "🐼", "🐯", "🦁", "🐸", "🐙", "🦄", "🐲",
  "🤖", "👾", "🐺", "🦉", "🐨", "🐵", "🦖", "🐳",
  "🦈", "🐝", "🦋", "🐢", "🦕", "🐬", "🦩", "🦚",
  "🐧", "🐰", "🐣", "🐮", "🦭", "🦔", "🐙", "👽",
];

// คู่สี gradient สดใส (ไล่จากมุมซ้ายบน)
const GRADIENTS: [string, string][] = [
  ["#FF9A3C", "#F2542D"],
  ["#00C2A8", "#00A651"],
  ["#3AB0FF", "#3B5BDB"],
  ["#B06AB3", "#7C3AED"],
  ["#FF6FB5", "#EC4899"],
  ["#FFC93C", "#FF9A3C"],
  ["#2DD4BF", "#0EA5E9"],
  ["#F97316", "#DB2777"],
  ["#22C55E", "#0EA5E9"],
  ["#8B5CF6", "#EC4899"],
];

// djb2 hash — เสถียร กระจายดีพอสำหรับเลือก avatar
function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

export type Avatar = { face: string; gradient: string };

export function avatarFor(seed: string): Avatar {
  const h = hash(seed);
  const face = FACES[h % FACES.length];
  const [a, b] = GRADIENTS[Math.floor(h / FACES.length) % GRADIENTS.length];
  return { face, gradient: `linear-gradient(135deg, ${a}, ${b})` };
}
