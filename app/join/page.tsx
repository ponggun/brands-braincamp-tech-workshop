import { JoinApp } from "@/components/join/JoinApp";
import { StaticJoin } from "@/components/join/StaticJoin";

export default function JoinPage() {
  const staticMode = process.env.NEXT_PUBLIC_STATIC_MODE === "1";
  return staticMode ? <StaticJoin /> : <JoinApp />;
}
