import HeroSlider from "@/components/home/HeroSlider";
import PropertySearch from "@/components/home/PropertySearch";
import WhoWeAre from "@/components/home/WhoWeAre";
import PropertyTypes from "@/components/home/PropertyTypes";
import LatestProjects from "@/components/home/LatestProjects";
import DeveloperSpotlight from "@/components/home/DeveloperSpotlight";
import MortgageBanner from "@/components/home/MortgageBanner";
import BrandedResidences from "@/components/home/BrandedResidences";
import FeaturedProjects from "@/components/home/FeaturedProjects";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <PropertySearch />
      <WhoWeAre />
      <PropertyTypes />
      <LatestProjects />
      <DeveloperSpotlight />
      <MortgageBanner />
      <BrandedResidences />
      <FeaturedProjects />
    </>
  );
}
