import { MobileScreen } from './MobileScreen';

interface FeatureSectionProps {
  title: string;
  screens: Array<{
    content?: React.ReactNode;
    imageUrl?: string;
  }>;
}

export function FeatureSection({ title, screens }: FeatureSectionProps) {
  return (
    <div className="flex items-start gap-8 mb-12">
      <div className="w-32 flex-shrink-0 text-white text-sm pt-2">
        {title}
      </div>
      <div className="flex gap-4 flex-wrap">
        {screens.map((screen, index) => (
          <MobileScreen 
            key={index}
            imageUrl={screen.imageUrl}
            content={screen.content}
          />
        ))}
      </div>
    </div>
  );
}
