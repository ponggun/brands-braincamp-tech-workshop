"use client";

import { useEffect, useState } from "react";
import type { SlideMeta } from "@/lib/deck";
import { getActivity } from "@/lib/activities";
import { CLUSTERS, CLUSTER_ORDER } from "@/lib/clusters";
import { LADDER, LINKS, AMPLIFY } from "@/lib/webdev";
import { ActivityControl } from "./ActivityControl";
import { ResultsPanel } from "./ResultsPanel";
import { QRCodeImg } from "./QRCodeImg";

type ViewProps = {
  slide: SlideMeta;
  activeActivity: string | null;
  presenterKey: string;
  onChanged: () => void;
};

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-sm font-semibold uppercase tracking-widest text-accent">
      {children}
    </p>
  );
}

function CoverQR() {
  // อ่าน hostname ที่เปิดหน้านี้อยู่ → gen QR อัตโนมัติ
  // เปิด /present ผ่าน URL ngrok → QR ชี้ ngrok ให้เอง ไม่ต้องวางมือ
  const [origin, setOrigin] = useState("");
  const [override, setOverride] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const envBase = process.env.NEXT_PUBLIC_JOIN_URL || "";
  const base = (override.trim() || envBase || origin).replace(/\/+$/, "");
  const joinUrl = base ? `${base}/join` : "";
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)/.test(
    override.trim() || envBase || origin
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <QRCodeImg url={joinUrl} size={260} />
      <p className="max-w-[280px] break-all text-center text-sm text-ink/60">
        {joinUrl || "…"}
      </p>
      {isLocal && (
        <p className="max-w-[280px] text-center text-xs font-medium text-accent-dark">
          ⚠️ กำลังเปิดผ่าน localhost — เปิดหน้านี้ผ่าน URL ngrok เพื่อให้ QR ชี้ tunnel อัตโนมัติ หรือวาง URL เองด้านล่าง
        </p>
      )}
      <input
        value={override}
        onChange={(e) => setOverride(e.target.value)}
        placeholder="(ออปชัน) วาง ngrok URL เอง เช่น https://xxxx.ngrok-free.app"
        className="w-full max-w-xs rounded-lg border border-black/10 px-3 py-2 text-sm"
      />
    </div>
  );
}

function ActivitySlide({
  activityId,
  kicker,
  extra,
  props,
}: {
  activityId: string;
  kicker: string;
  extra?: React.ReactNode;
  props: ViewProps;
}) {
  const activity = getActivity(activityId);
  if (!activity) return null;
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <Kicker>{kicker}</Kicker>
        <h1 className="mt-1 font-display text-4xl font-bold text-ink text-balance">
          {activity.title}
        </h1>
        {activity.subtitle && (
          <p className="mt-2 text-xl text-ink/60">{activity.subtitle}</p>
        )}
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-light px-4 py-2 font-semibold text-brand-dark">
          📱 น้องทำบนมือถือได้เลย
        </p>
        {extra}
      </div>
      <div className="grid gap-4">
        <ActivityControl
          activityId={activityId}
          activeActivity={props.activeActivity}
          presenterKey={props.presenterKey}
          onChanged={props.onChanged}
        />
        <ResultsPanel activityId={activityId} />
      </div>
    </div>
  );
}

function Step({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
      <span className="text-3xl">{n}</span>
      <span className="text-lg text-ink/80">{children}</span>
    </div>
  );
}

