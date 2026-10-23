import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { TransformerSection } from '../components/TransformerSection';
import { IntentLockSection } from '../components/IntentLockSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { CallToActionSection } from '../components/CallToActionSection';

export function HomePage() {
  const navigate = useNavigate();

  const scrollToTransformer = () => {
    navigate('/transformer');
  };

  const scrollToIntentLock = () => {
    navigate('/intentlock');
  };

  return (
    <>
      <HeroSection
        onTransformClick={scrollToTransformer}
        onExploreIntentLockClick={scrollToIntentLock}
      />
      <TransformerSection />
      <IntentLockSection />
      <HowItWorksSection />
      <CallToActionSection
        onScrollToTransformer={scrollToTransformer}
        onScrollToIntentLock={scrollToIntentLock}
      />
    </>
  );
}
