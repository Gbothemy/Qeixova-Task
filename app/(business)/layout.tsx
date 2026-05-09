import BusinessBottomNav from "@/components/BusinessBottomNav";

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      {children}
      <BusinessBottomNav />
    </div>
  );
}
