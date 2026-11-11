import type { ReactNode } from "react";
import { Logo } from "@/components/general/Logo";

export function OrgAuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="auth-page">
      <section className="auth-card org-auth-card">
        <div className="auth-logo">
          <Logo dark={false} />
        </div>
        <h1>{title}</h1>
        <p className="auth-sub">{subtitle}</p>
        {children}
      </section>
    </main>
  );
}
