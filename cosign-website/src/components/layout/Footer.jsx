import { FOOTER } from '../../data/navigation';

/**
 * Footer component — Terminal Theme
 */
export function Footer() {
  return (
    <footer className="wrap" role="contentinfo">
      <div className="foot-row">
        <span>© 2026 Innershell. All rights reserved.</span>
        <span className="foot-prompt"><span className="sym">›</span> monitoring approvals — innershell.io<span className="caret" /></span>
      </div>
    </footer>
  );
}