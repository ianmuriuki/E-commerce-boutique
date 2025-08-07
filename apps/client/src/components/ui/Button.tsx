import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { mergeClassNames } from '../../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-luxury-gold text-luxury-black hover:bg-luxury-gold-dark focus:ring-luxury-gold shadow-lg hover:shadow-xl',
    secondary: 'bg-luxury-burgundy text-white hover:bg-luxury-burgundy-dark focus:ring-luxury-burgundy shadow-lg hover:shadow-xl',
    outline: 'border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black focus:ring-luxury-gold',
    ghost: 'text-luxury-black hover:bg-luxury-ivory focus:ring-luxury-gold',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = mergeClassNames(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  );

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </motion.button>
  );
};

export default Button;