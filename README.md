# Toucan – Payment Platform Frontend Scope Implementation
Inspired by the breadth of Razorpay and Stripe (Light Theme Only, Zero-Build).

Open `index.html` or `landing.html` in any modern browser. No build steps, no node_modules required.

## Included Features (Based on PDF Scope Checklist):

1. **Public Marketing Website & Product Lines (Module 1)**:
   - Full product suite (Gateway, Links, Pages, Subscriptions, Invoicing, Payouts, Marketplace, International, POS).
   - Industry solutions for SaaS, E-commerce, Marketplaces, EdTech, Freelancers.
   - Transparent fee calculator + 3-tier Plan Comparison table (Starter, Growth Pro, Enterprise).
   - Integrations directory with SDKs for React, Node.js, Python, Shopify, WooCommerce.
   - Bank-grade security & RBI PA-PG regulatory compliance details.
   - FAQ accordion & Book a Demo scheduling modal.

2. **Authentication & Merchant Onboarding (Module 2 & 15)**:
   - Sign up, sign in, password visibility peek, forgot password flow.
   - 5-step automated onboarding wizard: Business constitution, PAN, Bank penny-drop verification status, and RBI compliance declarations.

3. **Merchant Dashboard & Workspace Shell (Module 3)**:
   - Role-aware application shell with multi-role switcher (Merchant Admin, Finance Manager, Developer, Risk Officer, Super-Admin).
   - Live Mode vs Test Mode toggle.
   - Date range filters, TPV, success rate, pending settlement cards, and live event ticker.

4. **Transactions & Customer Management (Module 4)**:
   - Filterable data table with status pills (captured, authorized, failed, refunded, disputed) and payment mode filter.
   - Instant search across transactions and 1-click CSV export.
   - Transaction detail inspector with full lifecycle event timeline.
   - Full & partial refund workflows.
   - Dispute management with deadline countdown timer and evidence upload.
   - Customer management directory with profile modal and stored payment methods.

5. **Checkout & Payment Experiences (Module 5)**:
   - Hosted & embedded checkout simulator.
   - Card entry with live brand detection (Visa/Mastercard/RuPay), Luhn validation, and 3-D Secure OTP modal simulation.
   - Dynamic UPI flow with scannable QR simulation and timer.
   - Net Banking popular banks selector and digital wallet selector.
   - Order summary with coupon discounts and downloadable receipt generation.

6. **Payment Links & No-Code Page Builder (Module 6)**:
   - Payment links manager with status tracking, copy link, and QR/WhatsApp share modal.
   - Create link wizard with partial payments and expiration settings.
   - Visual No-Code Page Editor: live customizer for title, description, brand color picker, and custom fields with instant real-time mockup preview.

7. **Billing, Subscriptions & GST Invoicing (Module 7)**:
   - Subscription plans manager with recurring billing intervals, MRR tracking, and churn analytics.
   - GST tax invoice creator with dynamic line items, 18% IGST auto-calculation, and printable/downloadable invoice PDF layout.

8. **Settlements, Payouts & Reconciliation (Module 8)**:
   - Available, in-transit, and risk reserve balance cards.
   - Settlement batches table with Bank UTR reference numbers and fee deductions.
   - Direct Payouts creator supporting instant IMPS transfers with maker-checker approvals.

9. **Marketplace & Split Payments (Module 9)**:
   - Connected sellers directory with KYC verification status.
   - Split-payment calculator simulating platform take-rate commissions vs vendor transfers.

10. **Developer Portal & API Management (Module 10)**:
    - Interactive runnable API reference console supporting cURL, Node.js, Python, and Go.
    - Restricted API keys manager with reveal-secret-once protection and revoke action.
    - Webhook endpoint manager and delivery attempt history with 1-click event replay.
    - Sandbox scenario simulator for bank downtimes, 3DS timeouts, and card declines.

11. **Risk & Fraud Desk (Module 12)**:
    - Manual review queue with 0–100 risk scores, flagged triggers, and 1-click approve/block.
    - Allowlist and blocklist management for card BINs, IP subnets, and disposable email domains.

12. **Internal Super-Admin & Operations Console (Module 14)**:
    - Platform-wide GMV and fee revenue metrics.
    - Multi-provider gateway health monitoring (HDFC, ICICI, Axis, SBI) with automated fallback routing.

13. **Frontend Scope & Estimation Guide Calculator (PDF Pages 2, 9, 10, 11)**:
    - Interactive model implementing the exact formula from the PDF:
      `Estimated Hours = Templates × Hours × (1 − Reuse) × (1 + QA)`
      `Person-Months = Estimated Hours ÷ 160`
    - Sliders for Templates count (T), Base Hours (H), Reuse Efficiency (R), and QA Allowance (Q).
    - Complete 14-Module Checklist Inventory tracker with search, interactive checkboxes, and JSON Scope Report export.

## File Structure
- `index.html`: Main application featuring public landing and the full Merchant Console & Scope Estimator.
- `landing.html`: Marketing discovery landing page.
- `about.html`: Toucan story & philosophy page.
- `assets/styles.css`: Public marketing and design tokens.
- `assets/platform.css`: Role-aware Merchant Console, tables, modals, timelines, and estimation UI.
- `assets/app.js`: Kinetic typography, 3D card motion, particle network, command palette, and smooth scrolling.
- `assets/platform.js`: Merchant Console state engine, interactive modals, calculators, and API sandboxes.
