import HeroSection from '@/components/ui/HeroSection';
import FeaturesSection from '@/components/ui/FeaturesSection';
import FeaturedProducts from '@/components/product/FeaturedProducts';
import CategoriesGrid from '@/components/ui/CategoriesGrid';
import CTASection from '@/components/ui/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <FeaturedProducts />
      <CategoriesGrid />
      <CTASection />
    </div>
  );
}
