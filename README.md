# Tech & AI Playground — BRAND'S Brain Camp 2026

เว็บแอปเดียวสำหรับเวิร์กช็อป **Tech skill · 60 นาที** (รอบขอนแก่น) — พี่คุมสไลด์บนโน้ตบุ๊ก
น้องสแกน QR เข้าจากมือถือเพื่อ **ทำกิจกรรม/ควิซ** โดยพี่เป็นคนกดเปิดกิจกรรมเองทีละอัน

- **จอพี่ `/present`** — เด็คสไลด์ (คุมด้วยปุ่ม/ลูกศร) + ปุ่มเปิดกิจกรรม + แผงผลสด + QR
- **มือถือน้อง `/join`** — 2 สถานะเท่านั้น: *กิจกรรมที่พี่เปิด* หรือ *standby "มองจอใหญ่"*
- ไม่มี DB · เก็บ state ใน memory · **ไม่เก็บข้อมูลส่วนตัวของน้อง** (anonymous id, PDPA)

> โมเดล "decouple": มือถือน้อง **ไม่ได้ mirror สไลด์พี่** — จะสว่างขึ้นเฉพาะตอนพี่กด **เปิดกิจกรรม**
> ให้น้องโฟกัสที่ interactive ไม่สับสนกับจอใหญ่

---

## เริ่มใช้งาน

```bash
npm install
npm run dev            # เปิด http://localhost:3000
```

- จอพี่: <http://localhost:3000/present>
- จอน้อง (ลองบนเครื่องเดียวกันก่อน): <http://localhost:3000/join>

Production:

```bash
npm run build && npm run start      # เพิ่ม -- -p 3100 เพื่อเปลี่ยนพอร์ต
```

### รันผ่าน VS Code (Task Runner)

มี `.vscode/tasks.json` ให้แล้ว — เปิด **Terminal → Run Task…** (หรือ `Cmd/Ctrl+Shift+B` = Run Dev Server) แล้วเลือก:

| Task | ทำอะไร |
|---|---|
| 1. Install Dependencies | `npm install` |
| 2. Run Dev Server (port 3000) ⭐ | รัน dev บนพอร์ต 3000 — เป็น default build task |
| 3. Build | build production |
| 4. Run Production Server (port 3000) | รันตัวที่ build แล้ว (แนะนำวันงานจริง) |
| 5. Build Static Fallback | build โหมดสำรองไว้ขึ้น Vercel |
| 6. Expose via ngrok (port 3000) | เปิด tunnel ให้น้องสแกน — รัน Task 2 หรือ 4 ก่อน |

> ⚠️ Task 6 (ngrok) forward ไป `localhost:3000` **ต้องรัน Task 2 หรือ 4 (พอร์ต 3000) ให้ขึ้นก่อน** แล้วเอา
> **Forwarding URL** ที่ ngrok ให้ (`https://xxxx.ngrok-free.app`) ไปวางในช่องใต้ QR ที่หน้า `/present`
> หรือเปิด `/present` ผ่าน URL ngrok เลย → QR จะชี้ tunnel อัตโนมัติ

---

## เอา QR ให้น้องสแกนหน้างาน (tunnel)

รันแอปบนโน้ตบุ๊ก แล้วเปิดออกเน็ตด้วยวิธีใดวิธีหนึ่ง:

**ngrok**
```bash
ngrok http 3000
# ได้ URL เช่น https://xxxx.ngrok-free.app
```

**VS Code Port Forwarding**
- แท็บ **PORTS** → Forward a Port → `3000` → คลิกขวาตั้ง **Visibility = Public** → คัดลอก URL

จากนั้นในหน้า `/present` (สไลด์ปก) **วาง tunnel URL ลงในช่องใต้ QR** → ระบบต่อท้าย `/join` ให้เอง
แล้ว QR จะอัปเดตทันที (ค่านี้จำไว้ในเครื่อง ไม่ต้องกรอกซ้ำ)

> ⚠️ ความเสี่ยงหลัก = น้อง ~50 เครื่องต่อ tunnel เดียว **ทดสอบก่อนวันจริง**: เปิด tunnel แล้วให้เพื่อน 5–10 คนสแกนพร้อมกัน

