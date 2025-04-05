import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import React, { useState } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  images?: string[];
  demoLink?: string;
  codeLink?: string;
  techStack?: string[];
  onClick?: () => void;
}

export function ThreeDCardDemo({ title, description, image, demoLink, codeLink, techStack, onClick }: ProjectCardProps) {
  // Add state to track if description is expanded
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle description expansion
  const toggleDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <CardContainer className="inter-var h-auto w-full sm:w-[400px] sm:h-[490px] mx-auto z-50">
      <CardBody 
        className="bg-gray-20 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] 
                  dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto 
                  sm:w-[490px] sm:h-[500px] rounded-xl p-4 sm:p-6 border flex flex-col" 
        onClick={onClick}
      >
        {/* The entire card is now clickable */}
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          {title}
        </CardItem>
        
        {/* Description with See More button */}
        <CardItem
          as="div"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <p className={isExpanded ? "" : "line-clamp-2"}>
            {description}
          </p>
          <button 
            className="text-xs text-blue-500 hover:text-blue-700 font-medium mt-1 focus:outline-none transition-colors"
            onClick={toggleDescription}
          >
            {isExpanded ? "See less" : "See more"}
          </button>
        </CardItem>
        
        <CardItem
          translateZ="100"
          rotateX={20}
          rotateZ={-10}
          className="w-full mt-4 flex-grow"
        >
          <img
            src={image}
            className="h-40 sm:h-52 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt={title}
          />
        </CardItem>
        
        {/* Links Section */}
        <CardItem
          translateZ="80"
          className="flex gap-4 mt-4 w-full"
          onClick={(e: React.MouseEvent) => e.stopPropagation()} // Fixed: properly typed event parameter
        >
          {demoLink && (
            <a 
              href={demoLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
              onClick={(e: React.MouseEvent) => e.stopPropagation()} // Fixed: properly typed event parameter
            >
              Live Demo →
            </a>
          )}
          {codeLink && (
            codeLink === "NDA" ? (
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                under non-disclosure agreement
              </span>
            ) : (
              <a 
                href={codeLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm font-medium transition-colors"
                onClick={(e: React.MouseEvent) => e.stopPropagation()} // Fixed: properly typed event parameter
              >
                Source Code →
              </a>
            )
          )}
        </CardItem>
        
        {/* Tech Stack Section - Now at the bottom */}
        {techStack && techStack.length > 0 && (
          <CardItem
            translateZ="70"
            className="mt-auto pt-3 flex flex-wrap items-center border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mr-2">Built with:</p>
            <div className="flex flex-row flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <img 
                  key={index} 
                  src={tech} 
                  alt="Tech" 
                  className="h-5 w-5 object-contain" 
                  title={tech.split('/').pop()?.split('.')[0]}
                />
              ))}
            </div>
          </CardItem>
        )}
      </CardBody>
    </CardContainer>
  );
}
