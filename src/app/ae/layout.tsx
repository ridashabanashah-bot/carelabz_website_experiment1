import type { ReactNode } from "react";

export default function AELayout({ children }: { children: ReactNode }) {
  return <div className="font-sans">{children}</div>;
}
