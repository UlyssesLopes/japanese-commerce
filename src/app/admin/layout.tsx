import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Backoffice", template: "%s · Backoffice ZIVORA" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="text-[0.9375rem] leading-normal">{children}</div>;
}
