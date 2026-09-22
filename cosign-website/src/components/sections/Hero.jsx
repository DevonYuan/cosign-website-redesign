import { useState, useEffect } from 'react';

/**
 * Hero/Home section component — Terminal Theme
 * Hero with terminal panel showing sample approval audit log
 */
export function Hero({ onNavigate }) {
  const [hashValue, setHashValue] = useState('a1f4e8...9c2f');

  // Live hash update — simulates frozen snapshot proof
  useEffect(() => {
    const interval = setInterval(() => {
      const chars = '0123456789abcdef';
      let hash = '';
      for (let i = 0; i < 12; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
      }
      setHashValue(`${hash}...9c2f`);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCtaClick = (href) => {
    if (href.startsWith('#')) {
      onNavigate?.(href);
    }
  };

  return (
    <section id="home" className="hero wrap">
      <div className="hero-grid">
        <div>
          <p className="prompt-line"><span className="sym">›</span> triggered by approval.requested</p>
          <h1>Approvals that still hold up when someone asks for proof.</h1>
          <p className="lede">
            Cosign is a GitHub App that freezes the exact issue or pull
            request being approved, re-checks each signer's identity, and
            writes a tamper-evident record — so your sign-off means the
            same thing today and in an audit three years from now.
          </p>
          <div className="cta-row">
            <a href="https://github.com/apps/cosign-github" className="cta-primary" target="_blank" rel="noopener noreferrer">
              install on github
            </a>
            <a href="#features" className="cta-secondary" onClick={(e) => { e.preventDefault(); handleCtaClick('#features'); }}>
              see how it works
            </a>
          </div>
          <div className="hash-row">
            <span>content-hash:</span>
            <code>{hashValue}</code>
            <span className="tag">frozen</span>
          </div>
        </div>

        <div className="term" aria-label="Sample approval audit log">
          <div className="term-head">
            <div className="dots"><span /><span /><span /></div>
            audit log · session #412
          </div>
          <div className="term-body">
            <div className="term-cmd"><span className="sym">›</span> approval.requested <span className="term-mut">#412</span></div>
            <div className="term-out">cosign: snapshot frozen — content-hash:a1f4e8</div>
            <div className="term-out">cosign: routed to <span className="term-amber">@m.chen</span>, <span className="term-amber">@d.patel</span></div>
            <div className="term-rule">───────────────────────────────</div>
            <div className="term-cmd"><span className="sym">›</span> m.chen re-authenticated <span className="term-ok">✓</span></div>
            <div className="term-out">signed — "approve for release 4.2"</div>
            <div className="term-rule">───────────────────────────────</div>
            <div className="term-cmd"><span className="sym">›</span> d.patel re-authenticated <span className="term-ok">✓</span></div>
            <div className="term-out">signed — "approve for release 4.2"</div>
            <div className="term-out">manifest.pdf written</div>
            <div className="term-out">status: <span className="term-ok">FROZEN</span><span className="caret" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}