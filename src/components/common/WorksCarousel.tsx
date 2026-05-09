import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  id: number;
  title: string;
  image: string;
  demoLink: string;
  tag: string;
}

interface WorksCarouselProps {
  projects: Project[];
}

const WorksCarousel: React.FC<WorksCarouselProps> = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Select 5 random projects for the carousel
  const [carouselProjects, setCarouselProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (projects.length > 0) {
      const shuffled = [...projects].sort(() => Math.random() - 0.5);
      setCarouselProjects(shuffled.slice(0, Math.min(5, projects.length)));
      return;
    }

    setCarouselProjects([]);
    setCurrentIndex(0);
  }, [projects]);

  useEffect(() => {
    if (carouselProjects.length === 0) return;
    if (currentIndex >= carouselProjects.length) {
      setCurrentIndex(0);
    }
  }, [carouselProjects.length, currentIndex]);

  // Auto-play carousel
  useEffect(() => {
    if (carouselProjects.length === 0) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselProjects.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [carouselProjects.length]);

  const slideVariants = {
    hiddenRight: {
      x: "100%",
      opacity: 0,
    },
    hiddenLeft: {
      x: "-100%",
      opacity: 0,
    },
    visible: {
      x: "0",
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselProjects.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselProjects.length - 1 : prevIndex - 1,
    );
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleImageClick = () => {
    if (carouselProjects[currentIndex]?.demoLink) {
      const link = carouselProjects[currentIndex].demoLink;
      if (link !== "N/A" && link !== "NDA") {
        window.open(link, "_blank");
      }
    }
  };

  if (carouselProjects.length === 0) return null;

  const currentProject = carouselProjects[currentIndex];

  if (!currentProject) return null;

  return (
    <div className="w-screen relative left-[50%] right-[50%] -mx-[50vw] mb-12">
      <div className="relative w-full overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        {/* Carousel Container */}
        <div className="relative aspect-video w-full">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial={direction > 0 ? "hiddenRight" : "hiddenLeft"}
              animate="visible"
              exit="exit"
              className="absolute inset-0"
            >
              <div
                className="relative w-full h-full cursor-pointer group"
                onClick={handleImageClick}
              >
                <img
                  src={currentProject.image}
                  alt={currentProject.title}
                  className="w-full h-full object-cover"
                />

                {/* Overlay with project info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="inline-block px-3 py-1 bg-blue-500 rounded-full text-xs font-semibold mb-2">
                      {currentProject.tag}
                    </span>
                    <h3 className="text-2xl font-bold mb-2">
                      {currentProject.title}
                    </h3>
                    {currentProject.demoLink !== "N/A" &&
                      currentProject.demoLink !== "NDA" && (
                        <p className="text-sm opacity-90">
                          Click to view demo →
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 p-2 rounded-full shadow-lg transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 p-2 rounded-full shadow-lg transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 py-4 bg-white/50 dark:bg-gray-900/50">
          {carouselProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-8 h-3 bg-blue-500"
                  : "w-3 h-3 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorksCarousel;
