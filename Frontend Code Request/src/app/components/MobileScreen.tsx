import { ImageWithFallback } from './figma/ImageWithFallback';

interface MobileScreenProps {
  imageUrl?: string;
  content?: React.ReactNode;
  className?: string;
}

export function MobileScreen({ imageUrl, content, className = '' }: MobileScreenProps) {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`} 
         style={{ width: '80px', height: '160px' }}>
      {imageUrl ? (
        <ImageWithFallback 
          src={imageUrl} 
          alt="Screen mockup"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-white p-2 flex flex-col">
          {content}
        </div>
      )}
    </div>
  );
}
