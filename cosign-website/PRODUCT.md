# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite (existing codebase)

## Users

**Primary:** Engineering leads at regulated companies (medtech, fintech, healthtech) who need defensible GitHub approval workflows for compliance audits under 21 CFR Part 11, eIDAS, and ESIGN/UETA.

**Secondary:** DevOps/platform engineers building internal approval gates; compliance/audit teams reviewing approval trails.

## Product Purpose

Cosign is a GitHub App that makes approval workflows legally defensible by freezing the exact issue or pull request content at routing time, re-authenticating each signer at sign time, and generating a tamper-evident PDF manifest filed directly into the organization's GitHub repository — not a shadow system.

**Success means:** Engineering teams can prove exactly what was approved, by whom, and when — with evidence that lives in GitHub and survives regulatory scrutiny.

## Positioning

The only GitHub-native approval workflow that freezes content by design and files evidence in GitHub. Neighboring products route approvals through external systems, leaving a gap between the source work and the compliance artifact. Cosign closes that gap: the approval record stays with the repo and the filing location the organization controls.

## Operating Context

- **Workflows:** Design review → release signoff → regulated deployment gates
- **Environments:** GitHub.com and GitHub Enterprise; regulated engineering orgs
- **Tools:** GitHub Issues, Pull Requests, Actions, Apps API
- **Rituals:** Change detection alerts when routed content changes before all signers act; re-freeze and re-notify flow
- **Documents:** 21 CFR Part 11, eIDAS, ESIGN/UETA compliance frameworks

## Capabilities and Constraints

**Confirmed capabilities:**
- Frozen-by-design routing: locks exact issue/PR content at routing time
- Exact snapshot capture: hashes content, keeps approved version separate from later edits
- Declared intent review: signers see exact approval meaning, checklist, context before deciding
- Fresh re-authentication: approvers challenged again at sign time
- Audit-ready PDF manifests: tamper-evident PDF with signers, timestamps, intent, frozen record
- GitHub filing by design: evidence filed to tenant-owned GitHub repo/folder
- Change detection alerts: flags stale requests when routed content changes
- Data sovereignty: approval record stays with org's repo, not third-party system
- Regulatory alignment: built for 21 CFR Part 11, eIDAS, ESIGN/UETA, data minimization

**Technical constraints:**
- GitHub App architecture (OAuth, webhooks, permissions)
- Must work within GitHub's UI/UX patterns
- PDF generation client-side or serverless
- No external database for approval records

**Explicitly undecided:**
- Pricing model (subscription tiers, pilot access, enterprise)
- Self-hosted vs. SaaS deployment options
- API for custom integrations

## Brand Commitments

**Name:** Innershell • Cosign (preserved)

**Logo:** Existing SVG (preserved)

**Visual direction:** **Open to rebrand / new direction** — user signaled interest in exploring a new visual world. Current incumbent: dark purple background (#190f22), gold accent (#f8ac35), Segoe UI/system font stack.

**Voice:** Technical, precise, trustworthy, compliance-aware. No marketing fluff.

## Evidence on Hand

- **Product copy:** All section content in `/src/data/modules.js` and `/src/data/navigation.js`
- **Logo:** `/src/assets/logo.svg` and `/public/favicon.svg`
- **Live site reference:** https://cosign-app.com/ (original saved HTML)
- **Compliance frameworks:** 21 CFR Part 11, eIDAS, ESIGN/UETA explicitly named
- **Absences (do not fabricate):** Customer logos, testimonials, case studies, pricing tiers, benchmark metrics, named customers

## Product Principles

1. **GitHub-native by default** — Evidence lives where the work happens; no shadow systems
2. **Frozen by design** — The record cannot change after approval; immutability is the feature
3. **Fresh identity at sign time** — Re-authentication prevents casual delegation
4. **Audit-readiness is not optional** — Every workflow produces tamper-evident artifacts
5. **Data sovereignty respects the org** — The customer owns their compliance artifacts

## Accessibility & Inclusion

WCAG 2.1 AA baseline. Dark mode–first color system (already implemented). Semantic HTML, focus management in modal, keyboard navigation, screen-reader labels on all interactive elements. No product-specific accessibility requirements beyond baseline.