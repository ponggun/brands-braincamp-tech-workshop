// แถบผลลัพธ์ (ใช้ทั้งฝั่ง presenter และหน้าผลของน้อง)
export function ResultBar({
  label,
  emoji,
  count,
  total,
  color = "#00A651",
  highlight = false,
}: {
  label: string;
  emoji?: string;
  count: number;
  total: number;
  color?: string;
  highlight?: boolean;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className={highlight ? "rounded-xl bg-black/[0.03] p-2" : ""}>
      <div className="mb-1 flex items-center justify-between gap-2 text-sm">
        <span className="flex min-w-0 items-center gap-1.5 font-medium text-ink">
          {emoji && <span className="shrink-0">{emoji}</span>}
          <span className="truncate">{label}</span>
        </span>
        <span className="shrink-0 tabular-nums text-ink/60">
          {count} คน · {pct}%
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-black/[0.06]">
        <div
          className="h-full origin-left animate-grow-bar rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
