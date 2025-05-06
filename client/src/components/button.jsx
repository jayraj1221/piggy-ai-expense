import React from 'react';

const Button = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    default:
      'bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:text-white dark:hover:bg-primary/90',
    ghost:
      'bg-transparent text-primary border border-primary hover:bg-primary/10 dark:text-primary dark:border-primary dark:hover:bg-primary/10',
    outline:
      'border border-primary text-primary hover:bg-primary/10 dark:border-primary dark:text-primary dark:hover:bg-primary/10',
    secondary:
      'bg-secondary text-white hover:bg-secondary/90 dark:bg-secondary dark:text-white dark:hover:bg-secondary/90',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`rounded-md focus:outline-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
