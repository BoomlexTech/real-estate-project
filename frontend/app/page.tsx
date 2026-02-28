import HeroSlider from "@/components/home/HeroSlider";
import PropertySearch from "@/components/home/PropertySearch";
import LocationMarquee from "@/components/home/LocationMarquee";
import BackgroundStars from "@/components/home/BackgroundStars";
import WhoWeAre from "@/components/home/WhoWeAre";
import PropertyTypes from "@/components/home/PropertyTypes";
import LatestProjects from "@/components/home/LatestProjects";
import DeveloperSpotlight from "@/components/home/DeveloperSpotlight";
import MortgageBanner from "@/components/home/MortgageBanner";
import BrandedResidences from "@/components/home/BrandedResidences";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import YoutubeSection from "@/components/home/YoutubeSection";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-right subtle gold glow — moved lower to avoid hero overlap */}
        <div className="absolute top-[35%] right-[-10%] w-[40%] h-125 rounded-full blur-[160px] opacity-[0.025]" style={{ background: 'var(--gold)' }} />
        {/* Mid-left deep navy glow */}
        <div className="absolute top-[30%] left-[-15%] w-[45%] h-[800px] rounded-full blur-[150px] opacity-[0.6]" style={{ background: '#0a101f' }} />
        {/* Bottom-right warm glow */}
        <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[700px] rounded-full blur-[120px] opacity-[0.03]" style={{ background: 'var(--gold)' }} />
        {/* Bottom-left deep navy glow */}
        <div className="absolute bottom-[-5%] left-[-10%] w-[50%] h-[600px] rounded-full blur-[130px] opacity-[0.4]" style={{ background: '#0c1222' }} />

        {/* Subtle, faintly glowing stars */}
        <BackgroundStars />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full bg-transparent">
        <HeroSlider />
        <PropertySearch />
        <LocationMarquee />
        <PropertyTypes />
        <WhoWeAre />
        <LatestProjects />
        <DeveloperSpotlight />
        <MortgageBanner />
        <BrandedResidences />
        <FeaturedProjects />
        <YoutubeSection />
      </div>
    </div>
  );
}
