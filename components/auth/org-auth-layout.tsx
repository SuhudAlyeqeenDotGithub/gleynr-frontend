import type { ReactNode } from "react";
import { Logo } from "@/components/general/Logo";

export function OrgAuthLayout({
  title,
  subtitle,
  children,
  cardColCount = 1,
  error,
}: {
  error?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  cardColCount?: 1 | 2;
}) {
  return (
    <main className="auth-page">
      <section
        className={`auth-card ${cardColCount === 2 ? "org-auth-card" : ""}`}
      >
        <div className="auth-logo">
          <Logo dark={false} />
        </div>
        <h1>{title}</h1>
        <p className="auth-sub">{subtitle}</p>
        {error && <div className="form-error mb-2">{error}</div>}
        {children}
      </section>
    </main>
  );
}
