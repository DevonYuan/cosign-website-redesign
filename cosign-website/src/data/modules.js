// Feature content for the Cosign marketing site
export const COSIGN_MODULES = [
  {
    id: 'core-membership',
    name: 'Frozen-by-design routing',
    tagline:
      'Every approval starts by locking the exact GitHub issue or pull request content, so the signoff is tied to a specific version of the record.',
    isCore: true,
  },
  {
    id: 'member-portal',
    name: 'Exact snapshot capture',
    tagline:
      'Cosign hashes the relevant issue or pull request content at routing time and keeps the approved version separate from later edits.',
    billedTo: 'local',
    group: 'membership-money',
  },
  {
    id: 'online-dues-payments',
    name: 'Declared intent review',
    tagline:
      'Each signer sees the exact approval meaning, checklist, and context before they decide whether to approve, reject, or request changes.',
    billedTo: 'local',
    group: 'membership-money',
  },
  {
    id: 'tax-receipts-slips',
    name: 'Fresh re-authentication',
    tagline:
      'Approvers are challenged again at sign time so every decision is tied to a fresh identity check and cannot be casually delegated.',
    billedTo: 'local',
    group: 'membership-money',
  },
  {
    id: 'work-dues-session-tracking',
    name: 'Audit-ready PDF manifests',
    tagline:
      'Completed approvals generate a tamper-evident PDF manifest that captures the signers, timestamps, intent, and frozen record for audit use.',
    billedTo: 'local',
    group: 'union-operations',
  },
  {
    id: 'pension-benefits-reporting',
    name: 'GitHub filing by design',
    tagline:
      'The signed evidence is filed into a tenant-owned GitHub repository or folder so the compliance artifact remains in the same ecosystem as the source work.',
    billedTo: 'local',
    group: 'union-operations',
  },
  {
    id: 'contract-engagement-management',
    name: 'Change detection alerts',
    tagline:
      'If the routed issue or PR changes before all signers act, the workflow flags the request as stale and prompts re-freeze and re-notify.',
    billedTo: 'local',
    group: 'union-operations',
  },
  {
    id: 'musician-directory-gig-board',
    name: 'Data sovereignty by default',
    tagline:
      'The approval record stays with the repo and the filing location your organization controls, instead of living only in a third-party system.',
    billedTo: 'local',
    group: 'growth-community',
  },
  {
    id: 'governance-voting',
    name: 'Regulatory alignment',
    tagline:
      'Cosign is built to support 21 CFR Part 11, eIDAS, ESIGN/UETA, and the data-minimization expectations common in regulated environments.',
    billedTo: 'local',
    group: 'growth-community',
  },
];

export const GROUP_LABELS = {
  'membership-money': 'Review & approval',
  'union-operations': 'Operational controls',
  'growth-community': 'Trust & compliance',
};