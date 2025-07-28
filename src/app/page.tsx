import HeroSlider from '@/components/home/HeroSlider';
import Categories from '@/components/home/Categories';
import BestSellersSlider from '@/components/home/BestSellersSlider';
import MeatSection from '@/components/home/MeatSection';
import FruitsVegetablesSection from '@/components/home/FruitsVegetablesSection';
import CleaningSection from '@/components/home/CleaningSection';
import HomeEssentialsSection from '@/components/home/HomeEssentialsSection';
import ElmaliProductsSection from '@/components/home/ElmaliProductsSection';
import BabySection from '@/components/home/BabySection';
import CosmeticsSection from '@/components/home/CosmeticsSection';
import ElectronicsSection from '@/components/home/ElectronicsSection';
import MarketingBanners from '@/components/home/MarketingBanners';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-6">
        <HeroSlider />
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-8">
        <Categories />
      </section>

      {/* Best Sellers Section */}
      <BestSellersSlider />

      {/* Meat Section */}
      <MeatSection />

      {/* Fruits & Vegetables Section */}
      <FruitsVegetablesSection />

      {/* Cleaning Section */}
      <CleaningSection />

      {/* Home Essentials Section */}
      <HomeEssentialsSection />

      {/* Elmali Products Section */}
      <ElmaliProductsSection />

      {/* Baby Section */}
      <BabySection />

      {/* Cosmetics Section */}
      <CosmeticsSection />

      {/* Electronics Section */}
      <ElectronicsSection />

      {/* Marketing Banners - Footer Üstü */}
      <MarketingBanners />
    </div>
  );
}