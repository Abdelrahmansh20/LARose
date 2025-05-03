import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className, 
      children, 
      variant = 'primary', 
      size = 'md', 
      isLoading = false,
      disabled,
      ...props 
    }, 
    ref
  ) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            // Variants
            'bg-brown-600 text-white hover:bg-brown-700 focus-visible:ring-brown-500': variant === 'primary',
            'bg-beige-200 text-brown-800 hover:bg-beige-300 focus-visible:ring-beige-400': variant === 'secondary',
            'border border-beige-300 bg-white hover:bg-beige-100 text-brown-800': variant === 'outline',
            'text-brown-700 hover:bg-beige-100 hover:text-brown-900': variant === 'ghost',
            
            // Sizes
            'text-xs px-2.5 py-1.5 rounded-md': size === 'sm',
            'text-sm px-4 py-2 rounded-md': size === 'md',
            'text-base px-5 py-2.5 rounded-md': size === 'lg',
          },
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-middle" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };