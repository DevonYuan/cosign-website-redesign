/**
 * Pricing section component — Terminal Theme
 * Terminal-style pricing grid with three tiers
 */
export function Pricing({ onOpenContact }) {
  return (
    <section id="pricing" className="section wrap">
      <div className="section-head">
        <p className="cmd"><span className="sym">~/</span>pricing</p>
        <h2>Start free, prove it on a real repo, then scale.</h2>
        <p>Subscription pricing is rolling out now. Pilots run in your own GitHub org, on your own approval workflow.</p>
      </div>
      <div className="pricing-grid">
        <div className="plan">
          <p className="plan-flag">solo repo</p>
          <p className="plan-name">Starter</p>
          <p className="plan-price">$0</p>
          <ul className="plan-list">
            <li>1 repository</li>
            <li>Frozen-snapshot routing</li>
            <li>PDF manifest export</li>
          </ul>
          <a href="#" className="plan-cta" onClick={(e) => { e.preventDefault(); onOpenContact('pricing'); }}>install free</a>
        </div>
        <div className="plan is-active">
          <p className="plan-flag on">most teams choose this</p>
          <p className="plan-name">Team</p>
          <p className="plan-price">$—<sup>/ seat / mo</sup></p>
          <ul className="plan-list">
            <li>Unlimited repositories</li>
            <li>Re-authentication + drift alerts</li>
            <li>Org-owned manifest filing</li>
          </ul>
          <a href="#support" className="plan-cta" onClick={(e) => { e.preventDefault(); onOpenContact('beta'); }}>request beta access</a>
        </div>
        <div className="plan">
          <p className="plan-flag">regulated orgs</p>
          <p className="plan-name">Pilot</p>
          <p className="plan-price">custom</p>
          <ul className="plan-list">
            <li>Evaluated in your own org</li>
            <li>21 CFR / eIDAS mapping review</li>
            <li>Dedicated rollout support</li>
          </ul>
          <a href="#support" className="plan-cta" onClick={(e) => { e.preventDefault(); onOpenContact('beta'); }}>talk to us</a>
        </div>
      </div>
    </section>
  );
}