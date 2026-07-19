"use client";

export function JoinShell({
  children,
  reconnecting,
}: {
  children: React.ReactNode;
  reconnecting?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3">
          <span className="font-display text-sm font-bold text-ink">
            🎮 Tech &amp; AI Playground
          </span>
          <span
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              reconnecting ? "bg-amber-400" : "bg-brand"
            }`}
            title={reconnecting ? "กำลังเชื่อมต่อใหม่" : "เชื่อมต่ออยู่"}
          />
        </div>
      </header>
      <main className="mx-auto max-w-md px-5 py-6">{children}</main>
    </div>
  );
}
