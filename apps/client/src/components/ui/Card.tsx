import React from 'react';
import { motion } from 'framer-motion';
import { mergeClassNames } from '../../utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = false, 
  glass = false 
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300';
  
  const glassClasses = glass 
    ? 'backdrop-blur-lg bg-white/80 border border-white/20 shadow-xl'
    : 'bg-white border border-gray-100 shadow-lg';

  const hoverClasses = hover 
    ? 'hover:shadow-2xl hover:scale-[1.02] cursor-pointer'
    : '';

  const classes = mergeClassNames(
    baseClasses,
    glassClasses,
    hoverClasses,
    className
  );

  const CardComponent = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -4 },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  } : {};

  return (
    <CardComponent className={classes} {...motionProps}>
      {children}
    </CardComponent>
  );
};

export default Card;