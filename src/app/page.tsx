import HeroBanner from '@/components/home/HeroBanner';
import Categories from '@/components/home/Categories';
import ProductGrid from '@/components/home/ProductGrid';
import FreshProducts from '@/components/home/FreshProducts';
import MeatProducts from '@/components/home/MeatProducts';
import DelicatessenProducts from '@/components/home/DelicatessenProducts';
import DailyDeals from '@/components/home/DailyDeals';
import AppDownload from '@/components/home/AppDownload';

import Navigation from '@/components/layout/Navigation';

export default function Home() {
  return (
    <div className="current-page-default-entry">
      {/* Hero Section with Sidebar */}
      <div className="row" style={{marginBottom: '2rem'}}>
        <div className="col-auto">
          <div className="allcategory-wrapper">
            <Navigation />
          </div>
        </div>
        
        <div className="col">
          <div id="entry-slider">
            <HeroBanner />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="row">
        <div className="col">
          <div className="category-wrap-area">
            <Categories />
          </div>
          
          <div className="tabbed-midblocks-container">
            <ProductGrid />
          </div>
          
          <div className="mid-blocks-wrapper">
            <FreshProducts />
            <MeatProducts />
            <DelicatessenProducts />
          </div>
          
          <DailyDeals />
          <AppDownload />
        </div>
      </div>
    </div>
  );
}