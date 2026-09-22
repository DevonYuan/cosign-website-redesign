import { COSIGN_MODULES, GROUP_LABELS } from '../../data/modules';

/**
 * Features section component — Terminal Theme
 * Log-grid style showing approval checks and operational controls
 */
export function Features() {
  // Define the feature groups matching the terminal log design
  const reviewApprovalFeatures = [
    {
      id: 'snapshot.capture',
      status: '✓ verified',
      file: 'snapshot.capture',
      title: 'Exact snapshot capture',
      description: 'The issue or PR content is hashed at routing time, so the version a signer reviewed can never quietly drift from the version they approved.',
    },
    {
      id: 'intent.declared',
      status: '✓ verified',
      file: 'intent.declared',
      title: 'Declared intent review',
      description: 'Each signer sees the exact approval meaning and checklist before deciding to approve, reject, or send it back for changes.',
    },
    {
      id: 'reauth.fresh',
      status: '✓ verified',
      file: 'reauth.fresh',
      title: 'Fresh re-authentication',
      description: 'Approvers are challenged again at sign time, so a decision is tied to a live identity check, not a session left open in a browser tab.',
    },
  ];

  const operationalControlsFeatures = [
    {
      id: 'manifest.pdf',
      status: '✓ verified',
      file: 'manifest.pdf',
      title: 'Audit-ready PDF manifests',
      description: 'A finished approval generates a tamper-evident PDF with signers, timestamps, declared intent, and the frozen record — ready to hand to an auditor.',
    },
    {
      id: 'filing.repo',
      status: '✓ verified',
      file: 'filing.repo',
      title: 'Repository filing by design',
      description: 'The signed evidence is filed into a repository your org already owns, so the compliance artifact stays in the same place as the work.',
    },
    {
      id: 'drift.detect',
      status: '✓ verified',
      file: 'drift.detect',
      title: 'Change detection alerts',
      description: 'If the routed issue or PR changes before every signer has acted, the request is flagged stale and pushed back for re-freeze.',
    },
  ];

  return (
    <section id="features" className="section wrap">
      <div className="section-head">
        <p className="cmd"><span className="sym">›</span> checks.completed <span className="term-ok">6/6</span></p>
        <h2>Every approval, checked against the same suite.</h2>
        <p>
          Issue comments and merged PRs are easy to edit after the fact.
          Cosign runs each approval through six checks before it will
          call a record "signed" — the same six checks, every time.
        </p>
      </div>

      <p className="grp-label"><b>review & approval</b> · 3 verified</p>
      <div className="log-grid">
        {reviewApprovalFeatures.map((feature) => (
          <div key={feature.id} className="log-row">
            <div className="log-top">
              <span className="log-status">{feature.status}</span>
              <span className="log-file">{feature.file}</span>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <p className="grp-label"><b>operational controls</b> · 3 verified</p>
      <div className="log-grid">
        {operationalControlsFeatures.map((feature) => (
          <div key={feature.id} className="log-row">
            <div className="log-top">
              <span className="log-status">{feature.status}</span>
              <span className="log-file">{feature.file}</span>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Compliance Band */}
      <section className="section band">
        <div className="wrap">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="cmd"><span className="sym">›</span> compliance mapping</p>
            <h2>Built for the frameworks your auditor already knows.</h2>
            <p>
              From design review to release sign-off, Cosign gives your team
              one approval path, anchored to the exact content being
              reviewed — no shadow spreadsheet, no second system of record.
            </p>
            <div className="flag-row">
              <span className="flag">21 CFR Part 11</span>
              <span className="flag">eIDAS</span>
              <span className="flag">ESIGN / UETA</span>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}