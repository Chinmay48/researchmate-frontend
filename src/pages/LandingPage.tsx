import HeroSection from "../components/landing/HeroSection";

import HowItWorksSection from "../components/landing/HowItWorksSection";
import ProductPreviewSection from "../components/landing/ProductPreviewSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";
import FeaturesSection from "../components/landing/FeaturesSection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection/>
      <HowItWorksSection />
      <ProductPreviewSection />
      <CTASection />
      <Footer />
    </>
  );
}