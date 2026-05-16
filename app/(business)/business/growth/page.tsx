import BusinessBottomNav from "@/components/BusinessBottomNav";
import BusinessSidebar from "@/components/BusinessSidebar";
import EcosystemHub from "@/components/EcosystemHub";

export default function BusinessGrowthPage() {
  return (
    <>
      <BusinessSidebar name="Business" />
      <EcosystemHub mode="business" />
      <BusinessBottomNav />
    </>
  );
}
