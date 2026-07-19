import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div className="animate-float text-6xl">🎮</div>
      <div>
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-accent">
          BRAND&apos;S Brain Camp 2026
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
          Tech &amp; AI Playground
        </h1>
        <p className="mt-3 text-lg text-ink/70">ลองเป็นคนสายเทคใน 60 นาที</p>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        <Link
          href="/present"
          className="tap-target flex flex-col items-center justify-center gap-1 rounded-3xl bg-ink px-6 py-8 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-ink/90"
        >
          <span className="text-3xl">🖥️</span>
          <span className="font-display text-xl font-bold">จอพี่ (Presenter)</span>
          <span className="text-sm text-white/70">คุมสไลด์ + เปิดกิจกรรม + ดูผลสด</span>
        </Link>
        <Link
          href="/join"
          className="tap-target flex flex-col items-center justify-center gap-1 rounded-3xl bg-brand px-6 py-8 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          <span className="text-3xl">📱</span>
          <span className="font-display text-xl font-bold">จอน้อง (Join)</span>
          <span className="text-sm text-white/80">สแกน QR แล้วมาที่หน้านี้</span>
        </Link>
      </div>

      <p className="max-w-md text-sm text-ink/50">
        ระบบไม่เก็บชื่อหรือข้อมูลส่วนตัวของน้อง — ใช้รหัสสุ่มแบบไม่ระบุตัวตน (PDPA)
      </p>
    </main>
  );
}
