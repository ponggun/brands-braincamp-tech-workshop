"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function QRCodeImg({
  url,
  size = 240,
  href,
}: {
  url: string;
  size?: number;
  href?: string; // ถ้าใส่ = ทำให้ QR กดเปิดลิงก์ได้ (เผื่อสแกนไม่สะดวก)
}) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let alive = true;
    if (!url) {
      setSrc("");
      return;
    }
    QRCode.toDataURL(url, { width: size, margin: 1, errorCorrectionLevel: "M" })
      .then((d) => {
        if (alive) setSrc(d);
      })
      .catch(() => {
        if (alive) setSrc("");
      });
    return () => {
      alive = false;
    };
  }, [url, size]);

  const inner = !src ? (
    <div
      style={{ width: size, height: size }}
      className="grid place-items-center rounded-2xl border-2 border-dashed border-black/15 text-ink/30"
    >
      QR
    </div>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={size}
      height={size}
      alt="QR code"
      className="rounded-2xl bg-white"
    />
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="no-tap-highlight inline-block"
        title={href}
      >
        {inner}
      </a>
    );
  }
  return inner;
}
