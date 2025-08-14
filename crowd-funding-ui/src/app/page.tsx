import FeaturedCampaignsSection from "@/sections/FeaturedCampaignsSection";
import HeroSection from "@/sections/HeroSection";

export default function HomePage() {
  return (
    <section className="flex size-full flex-col gap-5">
      {/* Hero section */}
      <HeroSection />
      {/* Features section */}
      <FeaturedCampaignsSection />
    </section>
  );
}
