import HeroSlider from "@/components/home/HeroSlider";
import PropertySearch from "@/components/home/PropertySearch";
import LocationMarquee from "@/components/home/LocationMarquee";
import BackgroundStars from "@/components/home/BackgroundStars";
import WhoWeAre from "@/components/home/WhoWeAre";
import PropertyTypes from "@/components/home/PropertyTypes";
import LatestProjects from "@/components/home/LatestProjects";
import DeveloperSpotlight from "@/components/home/DeveloperSpotlight";
import BankMarquee from "@/components/home/BankMarquee";
import MortgageBanner from "@/components/home/MortgageBanner";
import BrandedResidences from "@/components/home/BrandedResidences";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import YoutubeSection from "@/components/home/YoutubeSection";
import TrustMarquee from "@/components/home/TrustMarquee";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Background ambient lighting — single upper-right light source system */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary gold orb — upper-right, the main implied light source */}
        <div
          className="absolute"
          style={{
            top: '6%', right: '-8%',
            width: '42%', height: '600px',
            background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.07) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Secondary cold-blue fill — mid-left, shadow fill for 3D dimension */}
        <div
          className="absolute"
          style={{
            top: '35%', left: '-12%',
            width: '38%', height: '700px',
            background: 'radial-gradient(ellipse at center, rgba(30,50,120,0.18) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        {/* Tertiary gold bounce — bottom-center, ground bounce from light source */}
        <div
          className="absolute"
          style={{
            bottom: '5%', left: '30%',
            width: '40%', height: '400px',
            background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.04) 0%, transparent 65%)',
            filter: 'blur(90px)',
          }}
        />

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
        <BankMarquee />
        <MortgageBanner />
        <BrandedResidences />
        <FeaturedProjects />
        <YoutubeSection />
        <TrustMarquee />
      </div>
    </div>
  );
}
