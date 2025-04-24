import { useState } from 'react';
import { X } from 'lucide-react';

// Define types for our award and certificate items
export type CertificateItem = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image?: string;
}

interface CertsProps {
  items: CertificateItem[];
  itemType: 'award' | 'certificate';
  bgPath: string;
  svgStyle: {
    filter: string;
    opacity: number;
    mixBlendMode: 'multiply' | 'soft-light';
  };
  isDark: boolean;
}

export function Certs({ items, itemType, bgPath, svgStyle, isDark }: CertsProps) {
  const [selectedItem, setSelectedItem] = useState<CertificateItem | null>(null);

  const handleItemClick = (item: CertificateItem) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  // Function to extract month and year from date string
  const formatDate = (dateStr: string | undefined) => {
    // Check if dateStr is undefined or null
    if (!dateStr) {
      return { month: '', year: '' };
    }
    
    // Expecting format like "June 2024" or "December 2024"
    const parts = dateStr.split(' ');
    if (parts.length === 2) {
      const month = parts[0];
      const year = parts[1];
      return { month, year };
    }
    return { month: '', year: dateStr }; // fallback
  };

  const gridCols = itemType === 'award' 
    ? "grid-cols-1 md:grid-cols-3" 
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  return (
    <>
      <div className={`grid ${gridCols} gap-${itemType === 'award' ? '8' : '6'}`}>
        {items.map((item) => (
          <div 
            key={item.id} 
            className="relative cursor-pointer  transition-shadow duration-300"
            onClick={() => handleItemClick(item)}
          >
            <div className={`relative pt-${itemType === 'award' ? '8' : '6'} mt-${itemType === 'award' ? '6' : '4'} h-full rounded-${itemType === 'award' ? 'xl' : 'lg'} overflow-hidden`}>
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={bgPath}
                  alt={`${itemType} background`}
                  className="w-full h-full"
                  style={svgStyle}
                />
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="pb-2 text-center">
                <div className={`${isDark ? 'text-dark-secondary' : 'text-muted-foreground'}`}>
                <h2 className="text-5xl font-medium">{formatDate(item.date).year}</h2>
                <span className="block text-xs">{formatDate(item.date).month}</span>
                    </div>
                  <h3 className={`text-${itemType === 'award' ? 'xl' : 'lg'} font-bold ${isDark ? 'text-dark-primary' : 'text-foreground'}`}>
                    {item.title}
                  </h3>
                  <div className={`mt-${itemType === 'award' ? '1.5' : '1'}`}>
                    <span className="block">{item.issuer}</span>
                   
                  </div>
                </div>
               
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for displaying the image */}
      {selectedItem && selectedItem.image && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={closeModal}>
          <div className="relative bg-white dark:bg-gray-800 p-2 rounded-lg max-w-3xl w-11/12 max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 rounded-full p-1"
              onClick={closeModal}
            >
              <X size={20} />
            </button>
            <div className="p-3">
              <h3 className="text-xl font-bold mb-2">{selectedItem.title}</h3>
              <div className="overflow-auto max-h-[70vh]">
                <img 
                  src={selectedItem.image} 
                  alt={`${selectedItem.title} ${itemType}`}
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
