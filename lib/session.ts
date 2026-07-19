// anonymous session id ฝั่ง client — ไม่มีข้อมูลส่วนตัว (PDPA)
"use client";

const KEY = "bbc_sid";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = window.localStorage.getItem(KEY);
  if (!sid) {
    sid =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
    window.localStorage.setItem(KEY, sid);
  }
  return sid;
}
