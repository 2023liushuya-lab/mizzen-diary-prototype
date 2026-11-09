import type { ReactNode } from "react";
import { StudyShell } from "@/components/diary/shell";
export default function Layout({ children }: { children: ReactNode }) {
  return <StudyShell>{children}</StudyShell>;
}
