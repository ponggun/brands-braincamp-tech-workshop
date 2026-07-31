// ทำ QR ให้น้องสแกนดูหน้าเดโมบนมือถือ — ใช้ครั้งเดียวตอนเริ่ม (URL ไม่เปลี่ยนตลอด 3 stage)
// ใช้: node .claude/skills/web-3-pieces/scripts/make-qr.mjs "https://braincamp.ponggun.com/demo/"
// อาศัย package `qrcode` ที่ repo นี้มีอยู่แล้ว — ถ้ารันนอก repo ให้ใช้ `npx qrcode` แทน

import QRCode from "qrcode";

const url = process.argv[2];
const out = process.argv[3] ?? "public/demo/demo-qr.png";

if (!url) {
  console.error('ต้องใส่ URL ด้วย เช่น: node make-qr.mjs "https://braincamp.ponggun.com/demo/"');
  process.exit(1);
}

// margin กว้างหน่อย + ขนาดใหญ่ เพราะน้องสแกนจากที่นั่งไกล ๆ ผ่านโปรเจกเตอร์
await QRCode.toFile(out, url, { width: 800, margin: 3 });
console.log(`QR พร้อมแล้ว → ${out}\nชี้ไปที่: ${url}`);
