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
      <QRCodeImg url={joinUrl} size={260} href={joinUrl || undefined} />
      {joinUrl ? (
        <a
          href={joinUrl}
          target="_blank"
          rel="noreferrer"
          className="max-w-[280px] break-all text-center text-sm font-medium text-brand underline decoration-brand/40 underline-offset-2"
        >
          {joinUrl} ↗
        </a>
      ) : (
        <p className="max-w-[280px] break-all text-center text-sm text-ink/60">…</p>
      )}
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

function MultiplyDemo() {
  // เดโมสด: โปรแกรมทำ "งานซ้ำ ๆ" (คูณเลข) ให้หมดในพริบตา
  const [count, setCount] = useState(100);
  const [rows, setRows] = useState<{ a: number; b: number; p: number }[]>([]);
  const [ms, setMs] = useState<number | null>(null);

  function run(n: number) {
    const size = Math.min(Math.max(1, Math.floor(n) || 0), 10000);
    setCount(size);
    const t0 = performance.now();
    const out: { a: number; b: number; p: number }[] = [];
    for (let i = 0; i < size; i++) {
      const a = 2 + Math.floor(Math.random() * 98);
      const b = 2 + Math.floor(Math.random() * 98);
      out.push({ a, b, p: a * b });
    }
    const t1 = performance.now();
    setRows(out);
    setMs(t1 - t0);
  }

  // สมมติคนคูณมือ ~10 วินาที/ข้อ ไว้เทียบให้เห็นภาพ
  const humanMins = (rows.length * 10) / 60;

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <p className="font-display text-lg font-bold text-ink">ลองสั่งโปรแกรมคูณเลขดู 👇</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {[10, 100, 1000, 10000].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => run(n)}
            className={`rounded-xl px-3 py-2 text-sm font-semibold ring-1 ring-black/10 ${
              count === n ? "bg-ink text-white" : "bg-black/5 text-ink"
            }`}
          >
            {n.toLocaleString()} ข้อ
          </button>
        ))}
        <input
          type="number"
          value={count}
          min={1}
          max={10000}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-24 rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => run(count)}
          className="rounded-xl bg-accent px-4 py-2 font-semibold text-white"
        >
          ▶ รัน
        </button>
      </div>

      {ms !== null ? (
        <>
          <div className="mt-4 grid max-h-52 grid-cols-2 gap-x-4 gap-y-1 overflow-auto rounded-2xl bg-ink p-4 font-mono text-sm text-white sm:grid-cols-3">
            {rows.slice(0, 24).map((r, i) => (
              <span key={i}>
                {r.a}×{r.b}=<span className="text-green-300">{r.p}</span>
              </span>
            ))}
          </div>
          {rows.length > 24 && (
            <p className="mt-1 text-center text-sm text-ink/50">
              …และอีก {(rows.length - 24).toLocaleString()} ข้อ (คิดครบหมดแล้ว)
            </p>
          )}
          <div className="mt-3 text-center">
            <p className="text-lg font-bold text-brand-dark">
              ⏱ โปรแกรมคิด {rows.length.toLocaleString()} ข้อ ใน {ms.toFixed(1)} ms
            </p>
            <p className="text-ink/60">
              ถ้าคนคูณมือ ~10 วิ/ข้อ ≈{" "}
              {humanMins < 60
                ? `${Math.round(humanMins)} นาที`
                : `${(humanMins / 60).toFixed(1)} ชั่วโมง`}
            </p>
          </div>
        </>
      ) : (
        <p className="mt-4 rounded-2xl bg-black/5 p-6 text-center text-ink/50">
          กดปุ่มด้านบน แล้วดูโปรแกรมคูณเลขให้หมดในพริบตา ✨
        </p>
      )}
    </div>
  );
}

