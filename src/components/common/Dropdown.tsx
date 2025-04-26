import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface ScrollDownProps {
  color?: string;
  onClick?: () => void;
  size?: number;
  showText?: boolean;
  techStack?: { src: string; alt: string }[];
}

const ScrollDownContainer = styled.div<{ color: string; size: number }>`
  --color: ${props => props.color};
  --sizeX: ${props => props.size}px;
  --sizeY: ${props => props.size * 1.667}px;
  position: relative;
  width: var(--sizeX);
  height: var(--sizeY);
  margin-left: calc(var(--sizeX) / 2);
  border: calc(var(--sizeX) / 10) solid var(--color);
  border-radius: 50px;
  box-sizing: border-box;
  margin-bottom: 16px;
  cursor: pointer;
  
  &::before {
    content: "";
    position: absolute;
    bottom: 30px;
    left: 50%;
    width: calc(var(--sizeX) / 5);
    height: calc(var(--sizeX) / 5);
    margin-left: calc(var(--sizeX) / -10);
    background-color: var(--color);
    border-radius: 100%;
    animation: scrolldown-anim 2s infinite;
    box-sizing: border-box;
    box-shadow: 0px -5px 3px 1px #2a547066;
  }
  
  @keyframes scrolldown-anim {
    0% {
      opacity: 0;
      height: calc(var(--sizeX) / 5);
    }
    40% {
      opacity: 1;
      height: calc(var(--sizeX) / 3);
    }
    80% {
      transform: translate(0, 20px);
      height: calc(var(--sizeX) / 3);
      opacity: 0;
    }
    100% {
      height: calc(var(--sizeX) / 10);
      opacity: 0;
    }
  }
`;

const Chevrons = styled.div<{ size: number }>`
  padding: 6px 0 0 0;
  margin-left: -3px;
  margin-top: ${props => props.size * 1.6}px;
  width: ${props => props.size}px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChevronDown = styled(motion.div)<{ color: string; size: number }>`
  margin-top: -6px;
  position: relative;
  border: solid ${props => props.color};
  border-width: 0 ${props => props.size / 10}px ${props => props.size / 10}px 0;
  display: inline-block;
  width: ${props => props.size / 3}px;
  height: ${props => props.size / 3}px;
  transform: rotate(45deg);
`;

const ScrollText = styled(motion.div)<{ color: string }>`
  color: ${props => props.color};
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-top: 12px;
  margin-left: 20px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: sans-serif;
`;

const TechStackContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 10px; // Further reduced gap
  margin-bottom: 8px; // Smaller margin
  max-width: 220px; // Even narrower
  margin: 0 auto 8px auto;
`;

const TechItem = styled(motion.div)`
  width: 24px; // Even smaller size
  height: 24px; // Even smaller size
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TechImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const Title = styled(motion.div)<{ color: string }>`
  color: ${props => props.color};
  font-size: 36px; // Further reduced font size
  text-align: center;
  margin-bottom: 5px; // Smaller margin
  font-family: "Metal Mania", system-ui;
  font-weight: 400;
  font-style: normal;
  margin-left: 0; // Remove left margin
`;

const BuiltWith = styled(motion.div)<{ color: string }>`
  color: ${props => props.color};
  font-size: 10px; // Smaller font
  text-align: center;
  margin-bottom: 6px;
  font-family: sans-serif;
  opacity: 0.8;
  letter-spacing: 0.8px;
`;

const ScrollDown: React.FC<ScrollDownProps> = ({ 
  color = 'skyblue', 
  onClick, 
  size = 22, // Even smaller default size
  showText = true, 
  techStack = [
    { src: '/logo/React.png', alt: 'React' },
    { src: '/logo/three.png', alt: 'Three' },
    { src: '/logo/Tailwind CSS.png', alt: 'tailwind' },
    { src: '/logo/typescript.png', alt: 'typescript' },
  ] 
}) => {
  // Create tech names for "Built With" text
  const techNames = techStack.map(tech => tech.alt).join(' · ');
  
  return (
    <div className="flex flex-col items-center">
      <Title 
        color={color}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        THE APEX PREDATOR
      </Title>
      
      <BuiltWith
        color={color}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        BUILT WITH: {techNames}
      </BuiltWith>
      
      {techStack.length > 0 && (
        <TechStackContainer
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {techStack.map((tech, index) => (
            <TechItem 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.2 }}
            >
              <TechImage src={tech.src} alt={tech.alt} />
            </TechItem>
          ))}
        </TechStackContainer>
      )}
      
      <ScrollDownContainer color={color} size={size} onClick={onClick}>
        <Chevrons size={size}>
          <ChevronDown 
            color={color}
            size={size}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              repeatType: 'loop',
              ease: 'easeInOut' 
            }}
          />
          <ChevronDown 
            color={color}
            size={size}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              repeatType: 'loop',
              ease: 'easeInOut',
              delay: 0.25
            }}
          />
        </Chevrons>
      </ScrollDownContainer>
      
      {showText && (
        <ScrollText 
          color={color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ fontSize: '12px', marginTop: '8px' }} // Smaller text
        >
          Scroll Down
        </ScrollText>
      )}
    </div>
  );
};

export const ScrollReminder: React.FC<{
  threshold?: number;
  color?: string;
  size?: number;
  hideAfter?: number;
  onReturn?: boolean;
  showText?: boolean;
}> = ({ 
  threshold = 100, 
  color = 'skyblue', 
  size = 22, // Even smaller size
  hideAfter = 5000,
  onReturn = false,
  showText = true
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      // Hide when scrolled past threshold
      if (window.scrollY > threshold) {
        setVisible(false);
      } else if (onReturn && window.scrollY < threshold) {
        // Show when returning to top (if onReturn is true)
        setVisible(true);
      }
    };
    
    // Auto-hide after specified duration
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, hideAfter);
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(hideTimer);
    };
  }, [threshold, hideAfter, onReturn]);
  
  const handleClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };
  
  return visible ? (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ pointerEvents: 'auto' }}
    >
      <ScrollDown 
        color={color} 
        onClick={handleClick}
        size={size}
        showText={showText}
        techStack={[
          { src: '/logo/React.png', alt: 'React' },
          { src: '/logo/three.png', alt: 'Three' },
          { src: '/logo/Tailwind CSS.png', alt: 'tailwind' },
          { src: '/logo/typescript.png', alt: 'typescript' },
        ]}
      />
    </motion.div>
  ) : null;
};

export default ScrollDown;
