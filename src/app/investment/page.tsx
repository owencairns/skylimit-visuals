import IntroSection from './components/IntroSection';
import PackagesSection from './components/PackagesSection';
import AddOnsSection from './components/AddOnsSection';

export default function InvestmentPage() {
  return (
    <main className="pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <IntroSection />
        <PackagesSection />
        <AddOnsSection />
      </div>
    </main>
  );
}
