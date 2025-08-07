import React from 'react';
import { mergeClassNames } from '../../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className,
  ...props
}) => {
  const baseClasses = 'px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent';
  
  const errorClasses = error 
    ? 'border-red-300 bg-red-50 focus:ring-red-500' 
    : 'border-gray-300 bg-white hover:border-gray-400';

  const classes = mergeClassNames(
    baseClasses,
    errorClasses,
    fullWidth && 'w-full',
    className
  );

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input className={classes} {...props} />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;