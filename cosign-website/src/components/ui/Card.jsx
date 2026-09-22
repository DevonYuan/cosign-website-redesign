import { forwardRef } from 'react';

/**
 * Depth card component — Evidence Chain / Audit Trail
 * @param {Object} props - Card props
 * @param {string} props.title - Feature name
 * @param {string} props.body - Feature description
 * @param {React.ReactNode} [props.header] - Optional stratum header (rule + label)
 * @param {React.ReactNode} [props.signals] - Trust signals badges
 * @param {string} [props.className] - Additional classes
 */
export const DepthCard = forwardRef(
  ({ title, body, header, signals, className = '', ...props }, ref) => {
    return (
      <article
        ref={ref}
        className={`depth-card ${className}`.trim()}
        data-testid="depth-card"
        {...props}
      >
        {header}
        {signals && <div className="depth-card__signals" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>{signals}</div>}
        <h4 className="depth-card__title">{title}</h4>
        <p className="depth-card__body">{body}</p>
      </article>
    );
  }
);

DepthCard.displayName = 'DepthCard';

/**
 * Stratum header component
 */
export const StratumHeader = ({ label, children }) => (
  <div className="stratum-header">
    <div className="stratum-header__rule" />
    <span className="stratum-header__label">{label}</span>
    {children}
  </div>
);

/**
 * Trust signal badge
 */
export const TrustSignal = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    default: '',
    seal: 'trust-signal--seal',
    stale: 'trust-signal--stale',
    pilot: 'trust-signal--pilot',
  };
  return (
    <span className={`trust-signal ${variantClasses[variant] || ''} ${className}`.trim()}>
      {children}
    </span>
  );
};

/**
 * Metric display — monospace dive-computer style
 */
export const Metric = ({ value, label }) => (
  <div className="metric">
    <span className="metric__value">{value}</span>
    {label && <span className="metric__label">{label}</span>}
  </div>
);

/**
 * Hash display — for frozen snapshot proof
 */
export const HashDisplay = ({ prefix, value }) => (
  <code className="hash-display">
    <span className="hash-display__prefix">{prefix}</span>
    <span className="hash-display__value">{value}</span>
  </code>
);

/**
 * Support card component
 */
export const SupportCard = forwardRef(
  ({ title, description, children, className = '', ...props }, ref) => {
    const classes = `support-card ${className}`.trim();

    return (
      <div ref={ref} className={classes} {...props}>
        <h3>{title}</h3>
        <p>{description}</p>
        <div>{children}</div>
      </div>
    );
  }
);

SupportCard.displayName = 'SupportCard';

/**
 * Stratum group container
 */
export const StratumGroup = ({ heading, children, className = '' }) => (
  <div className={`stratum-group ${className}`.trim()}>
    <h4 className="stratum-group__heading">{heading}</h4>
    <div className="stratum-group__cards">{children}</div>
  </div>
);

/**
 * Stratum core — replaces module-core
 */
export const StratumCore = ({ badge, name, tagline, className = '' }) => (
  <div className={`stratum-core ${className}`.trim()} data-testid="stratum-core">
    <span className="stratum-core__badge">{badge}</span>
    <h3 className="stratum-core__name">{name}</h3>
    <p className="stratum-core__tagline">{tagline}</p>
  </div>
);