/**
 * Support section component — Terminal Theme
 * Terminal-style support cards with command prompts
 */
export function Support({ onOpenContact }) {
  return (
    <section id="support" className="section wrap" style={{ borderBottom: 'none' }}>
      <div className="section-head">
        <p className="cmd"><span className="sym">~/</span>support</p>
        <h2>Talk with the Innershell team.</h2>
        <p>Ask about the product, ask about pricing, or request a pilot to evaluate Cosign in your own GitHub workflow.</p>
      </div>
      <div className="support-grid">
        <div className="support-card">
          <p className="cmd"><span className="sym">›</span> product overview</p>
          <h3>Product overview</h3>
          <p>Learn how Cosign works for issue approvals, PR sign-off, audit integrity, and compliance-friendly filing.</p>
          <div className="support-links">
            <a href="#" onClick={(e) => { e.preventDefault(); onOpenContact('general'); }}>contact us <span>→</span></a>
          </div>
        </div>
        <div className="support-card">
          <p className="cmd"><span className="sym">›</span> pricing & pilots</p>
          <h3>Pricing & pilots</h3>
          <p>Ask about the subscription model, trial access, or early access for a pilot implementation.</p>
          <div className="support-links">
            <a href="#pricing" onClick={(e) => { e.preventDefault(); onOpenContact('pricing'); }}>ask about pricing <span>→</span></a>
            <a href="#" onClick={(e) => { e.preventDefault(); onOpenContact('beta'); }}>request beta access <span>→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}