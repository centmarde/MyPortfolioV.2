import React, { useState, useEffect } from 'react';

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  title: string;
}

const ImageDialog: React.FC<ImageDialogProps> = ({ isOpen, onClose, images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset to first image when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col" onClick={onClose}>
      <div 
        className="w-full h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 bg-black">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white text-sm p-1.5 ml-auto inline-flex items-center"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
        
        <div className="relative flex-grow flex items-center justify-center bg-black">
          <div className="flex-grow flex justify-center items-center h-full">
            <img 
              src={images[currentIndex]} 
              alt={`${title} - image ${currentIndex + 1}`} 
              className="max-h-[calc(100vh-140px)] max-w-[95vw] object-contain mx-auto select-none"
              style={{ 
                objectFit: 'contain',
                transition: 'transform 0.3s ease-in-out' 
              }}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
          
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 text-white focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Previous image"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 text-white focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Next image"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </>
          )}
        </div>
        
        {images.length > 1 && (
          <div className="p-4 flex justify-center gap-3 bg-black">
            {images.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-600'}`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDialog;
