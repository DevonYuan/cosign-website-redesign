import { NAV_LINKS } from '../../data/navigation';

/**
 * Header/Navigation component — Terminal Titlebar
 */
export function Header({ activeSection, onNavigate, onSectionChange }) {
  const handleNavClick = (href) => {
    if (href.startsWith('#')) {
      onNavigate?.(href);
    }
  };

  return (
    <div className="titlebar">
      <div className="titlebar-inner">
        <div className="dots">
          <span />
          <span />
          <span />
        </div>
        <div className="titlebar-path">
          <b>Cosign</b> — approval audit log
        </div>
        <nav className="tabs" role="navigation" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.testId}
              href={link.href}
              className={`nav-link ${activeSection === link.href.replace('#', '') ? 'current' : ''} ${link.isCta ? 'btn-install' : ''}`}
              data-testid={link.testId}
              onClick={(e) => {
                if (!link.isExternal && link.href.startsWith('#')) {
                  e.preventDefault();
                  handleNavClick(link.href);
                }
              }}
              target={link.isExternal ? '_blank' : undefined}
              rel={link.isExternal ? 'noopener noreferrer' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}