export function SlideView(props: ViewProps) {
  const { slide } = props;

  switch (slide.id) {
    case "cover":
      return (
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <Kicker>BRAND&apos;S Brain Camp 2026 · ขอนแก่น</Kicker>
            <h1 className="mt-2 font-display text-5xl font-bold text-ink md:text-6xl">
              Tech &amp; AI Playground
            </h1>
            <p className="mt-3 text-2xl text-ink/70">ลองเป็นคนสายเทคใน 60 นาที</p>
            <p className="mt-8 text-2xl font-bold text-brand">
              👉 สแกน QR เพื่อเข้าร่วม
            </p>
          </div>
          <div className="justify-self-center rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5">
            <CoverQR />
          </div>
        </div>
      );

    case "intro":
      return (
        <div>
          <Kicker>ทำความรู้จักกัน</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink">
            สวัสดีครับ ผมพี่ป้อง 👋
          </h1>
          <p className="mt-2 text-xl text-ink/60">
            โปรแกรมเมอร์ · Microsoft MVP · T.T. Software
          </p>
          <div className="mt-6 rounded-3xl bg-brand-light p-6 text-center">
            <p className="font-display text-2xl font-bold text-brand-dark">
              ผมสร้าง “เว็บ” และ “แอป” เป็นอาชีพ
            </p>
            <p className="mt-1 text-lg text-ink/70">
              …รวมถึง <span className="font-semibold">แอปที่น้องกำลังเปิดอยู่ตอนนี้</span> ด้วยแหละ 😎
            </p>
          </div>
          <p className="mt-4 text-lg text-ink/50">
            เดี๋ยวเราจะ “แกะ” มันดูกันว่าข้างในทำงานยังไง
          </p>
        </div>
      );

    case "icebreaker":
      return (
        <ActivitySlide
          activityId="icebreaker"
          kicker="ละลายพฤติกรรม 🧊"
          props={props}
          extra={
            <p className="mt-4 text-lg text-ink/50">
              ไม่เคยเขียนเลยก็เจ๋ง — วันนี้แหละที่เริ่มนับหนึ่ง 🐣
            </p>
          }
        />
      );

    case "why-tech":
      return (
        <div>
          <Kicker>Exploration · ค้นหา</Kicker>
          <h1 className="font-display text-4xl font-bold text-ink">
            ทำไมต้องเทค? 🛞
          </h1>
          <p className="mt-2 text-xl text-ink/60">
            เครื่องมือยิ่งพัฒนา งานซ้ำ ๆ ยิ่งเร็วขึ้น
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border-2 border-black/10 bg-white p-6">
              <p className="text-4xl">🖐️</p>
              <p className="mt-2 font-display text-2xl font-bold text-ink">ทำมือ</p>
              <p className="mt-1 text-lg text-ink/70">
                “ล้อเหลี่ยม” — งานซ้ำ ช้า เหนื่อย
              </p>
            </div>
            <div className="rounded-3xl border-2 border-black/10 bg-white p-6">
              <p className="text-4xl">🛠️</p>
              <p className="mt-2 font-display text-2xl font-bold text-ink">
                มีเครื่องมือ (โค้ด)
              </p>
              <p className="mt-1 text-lg text-ink/70">
                “ล้อกลม” — ไปได้ไกลและเร็วขึ้น
              </p>
            </div>
            <div className="rounded-3xl border-2 border-accent bg-accent-light p-6">
              <p className="text-4xl">🤖</p>
              <p className="mt-2 font-display text-2xl font-bold text-ink">มี AI</p>
              <p className="mt-1 text-lg text-ink/70">เร็วขึ้นไปอีกขั้น!</p>
            </div>
          </div>
          <p className="mt-6 text-center text-xl font-semibold text-accent">
            เทค = เปลี่ยนงานซ้ำซากให้เร็วขึ้น · แต่ยิ่งเครื่องมือแรง ยิ่งต้องรู้ว่ากำลังทำอะไร
          </p>
        </div>
      );

    case "cluster-guess":
      return (
        <ActivitySlide
          activityId="cluster-guess"
          kicker="ลองเดากันก่อน 🔮"
          props={props}
          extra={
            <div className="mt-4 flex flex-wrap gap-2">
              {CLUSTER_ORDER.map((key) => (
                <span
                  key={key}
                  className="rounded-full px-3 py-1 text-sm font-medium text-white"
                  style={{ backgroundColor: CLUSTERS[key].color }}
                >
                  {CLUSTERS[key].emoji} {CLUSTERS[key].name.split(" ")[0]}
                </span>
              ))}
            </div>
          }
        />
      );

    case "lab-intro":
      return (
        <div className="text-center">
          <p className="text-6xl">🎯</p>
          <h1 className="mt-4 font-display text-5xl font-bold text-ink">
            หยิบมือถือ! ทำแบบเช็ก 6 ข้อ
          </h1>
          <p className="mt-3 text-2xl text-ink/60">
            ตอบตามใจล้วน ๆ แล้วมาดู “สายที่ใช่” + mini-roadmap ของเรา
          </p>
          <p className="mt-8 inline-block rounded-full bg-brand-light px-6 py-3 text-xl font-semibold text-brand-dark">
            เดี๋ยวพี่กดเปิดให้ทำพร้อมกันในสไลด์ถัดไป →
          </p>
        </div>
      );

    case "career-quiz":
      return (
        <ActivitySlide
          activityId="career-quiz"
          kicker="LAB · ควิซจับกลุ่ม 🎯"
          props={props}
          extra={
            <p className="mt-4 text-lg text-ink/50">
              น้องทำตามสปีดตัวเอง — ผลรวมของห้องขึ้นทางขวาแบบสด ๆ
            </p>
          }
        />
      );

    case "focus-webdev":
      return (
        <div className="text-center">
          <Kicker>เจาะให้ลึก 1 สาย</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink">
            ทุกสายเจ๋งหมด — แต่วันนี้ขอเจาะ 1 สายให้ “เห็นภาพจริง”
          </h1>
          <p className="mt-6 font-display text-6xl font-bold text-brand">
            🌐 Web Development
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              "📱 แอปที่น้องใช้อยู่ = เว็บ",
              "✋ รูปธรรม จับต้องได้",
              "🤖 ตรงกับที่ AI จะช่วยสร้าง",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full bg-white px-4 py-2 text-lg font-medium text-ink shadow-sm ring-1 ring-black/5"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-6 text-lg text-ink/50">
            สายอื่นที่น้องได้จากควิซ → ไปเจาะต่อที่ TPA Roadmap (QR ท้ายคาบ)
          </p>
        </div>
      );

    case "app-anatomy":
      return (
        <div>
          <Kicker>แกะของจริง 🔍</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink">
            แอปที่น้องใช้อยู่ ข้างในเป็นแบบนี้
          </h1>
          <div className="mt-6 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-3xl border-2 border-brand bg-brand-light p-6">
              <p className="text-4xl">📱</p>
              <p className="mt-2 font-display text-2xl font-bold text-ink">
                Frontend — จอน้อง
              </p>
              <p className="mt-1 text-lg text-ink/70">
                สิ่งที่ “เห็น” และ “แตะ” ได้ — ปุ่มโหวต การ์ด สี ตัวหนังสือ
              </p>
            </div>
            <div className="flex items-center justify-center text-4xl text-ink/40">
              ↔
            </div>
            <div className="rounded-3xl border-2 border-ink bg-white p-6">
              <p className="text-4xl">💻</p>
              <p className="mt-2 font-display text-2xl font-bold text-ink">
                Backend — โน้ตบุ๊กพี่
              </p>
              <p className="mt-1 text-lg text-ink/70">
                “สมอง” เบื้องหลัง — รับข้อมูล นับคะแนน เก็บ แล้วส่งกลับ
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-3xl bg-ink p-5 text-center text-white">
            <p className="text-lg font-medium text-balance">
              ตอนน้องกดโหวต 👉 ข้อมูลวิ่งผ่านเน็ตไปโน้ตบุ๊กพี่ 👉 นับ 👉 ส่งผลกลับ 👉 ขึ้นจอใหญ่
            </p>
            <p className="mt-1 text-white/60">…ทั้งหมดใน ~2 วินาที · ทุกเว็บก็ทำงานแบบนี้</p>
          </div>
        </div>
      );

    case "fe-be-quiz":
      return (
        <ActivitySlide
          activityId="fe-be-quiz"
          kicker="เช็กความเข้าใจ ⚡"
          props={props}
          extra={
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-lg text-amber-800">
              💡 เฉลย (หลังปิดโพล): <b>ทั้งคู่!</b> ปุ่มที่เห็น = Frontend · พอกดแล้วส่งไปนับ = Backend
            </p>
          }
        />
      );

    case "frontend-three":
      return (
        <div>
          <Kicker>เจาะ Frontend</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink">
            หน้าเว็บ ประกอบด้วย 3 ชิ้น 🧩
          </h1>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { e: "🏗️", n: "HTML", h: "โครงบ้าน", d: "โครงสร้าง + เนื้อหา" },
              { e: "🎨", n: "CSS", h: "ทาสี แต่งบ้าน", d: "สี ฟอนต์ การจัดวาง" },
              { e: "⚡", n: "JavaScript", h: "รีโมท/สวิตช์", d: "กดแล้วมีอะไรเกิดขึ้น" },
            ].map((x) => (
              <div
                key={x.n}
                className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5"
              >
                <p className="text-5xl">{x.e}</p>
                <p className="mt-2 font-display text-2xl font-bold text-ink">{x.n}</p>
                <p className="mt-1 text-lg font-semibold text-accent">{x.h}</p>
                <p className="text-ink/60">{x.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xl font-semibold text-brand">
            3 อย่างนี้รวมกัน = หน้าเว็บที่น้องเห็นและเล่นได้
          </p>
        </div>
      );

    case "code-taste":
      return (
        <div>
          <Kicker>โค้ดจริง ๆ</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink">
            หน้าตาโค้ด ไม่น่ากลัวอย่างที่คิด 😎
          </h1>
          <p className="mt-2 text-xl text-ink/60">
            จำมุกเครื่องคิดเลขได้ไหม? คูณทีละคู่จนร้องไห้ 😹 — สั่งให้คอมคูณให้หมด “ในไม่กี่บรรทัด”
          </p>
          <pre className="mt-5 overflow-x-auto rounded-2xl bg-ink p-6 text-left font-mono text-base leading-relaxed text-white shadow-lg md:text-lg">
            <code>
              <span className="text-sky-300">const</span> pairs = [[22,37],[121,19],[23,46],[56,77],[63,32]]
              {"\n\n"}
              <span className="text-sky-300">for</span> (<span className="text-sky-300">const</span> [a, b] <span className="text-sky-300">of</span> pairs) {"{"}
              {"\n"}
              {"  "}console.<span className="text-yellow-200">log</span>(a, <span className="text-green-300">&quot;x&quot;</span>, b, <span className="text-green-300">&quot;=&quot;</span>, a * b)
              {"\n"}
              {"}"}
              {"\n\n"}
              <span className="text-white/40">{"// 22 x 37 = 814"}</span>
              {"\n"}
              <span className="text-white/40">{"// 121 x 19 = 2299"}</span>
              {"\n"}
              <span className="text-white/40">{"// 23 x 46 = 1058  ... ครบทุกคู่ในพริบตา 🎉"}</span>
            </code>
          </pre>
          <p className="mt-5 text-center text-xl font-semibold text-accent">
            โปรแกรม = สั่งให้คอมทำงานซ้ำ ๆ แทนเรา · แค่คิดเป็นขั้นตอน
          </p>
        </div>
      );

    case "webdev-ladder":
      return (
        <div>
          <Kicker>เริ่มยังไงดี</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink">
            บันไดเรียน Web Dev 🪜
          </h1>
          <p className="mt-2 text-xl text-ink/60">ไม่ต้องรีบ — ไต่ทีละขั้น</p>
          <div className="mt-5 grid gap-2.5">
            {LADDER.map((step, i) => (
              <div
                key={step.name}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                  step.highlight
                    ? "border-2 border-brand bg-brand-light"
                    : "bg-white shadow-sm ring-1 ring-black/5"
                }`}
              >
                <span className="w-8 text-center font-display text-xl font-bold text-ink/30">
                  {i + 1}
                </span>
                <span className="text-2xl">{step.emoji}</span>
                <span className="font-display text-lg font-bold text-ink">{step.name}</span>
                <span className="text-ink/60">— {step.desc}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-lg text-ink/50">
            รายละเอียดเต็ม ๆ ที่ web-guideline (QR ท้ายคาบ)
          </p>
        </div>
      );

    case "ai-amplify":
      return (
        <div>
          <Kicker>Preparation · เตรียมตัว</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink">
            แล้ว AI ล่ะ? 🤖 มันคือ “ตัวคูณ”
          </h1>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border-2 border-brand bg-brand-light p-5">
              <p className="font-display text-2xl font-bold text-ink">
                พื้นฐาน <span className="text-brand">ดี</span> × AI
              </p>
              <div className="mt-3 space-y-1.5 text-lg text-ink/80">
                {AMPLIFY.map((r) => (
                  <p key={r.tool}>
                    {r.tool} → ผลงาน<b className="text-brand-dark">ดี {r.n} ชิ้น</b>
                  </p>
                ))}
              </div>
              <p className="mt-2 text-3xl">🎉</p>
            </div>
            <div className="rounded-3xl border-2 border-red-300 bg-red-50 p-5">
              <p className="font-display text-2xl font-bold text-ink">
                พื้นฐาน <span className="text-red-500">ไม่ดี</span> × AI
              </p>
              <div className="mt-3 space-y-1.5 text-lg text-ink/80">
                {AMPLIFY.map((r) => (
                  <p key={r.tool}>
                    {r.tool} → <b className="text-red-500">ปัญหา {r.n} ชิ้น</b>
                  </p>
                ))}
              </div>
              <p className="mt-2 text-3xl">😱</p>
            </div>
          </div>
          <p className="mt-5 text-center text-xl font-semibold text-accent text-balance">
            AI ขยายสิ่งที่น้องมี — เลยต้องมีพื้นฐาน ถึงจะรู้ว่ามันทำ “ถูก” ไหม
          </p>
          <p className="mt-2 text-center text-ink/50">
            (gen โค้ด 5 นาที ⚡ แต่ถ้าไม่เข้าใจ debug กันยาว 😵)
          </p>
        </div>
      );

    case "ai-idea":
      return (
        <ActivitySlide
          activityId="ai-idea-poll"
          kicker="ช่วยกันคิด 💡"
          props={props}
          extra={
            <p className="mt-4 text-lg text-ink/50">
              พี่จะหยิบคำตอบยอดฮิต → สร้างสดด้วย Claude Code ในสไลด์ถัดไป →
            </p>
          }
        />
      );

    case "ai-live":
      return (
        <div className="text-center">
          <p className="animate-float text-6xl">👀</p>
          <h1 className="mt-4 font-display text-5xl font-bold text-ink">
            ดูจอพี่ — AI สร้างให้ดูสด ๆ
          </h1>
          <p className="mt-3 text-2xl text-ink/60">
            พี่จะสร้าง “สิ่งที่น้องโหวต” ด้วย Claude Code
          </p>
          <p className="mt-8 inline-block rounded-full bg-accent-light px-6 py-3 text-lg font-semibold text-accent-dark text-balance">
            สังเกตนะ: พี่มีพื้นฐาน → รู้ว่า AI ทำถูกไหม แก้ตรงไหน
          </p>
          <p className="mt-4 text-sm text-ink/40">(พี่สลับไปหน้าจอ Claude Code)</p>
        </div>
      );

    case "debrief":
      return (
        <div>
          <Kicker>Preparation · เตรียมตัว</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink">
            สรุปก่อนแยกย้าย 🎒
          </h1>
          <div className="mt-5 grid gap-3 sm:grid-cols-5">
            {[
              { e: "💻", t: "Coding", d: "คิดเป็นระบบ" },
              { e: "📋", t: "Project Mgmt", d: "แตก Job → Task" },
              { e: "💬", t: "Communication", d: "สื่อสารเข้าใจกัน" },
              { e: "🧭", t: "Digital Literacy", d: "ใช้เครื่องมือเป็น" },
              { e: "🌱", t: "Lifelong Learning", d: "เรียนรู้ตลอด" },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-black/5"
              >
                <p className="text-3xl">{x.e}</p>
                <p className="mt-1 font-display font-bold text-ink">{x.t}</p>
                <p className="text-sm text-ink/60">{x.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-3xl bg-ink p-6 text-center text-white">
            <p className="font-display text-2xl font-bold text-balance">
              “AI ไม่แทนคนเก่ง แต่คนใช้ AI เป็น จะแทนคนที่ไม่ใช้”
            </p>
            <p className="mt-2 text-white/70 text-balance">
              AI ไม่รู้ “ความต้องการ” เราทั้งหมด → เราต้องมี domain knowledge + คิดวิเคราะห์เอง · แล้วหา Ikigai ของตัวเอง 🌱
            </p>
          </div>
        </div>
      );

    case "next-step":
      return (
        <div>
          <h1 className="font-display text-4xl font-bold text-ink">เก็บกลับบ้าน 🎒</h1>
          <div className="mt-6 grid items-start gap-6 md:grid-cols-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col items-center gap-2 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <QRCodeImg url={LINKS.webGuideline} size={180} />
                <p className="text-center font-display font-bold text-ink">
                  เจาะ Web Dev ต่อ
                </p>
                <p className="text-center text-xs text-ink/40">web-guideline</p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <QRCodeImg url={LINKS.career} size={180} />
                <p className="text-center font-display font-bold text-ink">
                  สายอื่น ๆ (จากควิซ)
                </p>
                <p className="text-center text-xs text-ink/40">TPA career roadmap</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xl text-ink/80">• ทำควิซซ้ำที่บ้านได้ ลองหลายสาย</p>
              <p className="text-xl text-ink/80">
                • เปิดปุ่ม <span className="font-bold text-accent">Advanced 🔥</span> ถ้าอยากไปต่อ
              </p>
              <p className="text-xl text-ink/80">
                • ตามทอล์ก/ช่องของพี่ป้อง{" "}
                <span className="text-ink/40">(ใส่ลิงก์ภายหลัง)</span>
              </p>
              <p className="pt-3 font-display text-3xl font-bold text-brand">
                ขอบคุณที่มาเล่นด้วยกันวันนี้! 🎉
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return <div>ไม่พบสไลด์</div>;
  }
}