---

## การคุมงานหน้างาน (จอพี่)

- **← / →** (หรือปุ่มบนแถบล่าง) เลื่อนสไลด์ · Space = ถัดไป
- สไลด์ที่มีกิจกรรมจะมีปุ่ม **▶ เปิดให้น้องทำ** → มือถือน้องสว่างพร้อมกัน · **⏸ ปิด · ดูผล** = กลับ standby
- แถบล่างโชว์ **จำนวนคนออนไลน์** และปุ่มเตือน **🟢 ยังเปิด: …** เผื่อเผลอเลื่อนสไลด์ทั้งที่ยังเปิดกิจกรรมค้างไว้
- **ล้างผลกิจกรรมนี้** = รีเซ็ตคะแนนของกิจกรรมนั้น (เช่น ซ้อมแล้วอยากเคลียร์)

ลำดับกิจกรรม: `icebreaker` (โพลละลาย) → `quickpoll` (คั่น) → `cluster-guess` (เดากลุ่ม) → `career-quiz` (จับกลุ่ม 6 ข้อ)

---

## ตัวแปรสภาพแวดล้อม (`.env.local`)

คัดลอกจาก `.env.example`:

| ตัวแปร | ความหมาย |
|---|---|
| `NEXT_PUBLIC_JOIN_URL` | URL สาธารณะที่น้องสแกน (จะกรอกสดในหน้า `/present` แทนก็ได้) |
| `NEXT_PUBLIC_STATIC_MODE` | `1` = โหมดสำรอง client-only (ดูด้านล่าง) |
| `PRESENTER_KEY` | (ออปชัน) ถ้าตั้งไว้ ต้องกรอกรหัสนี้ในช่อง "รหัส presenter" หน้า `/present` ก่อนจึงจะคุมกิจกรรมได้ — กันน้องแอบกด |

---

## แผนสำรอง (Static fallback)

ถ้า tunnel/โน้ตบุ๊กมีปัญหา ยังให้น้องทำ **ควิซ + roadmap** เองได้ (ไม่มี live dashboard):

```bash
NEXT_PUBLIC_STATIC_MODE=1 npm run build
```

deploy ขึ้น **Vercel** (แนะนำ) แล้วทำ **QR สำรอง** ชี้ไปที่ `<vercel-url>/join`
ในโหมดนี้หน้า `/join` จะเป็นเมนูให้น้องกดทำกิจกรรมเองทั้งหมด โดยไม่ต้องต่อกับเครื่องพี่

> เตรียม QR 2 อัน (tunnel + static) ไว้ในสไลด์เดียว เผื่อสลับหน้างาน

---

## แก้เนื้อหา

| อยากแก้ | ไฟล์ |
|---|---|
| คำถามโพล / icebreaker | `lib/activities.ts` |
| ควิซจับกลุ่ม 6 ข้อ + น้ำหนักคะแนน | `lib/quiz.ts` |
| 5 กลุ่มสายเทค + roadmap + ลิงก์ + Advanced | `lib/clusters.ts` |
| ลำดับสไลด์ | `lib/deck.ts` |
| เนื้อหาบนสไลด์ (JSX) | `components/present/SlideView.tsx` |

> TODO: ใส่ลิงก์ทอล์ก/ช่องของพี่ป้องในสไลด์ `next-step` (`components/present/SlideView.tsx`, ตัวแปรใกล้ ๆ `RESOURCE_URL`)

---

## สถาปัตยกรรมย่อ

```
/present ── กด next/เปิดกิจกรรม ──► POST /api/activity ─┐
                                                        ├─► in-memory store (globalThis)
/join ── poll ทุก 2.5 วิ ──► GET /api/live ─────────────┘        (activeActivity, votes, quiz)
/join ── ส่งคำตอบ ──► POST /api/respond ────────────────►
/present ── poll ผลสด ──► GET /api/results ─────────────►
```

Stack: **Next.js 14 (App Router) · TypeScript · Tailwind CSS · qrcode** · ฟอนต์ไทย Sarabun/Prompt (self-host)