function ExploreImage({
  src,
  alt,
  title,
  subtitle,
  caption,
  takeaway,
  kicker = "Exploration · ค้นหา",
}: {
  src: string;
  alt: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  caption?: React.ReactNode;
  takeaway?: React.ReactNode;
  kicker?: React.ReactNode;
}) {
  // สไลด์ "1 หน้า = 1 ภาพใหญ่" ให้หน้าตากลมกลืนกันทั้งชุด
  return (
    <div>
      <Kicker>{kicker}</Kicker>
      <h1 className="mt-1 font-display text-4xl font-bold text-ink text-balance">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-xl text-ink/60">{subtitle}</p>}
      <figure className="mt-5 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="mx-auto block max-h-[60vh] w-full object-contain"
        />
        {caption && (
          <figcaption className="border-t border-black/5 px-5 py-3 text-center text-lg text-ink/70">
            {caption}
          </figcaption>
        )}
      </figure>
      {takeaway && (
        <p className="mt-5 text-center text-xl font-semibold text-accent text-balance">
          {takeaway}
        </p>
      )}
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

function FlowStep({
  n,
  tone,
  children,
}: {
  n: number;
  tone: "brand" | "ink";
  children: React.ReactNode;
}) {
  const badge = tone === "brand" ? "bg-brand text-white" : "bg-ink text-white";
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold ${badge}`}
      >
        {n}
      </span>
      <span className="text-lg text-ink/80">{children}</span>
    </div>
  );
}

function QRCard({ url, title, sub }: { url: string; title: string; sub: string }) {
  // การ์ด QR ที่ "กดได้" ทั้งตัว QR และข้อความลิงก์ (เผื่อสแกนไม่สะดวก)
  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <QRCodeImg url={url} size={150} href={url} />
      <p className="text-center font-display font-bold text-ink">{title}</p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="max-w-full break-all text-center text-xs font-semibold text-brand underline decoration-brand/40 underline-offset-2"
      >
        {sub} ↗
      </a>
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
            สวัสดีครับ ผมชื่อ พี่ป้องกัน ยินดีที่ได้รู้จักนะครับ 👋
          </h1>
          <p className="mt-2 text-xl text-ink/60">
            ปัจจุบันเป็น กรรมการผู้จัดการ บริษัท T.T. Software Solution
            <br />
            ประสบการณ์ทำงานเป็น Programmer มา 20 ปี ครับ
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

    case "know-neighbor":
      return (
        <ActivitySlide
          activityId="know-neighbor"
          kicker="ทำความรู้จักกัน 👋"
          props={props}
          extra={
            <p className="mt-4 text-lg text-ink/50">
              ยังไม่รู้จักก็ไม่เป็นไร — เดี๋ยวลองหันไปทักชื่อเพื่อนข้าง ๆ กันดู 😉
            </p>
          }
        />
      );

    case "expectation":
      return (
        <ActivitySlide
          activityId="expectation"
          kicker="ก่อนเริ่ม · ความคาดหวัง 🎯"
          props={props}
          extra={
            <p className="mt-4 text-lg text-ink/50">
              คำตอบของน้องจะขึ้นมาโชว์บนจอนี้แบบสด ๆ — พิมพ์ได้เลย!
            </p>
          }
        />
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

    case "why-code":
      return (
        <ActivitySlide
          activityId="why-code"
          kicker="ชวนคิดก่อนไปต่อ 🤔"
          props={props}
          extra={
            <p className="mt-4 text-lg text-ink/50">
              ยังไม่ต้องรู้คำตอบก็ได้ — ลองเดา/แชร์ดู แล้วเดี๋ยวเรามาเฉลยไปด้วยกันในสไลด์ถัด ๆ ไป
            </p>
          }
        />
      );

    case "why-tech-problem":
      return (
        <ExploreImage
          src="/why-tech/2.jpg"
          alt="งานซ้ำ ๆ ทำมือ เหนื่อย เหมือนปั่นล้อเหลี่ยม"
          title={<>เทคโนโลยีเกิดมาเพื่อแก้ “ปัญหา” 🧩</>}
          subtitle="ทุกเครื่องมือ เริ่มจากการเจอปัญหา แล้วอยากทำให้ชีวิตสะดวกขึ้น"
          caption="งานซ้ำ ๆ ทำมือ = ช้า เหนื่อย (“ล้อเหลี่ยม”)"
          takeaway="แล้ว “การเขียนโปรแกรม” คือวิธีที่เราสร้างเครื่องมือมาแก้ปัญหาพวกนี้เอง"
        />
      );

    case "why-tech-compare":
      return (
        <ExploreImage
          src="/why-tech/3.jpg"
          alt="เทียบการทำงานเมื่อไม่มี vs มีเทคโนโลยี"
          title="ไม่มี vs มีเทคโนโลยี ต่างกันแค่ไหน?"
          subtitle="เครื่องมือยิ่งพัฒนา งานซ้ำ ๆ ยิ่งเร็วขึ้น"
          caption="พอมีเทคเข้ามาช่วย → เร็ว ง่าย เก็บ/แก้/ติดตามง่ายขึ้น"
          takeaway="ความต่างนี้แหละ คือเหตุผลที่เราอยากมีเครื่องมือมาช่วย"
        />
      );

    case "why-tech-single":
      return (
        <ExploreImage
          src="/why-tech/6.jpg"
          alt="คูณเลขคู่เดียว 22 x 37 ตอบได้สบาย = 814"
          title={<>คูณแค่ “คู่เดียว” — สบายมาก 😎</>}
          subtitle="22 × 37 = 814 · แบบนี้ทำมือได้ ไม่มีปัญหา"
          caption="โจทย์เดียว ใคร ๆ ก็ตอบได้ชิล ๆ"
          takeaway="แล้วถ้าไม่ได้มีแค่คู่เดียวล่ะ? 👀"
        />
      );

    case "why-tech-manual":
      return (
        <ExploreImage
          src="/why-tech/8.jpg"
          alt="คูณเลขทีละคู่หลายข้อจนท้อ"
          title={<>ทำมือทีละข้อ… เยอะเข้าก็ร้องไห้ 😹</>}
          subtitle="พอโจทย์รัวมาเป็นสิบเป็นร้อยคู่… ทำมือไม่ไหวแล้ว 😵"
          caption="22×37, 121×19, 23×46, 56×77 … ทำมือหมดนี่ท้อแน่นอน"
          takeaway="ถ้าเป็นงานซ้ำ ๆ แบบนี้ — ให้ “โปรแกรม” ทำแทนสิ ⤵"
        />
      );

    case "why-tech-demo":
      return (
        <div>
          <Kicker>Exploration · ค้นหา</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink">
            โปรแกรมแก้ “งานซ้ำ ๆ” ยังไง? ⚡
          </h1>
          <p className="mt-2 text-xl text-ink/60">
            เราแค่บอกคอมเป็น “ขั้นตอน” — เขียนครั้งเดียว คอมทำซ้ำให้กี่รอบก็ได้
          </p>
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
            <div>
              <p className="mb-2 font-display text-lg font-bold text-ink">
                สิ่งที่เราบอกคอม (แบบภาษาคน) 👇
              </p>
              <pre className="overflow-x-auto rounded-2xl bg-ink p-6 text-left font-mono text-lg leading-loose text-white shadow-lg">
                <code>
                  <span className="text-yellow-200">ทำซ้ำ</span> 100 ครั้ง {"{"}
                  {"\n"}
                  {"    "}สุ่มเลข 2 ตัว มาเป็น a กับ b
                  {"\n"}
                  {"    "}โชว์ผล{"  "}
                  <span className="text-green-300">a × b</span>
                  {"\n"}
                  {"}"}
                </code>
              </pre>
              <p className="mt-3 text-base text-ink/60 text-balance">
                แค่นี้เอง! คำว่า <b className="text-ink">“ทำซ้ำ”</b> คือหัวใจ — งานที่คนทำมือแล้วเหนื่อย
                คอมทำรัว ๆ ได้สบาย (โค้ดจริงก็สั้นประมาณนี้)
              </p>
            </div>
            <MultiplyDemo />
          </div>
          <p className="mt-6 text-center text-xl font-semibold text-accent text-balance">
            อ๋อ… เราแก้ปัญหาแบบนี้เอง! เขียนขั้นตอนครั้งเดียว สั่งให้คอมทำซ้ำกี่รอบก็ได้ = พลังของการเขียนโปรแกรม
          </p>
        </div>
      );

    case "why-tech-benefits": {
      const perks = [
        { e: "⚡", t: "ประสิทธิภาพ & เร็ว", d: "งานซ้ำ ๆ ทำอัตโนมัติ เร็วกว่าทำมือมาก" },
        { e: "🎯", t: "แม่นยำ & สม่ำเสมอ", d: "ทำเหมือนเดิมทุกครั้ง ไม่มั่ว ไม่เพี้ยน" },
        { e: "💰", t: "ประหยัด", d: "ลดแรงคน + ลดข้อผิดพลาดในระยะยาว" },
        { e: "📈", t: "ขยายขนาดได้", d: "100 หรือ 100,000 งาน ก็รับไหว" },
      ];
      return (
        <div>
          <Kicker>Exploration · ค้นหา</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink">
            ข้อดีของการ “เขียนโปรแกรม” 💪
          </h1>
          <p className="mt-2 text-xl text-ink/60">
            สรุป: ไม่ใช่แค่ “เร็ว” — แต่ได้ทักษะติดตัวไปด้วย
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((x) => (
              <div
                key={x.t}
                className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5"
              >
                <p className="text-4xl">{x.e}</p>
                <p className="mt-2 font-display text-xl font-bold text-ink">{x.t}</p>
                <p className="mt-1 text-ink/70">{x.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-3xl border-2 border-accent bg-accent-light p-5">
            <p className="font-display text-xl font-bold text-ink">
              🧠 การคิดอย่างเป็นระบบ — ของแถมที่สำคัญที่สุด
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["วางแผน", "แก้ปัญหา", "วิเคราะห์", "จัดระเบียบ", "คิดเชิงตรรกะ"].map(
                (s) => (
                  <span
                    key={s}
                    className="rounded-full bg-white px-4 py-1.5 font-semibold text-accent-dark shadow-sm"
                  >
                    {s}
                  </span>
                )
              )}
            </div>
            <p className="mt-3 text-ink/70">
              ทักษะพวกนี้ใช้ได้กับ “ทุกเรื่อง” ในชีวิต ไม่ใช่แค่ตอนเขียนโค้ด
            </p>
          </div>
        </div>
      );
    }

    case "plife-divide":
      return (
        <ExploreImage
          kicker="คิดแบบโปรแกรมเมอร์ 🧩"
          src="/programmer-life/1.jpg"
          alt="Divide and Conquer — แบ่งปัญหาใหญ่เป็นปัญหาย่อยแล้วแก้ทีละอัน"
          title="เขียนโปรแกรม = แบ่งปัญหาใหญ่ → แก้ทีละชิ้น"
          subtitle="ปัญหาที่ดูยาก พอซอยเป็นชิ้นเล็ก ๆ ก็แก้ได้ทีละอัน แล้วเอามารวมกัน"
          caption="Divide (แบ่ง) → solve ทีละ subproblem → Combine (รวม) เป็นคำตอบ"
          takeaway="ทักษะ “แบ่งปัญหา” ใช้ได้กับทุกเรื่องในชีวิต ไม่ใช่แค่โค้ด"
        />
      );

    case "plife-customer":
      return (
        <ExploreImage
          kicker="โลกการทำงานจริง 💼"
          src="/programmer-life/2.jpg"
          alt="ลูกค้าอยากได้เครื่องทุนแรง มาหา Software House"
          title="งานจริงเริ่มจาก… ลูกค้ามี “ปัญหา”"
          subtitle="ลูกค้าอยากได้ของทุ่นแรง → มาหา Software House ให้ช่วยสร้าง"
          caption="Customer: “อยากได้เครื่องทุนแรง” → Software House: “ก็มาดิค้าบ”"
          takeaway="โปรแกรมเมอร์ = คนที่เปลี่ยน “ความอยากได้” ของคนอื่น ให้เป็นของจริง"
        />
      );

    case "plife-sdlc":
      return (
        <ExploreImage
          kicker="โลกการทำงานจริง 💼"
          src="/programmer-life/3.jpg"
          alt="ขั้นตอนพัฒนาซอฟต์แวร์ Requirements Design Construction Testing Maintenance"
          title="โปรเจกต์จริง มีขั้นตอนชัดเจน ไม่ได้เขียนรวดเดียว"
          subtitle="งานใหญ่แบ่งเป็นสเต็ป — แต่ละสเต็ปคือ “ชิ้นเล็ก” ของงานใหญ่"
          caption="Requirements → Design → Construction → Testing → Maintenance"
          takeaway="เห็นไหม? งานจริงก็คือ “แบ่งปัญหาใหญ่” เป็นขั้น ๆ นั่นเอง"
        />
      );

    case "plife-jobtask":
      return (
        <ExploreImage
          kicker="โลกการทำงานจริง 💼"
          src="/programmer-life/4.jpg"
          alt="แตก Job อยากได้ปุ่ม Login Facebook ออกเป็นหลาย Task"
          title="1 คำขอลูกค้า = แตกเป็นหลาย “Task”"
          subtitle="เช่น “อยากได้ปุ่ม Login Facebook” (Job) → ซอยเป็นงานย่อย ๆ ทีละขั้น"
          caption="เก็บ Requirement → หาวิธี → ออกแบบ → ยืนยัน → พัฒนา+ทดสอบ → ลูกค้าตรวจรับ"
          takeaway="แตก Job → Task แล้วเก็บทีละอัน — นี่แหละงานโปรแกรมเมอร์ตัวจริง 👨‍💻"
        />
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

    case "webdev-why": {
      const roles = [
        { icon: "🌐", label: "Full-stack (เว็บ)", pct: 30.7, web: true },
        { icon: "🌐", label: "Back-end (เว็บ)", pct: 16.7, web: true },
        { icon: "🌐", label: "Front-end (เว็บ)", pct: 5.6, web: true },
        { icon: "🖥️", label: "Desktop / Enterprise", pct: 4.2, web: false },
        { icon: "📱", label: "Mobile", pct: 3.4, web: false },
        { icon: "🔌", label: "Embedded / IoT", pct: 2.7, web: false },
        { icon: "🎮", label: "Game / Graphics", pct: 1.2, web: false },
      ];
      const max = 30.7;
      return (
        <div>
          <Kicker>ทำไมต้องเจาะ Web 🌐</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink text-balance">
            เพราะ Web คือสายที่คนทำ “เยอะที่สุด” ในโลก
          </h1>
          <p className="mt-2 text-lg text-ink/60">
            สำรวจนักพัฒนาทั่วโลกกว่า 65,000 คน — งานที่ทำเป็นหลัก (Stack Overflow 2024)
          </p>
          <div className="mt-5 space-y-1.5">
            {roles.map((r) => (
              <div key={r.label} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-right text-sm font-medium text-ink/80">
                  {r.icon} {r.label}
                </span>
                <div className="flex-1">
                  <div
                    className={`h-7 rounded-lg ${r.web ? "bg-brand" : "bg-ink/25"}`}
                    style={{ width: `${(r.pct / max) * 100}%` }}
                  />
                </div>
                <span className="w-12 shrink-0 text-sm font-bold text-ink">
                  {r.pct}%
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-brand-light p-4">
              <p className="font-display font-bold text-brand-dark">
                🥇 3 อันดับแรก = สาย Web ทั้งหมด รวม ≈ 53%
              </p>
              <p className="mt-1 text-sm text-ink/60">
                ภาษาที่คนใช้มากสุด: JavaScript 62% · HTML/CSS 53% — ภาษาของเว็บล้วน ๆ
              </p>
            </div>
            <div className="rounded-2xl border-2 border-accent bg-accent-light p-4">
              <p className="font-display font-bold text-ink">
                👉 อยากลองสายเทค? เริ่มที่ “เว็บ” เป็นงานอดิเรกก่อนเลย
              </p>
              <p className="mt-1 text-sm text-ink/70">
                เห็นผลไว แชร์ลิงก์อวดเพื่อนได้ทันที + ค่อย ๆ สะสมเป็น portfolio ของตัวเอง
              </p>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-ink/40">
            ที่มา: Stack Overflow Developer Survey 2024 · survey.stackoverflow.co/2024
          </p>
        </div>
      );
    }

    case "app-anatomy":
      return (
        <div>
          <Kicker>แกะของจริง 🔍</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink">
            แอปที่น้องใช้อยู่ ข้างในทำงานยังไง? 🔍
          </h1>
          <p className="mt-2 text-xl text-ink/60">
            ไล่เลข 1 → 5 ดู — กดโหวต 1 ครั้ง ข้อมูลวิ่งไปกลับยังไงบ้าง
          </p>
          <div className="mt-5 rounded-3xl border-2 border-brand bg-brand-light p-4">
            <p className="font-display text-lg font-bold text-brand-dark">
              📱 ฝั่งน้อง — Frontend (สิ่งที่เห็น + แตะได้)
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <FlowStep n={1} tone="brand">
                กดปุ่ม “โหวต” บนมือถือ
              </FlowStep>
              <FlowStep n={5} tone="brand">
                ผลรวมเด้งขึ้นจอ แบบสด ๆ 🎉
              </FlowStep>
            </div>
          </div>
          <div className="my-2 flex items-center justify-center gap-8 text-sm font-semibold text-ink/50">
            <span>⬇ ส่งข้อมูลผ่านเน็ต</span>
            <span>⬆ ส่งผลรวมกลับ</span>
          </div>
          <div className="rounded-3xl border-2 border-ink bg-ink/[0.04] p-4">
            <p className="font-display text-lg font-bold text-ink">
              💻 ฝั่งพี่ — Backend (สมองเบื้องหลัง บนโน้ตบุ๊ก)
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <FlowStep n={2} tone="ink">
                รับข้อมูลที่ส่งเข้ามา
              </FlowStep>
              <FlowStep n={3} tone="ink">
                นับคะแนน + เก็บไว้
              </FlowStep>
              <FlowStep n={4} tone="ink">
                ส่งผลรวมกลับไป
              </FlowStep>
            </div>
          </div>
          <p className="mt-4 text-center text-xl font-semibold text-accent text-balance">
            ⏱ ทั้งหมดนี้เกิดใน ~2 วินาที · ทุกเว็บ/แอปก็วน 5 สเต็ปนี้แหละ
          </p>
        </div>
      );

    case "fe-be-quiz":
      return (
        <ActivitySlide
          activityId="fe-be-quiz"
          kicker="เช็กความเข้าใจ ⚡"
          props={props}
          extra={
            <p className="mt-4 text-lg text-ink/50">
              ทายเล่น ๆ ก่อนเลย ไม่มีผิดถูก — เดี๋ยวพี่เฉลยปากเปล่า 😉
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
          <p className="mt-2 text-xl text-ink/60">
            ไต่ทีละขั้น — เป็น “แนวคิด” ยังไม่ต้องรู้ว่าใช้ภาษาอะไร
          </p>
          <div className="mt-5 grid items-start gap-6 lg:grid-cols-[1.7fr_1fr]">
            <div className="grid gap-2.5">
              {LADDER.map((step, i) => (
                <div
                  key={step.name}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 ${
                    step.highlight
                      ? "border-2 border-brand bg-brand-light"
                      : "bg-white shadow-sm ring-1 ring-black/5"
                  }`}
                >
                  <span className="w-7 shrink-0 text-center font-display text-xl font-bold text-ink/30">
                    {i + 1}
                  </span>
                  <span className="text-2xl">{step.emoji}</span>
                  <div className="min-w-0">
                    <p className="font-display text-lg font-bold text-ink">{step.name}</p>
                    <p className="text-sm text-ink/60">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <p className="text-center font-display font-bold text-ink">
                แผนเต็มของ TPA 📚
              </p>
              <QRCodeImg
                url={LINKS.webGuideline}
                size={168}
                href={LINKS.webGuideline}
              />
              <a
                href={LINKS.webGuideline}
                target="_blank"
                rel="noreferrer"
                className="max-w-full break-all text-center text-xs font-semibold text-brand underline decoration-brand/40 underline-offset-2"
              >
                web-guideline ↗
              </a>
              <p className="text-center text-sm text-ink/50">
                สแกน/กดดูรายละเอียดแต่ละขั้นแบบเต็ม ๆ
              </p>
            </div>
          </div>
        </div>
      );

    case "code-preview":
      return (
        <div>
          <Kicker>ของจริงมาแล้ว 👀</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink text-balance">
            เดี๋ยวพี่จะโชว์ “โค้ดจริง” ให้ดู 👀
          </h1>
          <p className="mt-2 text-xl text-ink/60">
            ดูเยอะ งง ๆ ไม่เป็นไรเลย — แค่อยากให้เห็นว่าโค้ดจริงแบ่งเป็น “ก้อน ๆ” แบบนี้
          </p>
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
            <pre className="overflow-x-auto rounded-2xl bg-ink p-5 text-left font-mono text-sm leading-relaxed text-white shadow-lg md:text-base">
              <code>
                <span className="text-sky-300">import</span>
                {" { useState } "}
                <span className="text-sky-300">from</span>{" "}
                <span className="text-green-300">&quot;react&quot;</span>
                {"  "}
                <span className="text-white/40">{"// ① นำเข้าเครื่องมือ"}</span>
                {"\n\n"}
                <span className="text-sky-300">function</span>{" "}
                <span className="text-yellow-200">VoteButton</span>() {"{"}
                {"  "}
                <span className="text-white/40">{"// ② ก้อนงาน"}</span>
                {"\n"}
                {"  "}
                <span className="text-sky-300">const</span> [count, setCount] ={" "}
                <span className="text-yellow-200">useState</span>(0)
                {"  "}
                <span className="text-white/40">{"// ③ จำค่า"}</span>
                {"\n\n"}
                {"  "}
                <span className="text-sky-300">return</span> (
                {"  "}
                <span className="text-white/40">{"// ④ สิ่งที่แสดงบนจอ"}</span>
                {"\n"}
                {'    <button onClick={เพิ่มค่า}>โหวต {count} ครั้ง</button>'}
                {"\n  )\n}"}
              </code>
            </pre>
            <div className="space-y-2.5">
              {[
                {
                  n: "①",
                  e: "📦",
                  t: "นำเข้าเครื่องมือ",
                  d: "หยิบของที่คนอื่นเขียนไว้มาใช้ ไม่ต้องทำเองหมด",
                },
                {
                  n: "②",
                  e: "🧩",
                  t: "ก้อนงาน (component)",
                  d: "งาน 1 ชิ้นที่ตั้งชื่อได้ เรียกใช้ซ้ำได้",
                },
                {
                  n: "③",
                  e: "🧠",
                  t: "ตรรกะ / จำค่า",
                  d: "เก็บข้อมูล + เงื่อนไข + วนซ้ำ",
                },
                {
                  n: "④",
                  e: "🎨",
                  t: "สิ่งที่แสดงบนจอ",
                  d: "ปุ่ม ข้อความ ที่คนเห็นและกดใช้",
                },
              ].map((x) => (
                <div
                  key={x.n}
                  className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-black/5"
                >
                  <span className="font-display text-2xl font-bold text-accent">
                    {x.n}
                  </span>
                  <span className="text-2xl">{x.e}</span>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-ink">{x.t}</p>
                    <p className="text-sm text-ink/60">{x.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-5 text-center text-xl font-semibold text-accent text-balance">
            ไม่ต้องอ่านออกทุกบรรทัด — จับโครงว่าแบ่งเป็นก้อน ๆ ก็พอ · เดี๋ยว AI ก็ช่วยได้ (สไลด์ถัดไป) →
          </p>
        </div>
      );

    case "ai-help":
      return (
        <div>
          <Kicker>Preparation · เตรียมตัว</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink text-balance">
            AI ช่วยงาน “เขียนโปรแกรม” ยุคนี้ได้เยอะมาก 🤖
          </h1>
          <p className="mt-2 text-xl text-ink/60">
            ไม่ได้มาแทนโปรแกรมเมอร์ — แต่มาเป็น “คู่หู” ที่ช่วยเร่งงาน
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { e: "💬", t: "อธิบาย & สอน", d: "ถามโค้ดที่ไม่เข้าใจ AI อธิบายให้ทีละบรรทัด" },
              { e: "✍️", t: "ช่วยร่างโค้ด", d: "บอกเป็นภาษาคน AI ร่างโค้ดให้เริ่มต้นได้" },
              { e: "🐛", t: "หา & แก้บั๊ก", d: "วาง error ให้ AI ช่วยไล่ว่าพลาดตรงไหน" },
              { e: "🧪", t: "งานซ้ำ ๆ", d: "เขียนเทสต์ / จัดระเบียบโค้ด / แปลงภาษา" },
              { e: "💡", t: "ระดมไอเดีย", d: "ช่วยคิดวิธีทำ + ออกแบบโครงสร้าง" },
              { e: "🚀", t: "เรียนไวขึ้น", d: "เหมือนมีติวเตอร์ส่วนตัวตอบ 24 ชม." },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <p className="text-3xl">{x.e}</p>
                <p className="mt-1 font-display text-lg font-bold text-ink">{x.t}</p>
                <p className="text-sm text-ink/60">{x.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-xl font-semibold text-accent text-balance">
            แต่ “คนสั่ง” ต้องรู้ว่าจะเอาอะไร + ตรวจได้ว่า AI ทำถูกไหม 👀
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

    case "ai-meme-debug":
      return (
        <ExploreImage
          kicker="AI · ผลลัพธ์จริง 😅"
          src="/ai-meme/1.jpg"
          alt="Before vs After ChatGPT — เจนโค้ดไว แต่ debug นานขึ้น"
          title="AI เขียนโค้ดไว… แต่ถ้าไม่เข้าใจ ก็ debug ยาว 😵"
          subtitle="เจน 5 นาที — แต่ตามแก้บั๊กเป็นวัน ถ้าไม่รู้ว่ามันเขียนอะไรลงไป"
          caption="Before: เขียนเอง 2 ชม. → After: AI เจน 5 นาที แต่ debug พุ่งจาก 6 เป็น 24 ชม.!"
          takeaway="AI ไม่ได้ทำให้ง่ายขึ้นเสมอ — ไม่มีพื้นฐาน อาจเสียเวลากว่าเดิม"
        />
      );

    case "ai-meme-vibe":
      return (
        <ExploreImage
          kicker="AI · ผลลัพธ์จริง 😅"
          src="/ai-meme/2.jpg"
          alt="Agile ต่อเติมทีละขั้น vs Vibe Coding กองสุมจนรก"
          title="สั่ง AI มั่ว ๆ ไม่มีโครง → ของรกไปเรื่อย ๆ 🚗💨"
          subtitle="Agile: ค่อย ๆ ต่อ ใช้ได้ทุกขั้น · Vibe Coding ไม่มีแบบแผน: สุมจนพัง"
          caption="Agile: สเก็ต → จักรยาน → มอไซค์ → รถ · Vibe Coding: กองสุมจนรถพัง"
          takeaway="อยากใช้ AI ให้ดี = ต้องมี “โครง” + คิดเป็นระบบ (เดี๋ยวดูวิธีที่พี่ใช้ →)"
        />
      );

    case "ai-behind":
      return (
        <div>
          <Kicker>เบื้องหลังแอปนี้ 🛠️</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink text-balance">
            แอปนี้ พี่สร้างด้วย AI ยังไง? · Context Engineering
          </h1>
          <p className="mt-2 text-lg text-ink/60">
            เคล็ดลับ = ป้อน “บริบท (context)” ที่ดีให้ AI ก่อน แล้วค่อยให้ลงมือ → ผลลัพธ์ดีขึ้นเยอะ
          </p>
          <div className="mt-4 space-y-2">
            {[
              {
                n: 1,
                e: "🔍",
                t: "Research โจทย์จริง",
                d: "อ่านเอกสารโครงการ เข้าใจว่างานนี้ต้องการอะไร ใครคือน้อง ๆ",
                tag: "≈ เก็บโจทย์ (Requirement)",
              },
              {
                n: 2,
                e: "📝",
                t: "สรุปเป็นแผนเป็นข้อ ๆ",
                d: "ย่อยเป็น plan/brief ให้ AI เห็นภาพรวมก่อนลงมือ",
                tag: "≈ ออกแบบ (Design)",
              },
              {
                n: 3,
                e: "📎",
                t: "เตรียม Reference",
                d: "เอาทอล์ก/เนื้อหาเดิมของพี่มาเป็นตัวอย่างให้ AI",
                tag: "≈ ให้บริบทเพิ่ม",
              },
              {
                n: 4,
                e: "⚡",
                t: "Vibe Coding ด้วย Claude Code",
                d: "สั่ง AI สร้างจริงทีละส่วน คุยไป–แก้ไป",
                tag: "≈ ลงมือสร้าง (Construction)",
              },
              {
                n: 5,
                e: "✅",
                t: "Evaluate จนพอใจ",
                d: "ตรวจ–แก้–วนซ้ำ (ต้องมีพื้นฐานถึงจะรู้ว่าดีไหม!)",
                tag: "≈ ตรวจ/ทดสอบ (Testing)",
              },
            ].map((x) => (
              <div
                key={x.n}
                className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-sm ring-1 ring-black/5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-display font-bold text-white">
                  {x.n}
                </span>
                <span className="text-2xl">{x.e}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold text-ink">{x.t}</p>
                  <p className="text-sm text-ink/60">{x.d}</p>
                </div>
                <span className="hidden shrink-0 rounded-full bg-brand-light px-3 py-1 text-sm font-semibold text-brand-dark md:inline">
                  {x.tag}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xl font-semibold text-accent text-balance">
            ใช้ AI เก่ง = เอา “การคิดเป็นระบบ” มาคุม AI — คือ แบ่งงานใหญ่เป็นขั้น ๆ ทีละส่วน
            (เหมือน “ขั้นตอนทำโปรเจกต์” + “แตกงานเป็นชิ้นเล็ก” ที่เห็นตอนต้นคาบ) 🎯
          </p>
        </div>
      );

    case "fundamentals":
      return (
        <div>
          <Kicker>Exploration · ค้นหา</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink text-balance">
            พื้นฐานที่ควรมี ก่อนไปสายเขียนโปรแกรม 🧰
          </h1>
          <p className="mt-2 text-xl text-ink/60">
            ไม่ต้องเก่งครบตอนนี้ — ค่อย ๆ สะสมได้ ที่สำคัญคือ “อยากลอง”
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                e: "🔤",
                t: "ภาษาอังกฤษ",
                d: "โค้ด เอกสาร และชุมชนส่วนใหญ่เป็นอังกฤษ — อ่านออกช่วยได้มาก",
              },
              {
                e: "➗",
                t: "คณิต & ตรรกะ",
                d: "คิดเป็นเหตุเป็นผล เข้าใจเงื่อนไข/ลำดับขั้นตอน",
              },
              {
                e: "🧩",
                t: "Problem Solving",
                d: "แตกปัญหาใหญ่เป็นชิ้นเล็ก แล้วแก้ทีละอัน",
              },
              {
                e: "🔎",
                t: "Critical Thinking",
                d: "ตั้งคำถาม ตรวจสอบ ไม่เชื่ออะไรทันที (ยิ่งยุค AI ยิ่งสำคัญ)",
              },
              {
                e: "🔨",
                t: "Be a Maker",
                d: "อยากรู้ว่า “ของนี้สร้างยังไง” แล้วลงมือแกะ/ลองทำ",
              },
              {
                e: "🌱",
                t: "ใฝ่เรียนรู้ตลอด",
                d: "เทคเปลี่ยนเร็ว — สนุกกับการอัปเดตตัวเองเรื่อย ๆ",
              },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <p className="text-3xl">{x.e}</p>
                <p className="mt-1 font-display text-lg font-bold text-ink">{x.t}</p>
                <p className="text-sm text-ink/60">{x.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-xl font-semibold text-accent text-balance">
            ข่าวดี: ทุกอย่างนี้ “ฝึกได้” + ยุคนี้มี AI เป็นติวเตอร์ช่วยเรียนด้วย 🚀
          </p>
        </div>
      );

    case "ai-jobs":
      return (
        <div>
          <Kicker>คำถามที่ต้องมีแน่ ๆ 🙋</Kicker>
          <h1 className="mt-1 font-display text-4xl font-bold text-ink text-balance">
            AI เก่งขนาดนี้… โปรแกรมเมอร์จะตกงานไหม? 🤔
          </h1>
          <p className="mt-2 text-lg text-ink/60">
            คำตอบสั้น ๆ: AI เปลี่ยน “วิธีทำงาน” ไม่ได้ลบอาชีพ — แต่เปลี่ยนว่า “ใครได้เปรียบ”
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border-2 border-black/10 bg-white p-5">
              <p className="font-display text-xl font-bold text-ink">
                🤖 AI ทำแทนได้ (บางส่วน)
              </p>
              <div className="mt-2 space-y-1.5 text-ink/70">
                <p>• งานโค้ดซ้ำ ๆ พื้นฐาน</p>
                <p>• ร่างโค้ดเริ่มต้น / งานจำเจ</p>
                <p>• ค้นข้อมูล เขียนเทสต์ ให้เร็วขึ้น</p>
              </div>
            </div>
            <div className="rounded-3xl border-2 border-brand bg-brand-light p-5">
              <p className="font-display text-xl font-bold text-ink">
                🧠 สิ่งที่ยังต้องใช้ “คน”
              </p>
              <div className="mt-2 space-y-1.5 text-ink/80">
                <p>• เข้าใจ “ปัญหา” + ความต้องการคนจริง</p>
                <p>• ออกแบบระบบ + ตัดสินใจ</p>
                <p>• ตรวจว่า AI ทำถูกไหม (ต้องมีพื้นฐาน!)</p>
                <p>• สื่อสารกับทีม + รับผิดชอบผลลัพธ์</p>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-3xl bg-ink p-5 text-white">
            <p className="font-display text-lg font-bold">แนวทางของน้อง 👉</p>
            <div className="mt-2 grid gap-x-6 gap-y-1.5 text-white/85 sm:grid-cols-2">
              <p>① พื้นฐานให้แน่น — ยิ่ง AI แรง ยิ่งต้องรู้ว่ามันทำถูกไหม</p>
              <p>② ฝึกใช้ AI เป็น “เครื่องมือ” ให้คล่อง</p>
              <p>③ เก่งเรื่องที่ AI แทนยาก: แก้ปัญหา · สื่อสาร · เข้าใจคน</p>
              <p>④ เรียนรู้ตลอด — เทคเปลี่ยนเร็ว ปรับตัวได้ก็รอด</p>
            </div>
          </div>
          <p className="mt-4 text-center text-xl font-semibold text-accent text-balance">
            อาชีพนี้ไม่หายไป แต่ “หน้าตางาน” เปลี่ยน — เตรียมพื้นฐาน + ใช้ AI เป็น = น้องได้เปรียบ 🚀
          </p>
        </div>
      );

    case "next-step":
      return (
        <div>
          <h1 className="font-display text-4xl font-bold text-ink">เก็บกลับบ้าน 🎒</h1>
          <p className="mt-1 text-lg text-ink/60">
            สแกน QR หรือ “กดที่ลิงก์ใต้ QR” ก็ได้ — เอาไปเล่นต่อที่บ้าน
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QRCard
              url={LINKS.webGuideline}
              title="เจาะ Web Dev ต่อ"
              sub="web-guideline"
            />
            <QRCard
              url={LINKS.career}
              title="สายอื่น ๆ (จากควิซ)"
              sub="TPA career roadmap"
            />
            <QRCard
              url={LINKS.repo}
              title="โค้ดแอปนี้ (ของพี่ป้อง)"
              sub="GitHub repo"
            />
            <QRCard url={LINKS.talk} title="ทอล์กพี่ป้อง 🎥" sub="YouTube playlist" />
          </div>
          <div className="mt-5 grid items-start gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-lg text-ink/80">• ทำควิซซ้ำที่บ้านได้ ลองหลายสาย</p>
              <p className="text-lg text-ink/80">
                • เปิดปุ่ม <span className="font-bold text-accent">Advanced 🔥</span> ถ้าอยากไปต่อ
              </p>
              <p className="text-lg text-ink/80">
                • โหลด <span className="font-bold text-ink">โค้ดแอปนี้</span> จาก GitHub ไปรัน/แกะดูเองได้เลย
              </p>
              <p className="text-lg text-ink/80">
                • ดูทอล์กเต็ม ๆ ของพี่ป้องได้ที่ QR{" "}
                <span className="font-bold text-accent">“ทอล์กพี่ป้อง 🎥”</span> ด้านบน
              </p>
            </div>
            <p className="font-display text-3xl font-bold text-brand md:self-center md:text-right">
              ขอบคุณที่มาเล่นด้วยกันวันนี้! 🎉
            </p>
          </div>
        </div>
      );

    default:
      return <div>ไม่พบสไลด์</div>;
  }
}
