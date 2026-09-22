import { forwardRef } from 'react';

/**
 * Button component — Evidence Chain / Audit Trail variants
 * @param {'plate' | 'ghost' | 'stratum'} variant - Button style variant
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props - Standard button props
 */
export const Button = forwardRef(
  ({ variant = 'plate', children, className = '', ...props }, ref) => {
    const baseClasses = 'button';
    const variantClasses = {
      plate: 'button-plate',
      ghost: 'button-ghost',
      stratum: 'button-stratum',
    };
    const classes = `${baseClasses} ${variantClasses[variant] || variantClasses.plate} ${className}`.trim();

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * Link-styled button for support cards
 */
export const LinkButton = forwardRef(
  ({ children, className = '', ...props }, ref) => {
    const classes = `link-button ${className}`.trim();
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

LinkButton.displayName = 'LinkButton';