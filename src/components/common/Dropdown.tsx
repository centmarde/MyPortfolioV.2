import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface ScrollDownProps {
  color?: string;
  onClick?: () => void;
  size?: number;
  showText?: boolean;
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

const ScrollDown: React.FC<ScrollDownProps> = ({ color = 'skyblue', onClick, size = 30, showText = true }) => {
  return (
    <div className="flex flex-col items-center">
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
  size = 30,
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
      />
    </motion.div>
  ) : null;
};

export default ScrollDown;
