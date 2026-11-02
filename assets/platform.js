/**
 * Toucan Platform & Merchant Console Core Engine
 * Implements all 14 frontend scope modules + Interactive Estimation Calculator
 */
(()=>{
  'use strict';

  // Utility helpers
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmtINR = (n) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const uid = (p = 'txn_') => p + Math.random().toString(36).substr(2, 9);

  // App State
  const state = {
    view: 'website', // 'website' or 'platform'
    activeTab: 'overview',
    role: 'merchant_admin', // 'merchant_admin', 'finance', 'developer', 'risk_officer', 'super_admin'
    env: 'test', // 'test' or 'live'
    dateRange: '7d',
    
    // Transactions mock dataset
    transactions: [
      { id: 'txn_98a72b1', customer: 'Aarav Sharma', email: 'aarav@example.com', amount: 2499, method: 'UPI (PhonePe)', status: 'captured', date: '2026-10-27 10:14', rrn: '629810482910', fee: 9.99, gst: 1.80, net: 2487.21 },
      { id: 'txn_42c81d3', customer: 'Meera Kulkarni', email: 'meera@example.com', amount: 860, method: 'Card (Visa •••• 4242)', status: 'captured', date: '2026-10-27 09:42', rrn: '629810411204', fee: 16.34, gst: 2.94, net: 840.72 },
      { id: 'txn_17f90e5', customer: 'Rohan Patel', email: 'rohan.p@example.com', amount: 12000, method: 'Net Banking (HDFC)', status: 'authorized', date: '2026-10-27 08:30', rrn: '629810304918', fee: 192.00, gst: 34.56, net: 11773.44 },
      { id: 'txn_63b14a8', customer: 'Isha Deshmukh', email: 'isha.d@example.com', amount: 449, method: 'Wallet (Paytm)', status: 'failed', reason: 'Insufficient funds at issuer bank', date: '2026-10-26 21:15', rrn: '629809981240', fee: 0, gst: 0, net: 0 },
      { id: 'txn_55e29f0', customer: 'Kabir Nair', email: 'kabir@example.com', amount: 3150, method: 'UPI (Google Pay)', status: 'refunded', refundAmount: 3150, date: '2026-10-26 18:22', rrn: '629808471902', fee: 0, gst: 0, net: 0 },
      { id: 'txn_33d77c2', customer: 'Ananya Rao', email: 'ananya@example.com', amount: 5490, method: 'Card (Mastercard •••• 8812)', status: 'disputed', disputeReason: 'Fraudulent transaction suspected', date: '2026-10-25 14:10', rrn: '629801294811', fee: 104.31, gst: 18.78, net: 5366.91 },
      { id: 'txn_77a99b4', customer: 'Siddharth Roy', email: 'sid.roy@example.com', amount: 1800, method: 'UPI (CRED)', status: 'captured', date: '2026-10-25 11:05', rrn: '629798410291', fee: 7.20, gst: 1.30, net: 1791.50 }
    ],

    // Payment links mock dataset
    links: [
      { id: 'plink_771a', title: 'UX Design Workshop Pass', amount: 1500, status: 'active', created: '2026-10-24', payments: 14, url: 'https://pay.toucan.example/l/ux-pass' },
      { id: 'plink_332b', title: 'Consulting Retainer - Q4', amount: 45000, status: 'paid', created: '2026-10-20', payments: 1, url: 'https://pay.toucan.example/l/consult-q4' },
      { id: 'plink_994c', title: 'Annual Community Membership', amount: 2499, status: 'active', created: '2026-10-18', payments: 88, url: 'https://pay.toucan.example/l/comm-annual' }
    ],

    // Invoices mock dataset
    invoices: [
      { id: 'INV-2026-001', customer: 'Acme Cloud Inc.', amount: 29500, gst: 4500, status: 'paid', dueDate: '2026-10-25', issued: '2026-10-10' },
      { id: 'INV-2026-002', customer: 'Vertex Studio Ltd.', amount: 14160, gst: 2160, status: 'sent', dueDate: '2026-11-05', issued: '2026-10-22' },
      { id: 'INV-2026-003', customer: 'Blue Horizon Tech', amount: 82600, gst: 12600, status: 'overdue', dueDate: '2026-10-18', issued: '2026-10-01' }
    ],

    // Webhooks delivery attempts mock
    webhooks: [
      { id: 'wh_evt_01', event: 'payment.captured', url: 'https://api.merchant.com/webhook', status: 200, time: '2026-10-27 10:14:02', duration: '124ms' },
      { id: 'wh_evt_02', event: 'refund.processed', url: 'https://api.merchant.com/webhook', status: 200, time: '2026-10-26 18:22:15', duration: '98ms' },
      { id: 'wh_evt_03', event: 'dispute.created', url: 'https://api.merchant.com/webhook', status: 500, time: '2026-10-25 14:10:44', duration: '1420ms' }
    ],

    // Connected Marketplace Sellers
    sellers: [
      { id: 'sel_01', name: 'Artisan Pottery Studio', email: 'support@artisanpottery.in', balance: 34200, kyc: 'verified', commission: '10%' },
      { id: 'sel_02', name: 'Heritage Organic Teas', email: 'sales@heritageteas.com', balance: 18950, kyc: 'verified', commission: '12%' },
      { id: 'sel_03', name: 'Nomad Leather Goods', email: 'hello@nomadleather.in', balance: 0, kyc: 'under_review', commission: '10%' }
    ],

    // Risk Review Items
    riskQueue: [
      { id: 'risk_01', txnId: 'txn_33d77c2', amount: 5490, score: 88, level: 'high', reason: 'Foreign card BIN + TOR exit node IP', status: 'review' },
      { id: 'risk_02', txnId: 'txn_88b12e9', amount: 78000, score: 72, level: 'medium', reason: 'High-ticket velocity trigger (3 attempts in 2m)', status: 'review' }
    ],

    // Frontend Estimation Calculator Model Parameters (from PDF page 10)
    estimation: {
      templates: 200,
      hoursPerTemplate: 10,
      reuseEfficiency: 25, // in percent
      qaAllowance: 25 // in percent
    }
  };

  // Toast notifier
  function notify(msg) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3000);
  }

  // View Switcher (Marketing Website vs Merchant Platform Console)
  function setView(viewMode) {
    state.view = viewMode;
    const websiteMain = $('#main');
    const platformContainer = $('#merchant-platform-container');
    const heroAtmSection = $('#top');
    const modeSwitchBtn = $('#view-switch-btn');

    if (viewMode === 'platform') {
      if (platformContainer) platformContainer.hidden = false;
      if (websiteMain) websiteMain.hidden = true;
      if (modeSwitchBtn) modeSwitchBtn.textContent = '🌐 Switch to Public Website';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderTab(state.activeTab);
    } else {
      if (platformContainer) platformContainer.hidden = true;
      if (websiteMain) websiteMain.hidden = false;
      if (modeSwitchBtn) modeSwitchBtn.textContent = '⚡ Open Merchant Console';
    }
  }

  // Switch Active Tab in Platform Sidebar
  function setTab(tabKey) {
    state.activeTab = tabKey;
    $$('.sidebar-nav-item').forEach(el => {
      const isActive = el.dataset.tab === tabKey;
      el.classList.toggle('active', isActive);
      if (isActive && window.innerWidth <= 980) {
        el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
    renderTab(tabKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Render Module Tab Content
  function renderTab(tabKey) {
    const outlet = $('#platform-content-outlet');
    if (!outlet) return;

    switch (tabKey) {
      case 'overview':
        outlet.innerHTML = getOverviewHtml();
        initOverviewEvents();
        break;
      case 'transactions':
        outlet.innerHTML = getTransactionsHtml();
        initTransactionsEvents();
        break;
      case 'customers':
        outlet.innerHTML = getCustomersHtml();
        initCustomersEvents();
        break;
      case 'checkout':
        outlet.innerHTML = getCheckoutModuleHtml();
        initCheckoutModuleEvents();
        break;
      case 'links':
        outlet.innerHTML = getPaymentLinksHtml();
        initPaymentLinksEvents();
        break;
      case 'page-builder':
        outlet.innerHTML = getPageBuilderHtml();
        initPageBuilderEvents();
        break;
      case 'subscriptions':
        outlet.innerHTML = getSubscriptionsHtml();
        initSubscriptionsEvents();
        break;
      case 'invoices':
        outlet.innerHTML = getInvoicesHtml();
        initInvoicesEvents();
        break;
      case 'settlements':
        outlet.innerHTML = getSettlementsHtml();
        initSettlementsEvents();
        break;
      case 'payouts':
        outlet.innerHTML = getPayoutsHtml();
        initPayoutsEvents();
        break;
      case 'marketplace':
        outlet.innerHTML = getMarketplaceHtml();
        initMarketplaceEvents();
        break;
      case 'developers':
        outlet.innerHTML = getDevelopersHtml();
        initDevelopersEvents();
        break;
      case 'webhooks':
        outlet.innerHTML = getWebhooksHtml();
        initWebhooksEvents();
        break;
      case 'sandbox':
        outlet.innerHTML = getSandboxHtml();
        initSandboxEvents();
        break;
      case 'risk':
        outlet.innerHTML = getRiskHtml();
        initRiskEvents();
        break;
      case 'settings':
        outlet.innerHTML = getSettingsHtml();
        initSettingsEvents();
        break;
      case 'super-admin':
        outlet.innerHTML = getSuperAdminHtml();
        initSuperAdminEvents();
        break;
      case 'onboarding':
        outlet.innerHTML = getOnboardingWizardHtml();
        initOnboardingWizardEvents();
        break;
      case 'estimator':
        outlet.innerHTML = getEstimatorHtml();
        initEstimatorEvents();
        break;
      default:
        outlet.innerHTML = getOverviewHtml();
        initOverviewEvents();
    }
  }

  // -------------------------------------------------------------
  // 1. Overview HTML & Logic
  // -------------------------------------------------------------
  function getOverviewHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Merchant Dashboard Overview</h1>
          <p>Real-time metrics, settlement status, and quick actions across all payment channels.</p>
        </div>
        <div class="app-topbar-controls">
          <select class="date-filter-select" id="overview-date-filter">
            <option value="today">Today</option>
            <option value="7d" selected>Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="1y">Year to Date</option>
          </select>
          <button class="btn btn-primary" id="btn-quick-new-link">+ New Payment Link</button>
        </div>
      </div>

      <div class="notice-banner">
        <div class="notice-content">
          <span class="notice-icon">✓</span>
          <div>
            <strong>Business Verification Complete (Live Mode Active)</strong> — Bank account and KYC approved for instant automated settlements.
          </div>
        </div>
        <button class="btn btn-ghost" id="btn-view-kyc-details" style="padding: 6px 12px; font-size: 0.8rem;">View Compliance</button>
      </div>

      <div class="stat-cards-grid">
        <div class="stat-card">
          <div class="stat-header">
            <span>Total Payment Volume</span>
            <span>💳</span>
          </div>
          <div class="stat-value">₹12,48,600</div>
          <div class="stat-footer">
            <span class="stat-pill positive">↗ +14.2%</span>
            <span>vs previous period</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span>Successful Payments</span>
            <span>✓</span>
          </div>
          <div class="stat-value">3,842</div>
          <div class="stat-footer">
            <span class="stat-pill positive">↗ +8.5%</span>
            <span>Avg ticket: ₹324.98</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span>Platform Success Rate</span>
            <span>⚡</span>
          </div>
          <div class="stat-value">97.6%</div>
          <div class="stat-footer">
            <span class="stat-pill positive">↗ +0.8%</span>
            <span>UPI: 98.4% · Cards: 96.2%</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span>Pending Next Settlement</span>
            <span>🏦</span>
          </div>
          <div class="stat-value">₹1,84,320</div>
          <div class="stat-footer">
            <span class="stat-pill neutral">Deposit: Tomorrow 11 AM</span>
          </div>
        </div>
      </div>

      <div class="quick-actions-bar">
        <span style="font-size: 0.82rem; font-weight: 700; color: var(--muted); text-transform: uppercase;">Quick Actions:</span>
        <button class="action-chip" data-nav="links">🔗 Create Link</button>
        <button class="action-chip" data-nav="invoices">📄 Create Invoice</button>
        <button class="action-chip" data-nav="payouts">💸 Send Payout</button>
        <button class="action-chip" data-nav="checkout">🛒 Try Checkout</button>
        <button class="action-chip" data-nav="developers">🔑 View API Keys</button>
        <button class="action-chip" data-nav="estimator">📐 Scope Estimator</button>
      </div>

      <div class="panel-card">
        <div class="panel-card-header">
          <div>
            <h2 class="panel-card-title">Recent Transactions & Event Feed</h2>
            <p class="panel-card-subtitle">Live stream of captured payments, refunds, and authorizations.</p>
          </div>
          <button class="btn btn-ghost" data-nav="transactions" style="font-size: 0.82rem; padding: 6px 12px;">View All Transactions →</button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date / Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.transactions.slice(0, 5).map(t => `
                <tr>
                  <td><code class="table-code">${t.id}</code></td>
                  <td><strong>${t.customer}</strong><span class="table-subtext">${t.email}</span></td>
                  <td><strong>${fmtINR(t.amount)}</strong></td>
                  <td>${t.method}</td>
                  <td><span class="status-pill ${t.status}">${t.status}</span></td>
                  <td>${t.date}</td>
                  <td><button class="btn btn-ghost btn-sm-table" onclick="window.toucanApp.viewTxn('${t.id}')">View Details</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function initOverviewEvents() {
    $('#btn-quick-new-link')?.addEventListener('click', () => setTab('links'));
    $('#btn-view-kyc-details')?.addEventListener('click', () => setTab('onboarding'));
    $$('.action-chip[data-nav], button[data-nav]').forEach(btn => {
      btn.addEventListener('click', () => setTab(btn.dataset.nav));
    });
  }

  // -------------------------------------------------------------
  // 2. Transactions & Customers HTML & Logic
  // -------------------------------------------------------------
  function getTransactionsHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Transactions & Dispute Management</h1>
          <p>Filter, inspect, refund, and manage customer payment lifecycles and chargebacks.</p>
        </div>
        <div class="app-topbar-controls">
          <button class="btn btn-ghost" id="btn-export-csv">📥 Export CSV</button>
          <button class="btn btn-primary" id="btn-simulate-txn">+ Simulate New Charge</button>
        </div>
      </div>

      <div class="panel-card" style="padding: 16px 20px;">
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          <input type="text" id="txn-search-input" placeholder="Search by Transaction ID, Customer, or Email…" style="flex: 1; min-width: 240px; padding: 8px 12px; font-size: 0.88rem;">
          <select class="status-filter-select" id="txn-status-filter">
            <option value="all">All Statuses</option>
            <option value="captured">Captured</option>
            <option value="authorized">Authorized</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="disputed">Disputed</option>
          </select>
          <select class="status-filter-select" id="txn-method-filter">
            <option value="all">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Card">Cards</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Wallet">Wallet</option>
          </select>
        </div>
      </div>

      <div class="panel-card">
        <div class="table-wrapper">
          <table class="data-table" id="txn-full-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer Name</th>
                <th>Amount</th>
                <th>Net Credited</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="txn-table-body">
              ${renderTxnRows(state.transactions)}
            </tbody>
          </table>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--muted); padding-top: 10px;">
          <span>Showing <strong>${state.transactions.length}</strong> transactions</span>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-ghost" style="padding: 4px 10px; font-size: 0.8rem;" disabled>Previous</button>
            <button class="btn btn-ghost" style="padding: 4px 10px; font-size: 0.8rem;" disabled>Next</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderTxnRows(list) {
    if (!list.length) {
      return `<tr><td colspan="8" style="text-align:center; padding: 32px; color: var(--muted);">No matching transactions found.</td></tr>`;
    }
    return list.map(t => `
      <tr>
        <td><code class="table-code">${t.id}</code></td>
        <td><strong>${t.customer}</strong><span class="table-subtext">${t.email}</span></td>
        <td><strong>${fmtINR(t.amount)}</strong></td>
        <td>${t.net > 0 ? fmtINR(t.net) : '—'}</td>
        <td>${t.method}</td>
        <td><span class="status-pill ${t.status}">${t.status}</span></td>
        <td>${t.date}</td>
        <td>
          <button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem;" onclick="window.toucanApp.viewTxn('${t.id}')">Inspect</button>
        </td>
      </tr>
    `).join('');
  }

  function initTransactionsEvents() {
    const searchInput = $('#txn-search-input');
    const statusSelect = $('#txn-status-filter');
    const methodSelect = $('#txn-method-filter');

    function applyFilters() {
      const q = (searchInput?.value || '').toLowerCase();
      const st = statusSelect?.value || 'all';
      const m = methodSelect?.value || 'all';

      const filtered = state.transactions.filter(t => {
        const matchesQuery = t.id.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q) || t.email.toLowerCase().includes(q);
        const matchesStatus = (st === 'all') || (t.status === st);
        const matchesMethod = (m === 'all') || (t.method.includes(m));
        return matchesQuery && matchesStatus && matchesMethod;
      });

      const tbody = $('#txn-table-body');
      if (tbody) tbody.innerHTML = renderTxnRows(filtered);
    }

    searchInput?.addEventListener('input', applyFilters);
    statusSelect?.addEventListener('change', applyFilters);
    methodSelect?.addEventListener('change', applyFilters);

    $('#btn-export-csv')?.addEventListener('click', () => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + ["ID,Customer,Email,Amount,Method,Status,Date,RRN"]
        .concat(state.transactions.map(t => `${t.id},"${t.customer}",${t.email},${t.amount},"${t.method}",${t.status},"${t.date}",${t.rrn}`))
        .join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `toucan_transactions_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      notify("Transactions exported as CSV successfully!");
    });

    $('#btn-simulate-txn')?.addEventListener('click', () => {
      const simulated = {
        id: uid('txn_'),
        customer: 'Simulated Merchant Buyer',
        email: 'buyer_' + Math.floor(Math.random()*1000) + '@example.in',
        amount: Math.floor(Math.random() * 5000 + 200),
        method: 'UPI (QR Code)',
        status: 'captured',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        rrn: '6298' + Math.floor(Math.random()*10000000),
        fee: 4.5,
        gst: 0.81,
        net: 450
      };
      simulated.net = simulated.amount - simulated.fee - simulated.gst;
      state.transactions.unshift(simulated);
      notify(`Simulated payment of ${fmtINR(simulated.amount)} captured!`);
      applyFilters();
    });
  }

  // -------------------------------------------------------------
  // 3. Customer Management HTML & Logic
  // -------------------------------------------------------------
  function getCustomersHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Customer Management & Profiles</h1>
          <p>Customer payment history, lifetime value, stored mandates, and operational notes.</p>
        </div>
        <div class="app-topbar-controls">
          <button class="btn btn-primary" id="btn-add-customer">+ Add Customer</button>
        </div>
      </div>

      <div class="stat-cards-grid">
        <div class="stat-card">
          <div class="stat-header"><span>Total Customers</span><span>👥</span></div>
          <div class="stat-value">1,248</div>
          <div class="stat-footer"><span class="stat-pill positive">+38 this week</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-header"><span>Average Lifetime Value</span><span>📈</span></div>
          <div class="stat-value">₹4,890</div>
          <div class="stat-footer"><span class="stat-pill positive">+12% vs last month</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-header"><span>Repeat Payment Rate</span><span>🔄</span></div>
          <div class="stat-value">42.8%</div>
          <div class="stat-footer"><span class="stat-pill positive">Strong retention</span></div>
        </div>
      </div>

      <div class="panel-card">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Total Spent</th>
                <th>Payments Count</th>
                <th>Last Active</th>
                <th>Saved Methods</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Aarav Sharma</strong></td>
                <td>aarav@example.com</td>
                <td><strong>₹18,450</strong></td>
                <td>7 payments</td>
                <td>Today 10:14</td>
                <td><span class="status-pill success">UPI Mandate</span></td>
                <td><button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem;" onclick="window.toucanApp.viewCustomer('Aarav Sharma', 'aarav@example.com', '₹18,450', 7)">View Profile</button></td>
              </tr>
              <tr>
                <td><strong>Meera Kulkarni</strong></td>
                <td>meera@example.com</td>
                <td><strong>₹8,600</strong></td>
                <td>4 payments</td>
                <td>Today 09:42</td>
                <td><span class="status-pill success">Visa •••• 4242</span></td>
                <td><button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem;" onclick="window.toucanApp.viewCustomer('Meera Kulkarni', 'meera@example.com', '₹8,600', 4)">View Profile</button></td>
              </tr>
              <tr>
                <td><strong>Rohan Patel</strong></td>
                <td>rohan.p@example.com</td>
                <td><strong>₹45,000</strong></td>
                <td>3 payments</td>
                <td>Yesterday</td>
                <td><span class="status-pill pending">Net Banking</span></td>
                <td><button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem;" onclick="window.toucanApp.viewCustomer('Rohan Patel', 'rohan.p@example.com', '₹45,000', 3)">View Profile</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function initCustomersEvents() {
    $('#btn-add-customer')?.addEventListener('click', () => {
      notify("Customer creation dialog opened (demo).");
    });
  }

  // -------------------------------------------------------------
  // 4. Checkout Experience Module HTML & Logic
  // -------------------------------------------------------------
  function getCheckoutModuleHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Hosted & Embedded Checkout Simulator</h1>
          <p>Test the customer-facing payment journey: UPI QR, Cards with Luhn validation, 3DS authentication, and failure recovery.</p>
        </div>
        <div class="app-topbar-controls">
          <button class="btn btn-ghost" id="btn-reset-checkout">↻ Reset State</button>
        </div>
      </div>

      <div class="checkout-layout" style="display: grid; grid-template-columns: 1fr 1.1fr; gap: 24px; align-items: start;">
        <!-- Order Summary & Configuration -->
        <div class="panel-card">
          <div class="panel-card-header">
            <h2 class="panel-card-title">Order Summary</h2>
            <span class="status-pill pending">Live Session</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border); padding-bottom: 8px;">
              <span>Toucan Annual Cloud Suite</span>
              <strong>₹2,117.80</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border); padding-bottom: 8px;">
              <span>GST (18% on software services)</span>
              <strong>₹381.20</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; color: var(--accent); padding-top: 4px;">
              <span>Total Payable</span>
              <span id="co-total-payable">₹2,499.00</span>
            </div>
          </div>

          <div style="margin-top: 14px; background: var(--sub); padding: 12px; border-radius: 10px;">
            <label style="font-size: 0.82rem; font-weight: 700; color: var(--muted); display: block; margin-bottom: 6px;">APPLY COUPON CODE</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="co-coupon-input" placeholder="e.g. TOUCAN20" style="flex: 1; padding: 6px 10px; font-size: 0.85rem;">
              <button class="btn btn-primary" id="btn-apply-coupon" style="padding: 6px 12px; font-size: 0.82rem;">Apply</button>
            </div>
            <small id="co-coupon-msg" style="display: block; margin-top: 4px; font-size: 0.78rem;"></small>
          </div>

          <div style="font-size: 0.8rem; color: var(--muted); line-height: 1.5; margin-top: 10px;">
            🔒 256-bit TLS encrypted session · RBI PA-PG compliant · Tokenized card storage
          </div>
        </div>

        <!-- Interactive Checkout Component -->
        <div class="panel-card" style="box-shadow: 0 16px 36px rgba(15,23,42,0.08); border-color: #B8CDEC;">
          <div class="tab-pills" id="co-method-tabs" style="width: 100%; margin-bottom: 16px;">
            <button class="tab-pill active" data-method="card">💳 Card</button>
            <button class="tab-pill" data-method="upi">⚡ UPI / QR</button>
            <button class="tab-pill" data-method="nb">🏛️ Net Banking</button>
            <button class="tab-pill" data-method="wallet">👛 Wallet</button>
          </div>

          <!-- Card Form -->
          <form id="co-card-form" style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="font-size: 0.85rem; font-weight: 600;">Card Number</label>
              <div style="position: relative; margin-top: 4px;">
                <input type="text" id="co-card-num" value="4242 4242 4242 4242" maxlength="19" style="width: 100%; padding-right: 48px;">
                <span id="co-card-brand" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 0.75rem; font-weight: 700; color: var(--accent); background: #E8EEFB; padding: 2px 6px; border-radius: 4px;">VISA</span>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Expiry Date</label>
                <input type="text" id="co-card-exp" value="12/29" maxlength="5" style="width: 100%; margin-top: 4px;">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">CVV / CVC</label>
                <input type="password" id="co-card-cvv" value="123" maxlength="4" style="width: 100%; margin-top: 4px;">
              </div>
            </div>
            <div>
              <label style="font-size: 0.85rem; font-weight: 600;">Cardholder Name</label>
              <input type="text" id="co-card-name" value="Aarav Sharma" style="width: 100%; margin-top: 4px;">
            </div>
            <button class="btn btn-primary" id="btn-co-pay-card" type="button" style="padding: 12px; font-size: 1rem; margin-top: 8px;">Pay ₹2,499.00 Securely</button>
            <button class="btn btn-ghost" id="btn-co-fail-card" type="button" style="padding: 8px; font-size: 0.85rem;">Simulate Bank Decline</button>
          </form>

          <!-- UPI Form -->
          <div id="co-upi-pane" style="display: none; flex-direction: column; gap: 16px;">
            <div>
              <label style="font-size: 0.85rem; font-weight: 600;">Pay by UPI ID / VPA</label>
              <div style="display: flex; gap: 8px; margin-top: 4px;">
                <input type="text" id="co-upi-id" placeholder="yourname@okaxis" value="aarav@okhdfcbank" style="flex: 1;">
                <button class="btn btn-primary" id="btn-co-pay-upi" style="padding: 8px 14px;">Verify & Pay</button>
              </div>
            </div>
            <div style="text-align: center; margin: 8px 0; font-size: 0.8rem; color: var(--muted); position: relative;">
              <span>— OR SCAN QR CODE —</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; background: var(--sub); padding: 16px; border-radius: 12px;">
              <canvas id="co-upi-qr" width="140" height="140" style="background: #fff; padding: 6px; border-radius: 8px; border: 1px solid var(--border);"></canvas>
              <small style="color: var(--muted); font-size: 0.78rem;">Scan with GPay, PhonePe, Paytm, or BHIM</small>
              <button class="btn btn-ghost" id="btn-simulate-qr-scan" style="padding: 6px 12px; font-size: 0.8rem;">Simulate App Approval (3s)</button>
            </div>
          </div>

          <!-- Net Banking Form -->
          <div id="co-nb-pane" style="display: none; flex-direction: column; gap: 14px;">
            <label style="font-size: 0.85rem; font-weight: 600;">Popular Banks</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <button class="btn btn-ghost" style="text-align: left; padding: 8px;">🏛️ HDFC Bank</button>
              <button class="btn btn-ghost" style="text-align: left; padding: 8px;">🏛️ ICICI Bank</button>
              <button class="btn btn-ghost" style="text-align: left; padding: 8px;">🏛️ SBI</button>
              <button class="btn btn-ghost" style="text-align: left; padding: 8px;">🏛️ Axis Bank</button>
            </div>
            <button class="btn btn-primary" id="btn-co-pay-nb" style="padding: 12px; margin-top: 8px;">Proceed to Bank Portal</button>
          </div>

          <!-- Wallet Form -->
          <div id="co-wallet-pane" style="display: none; flex-direction: column; gap: 14px;">
            <label style="font-size: 0.85rem; font-weight: 600;">Select Wallet</label>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label class="row"><input type="radio" name="wal" checked> Paytm Wallet</label>
              <label class="row"><input type="radio" name="wal"> PhonePe Wallet</label>
              <label class="row"><input type="radio" name="wal"> Mobikwik</label>
            </div>
            <button class="btn btn-primary" id="btn-co-pay-wallet" style="padding: 12px; margin-top: 8px;">Link & Pay</button>
          </div>

          <!-- Checkout Outcome Status Box -->
          <div id="co-outcome-box" style="display: none; margin-top: 16px; padding: 18px; border-radius: 12px; text-align: center;"></div>
        </div>
      </div>
    `;
  }

  function initCheckoutModuleEvents() {
    // Method switcher
    const tabs = $$('#co-method-tabs .tab-pill');
    const cardForm = $('#co-card-form');
    const upiPane = $('#co-upi-pane');
    const nbPane = $('#co-nb-pane');
    const walPane = $('#co-wallet-pane');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const m = tab.dataset.method;
        if (cardForm) cardForm.style.display = m === 'card' ? 'flex' : 'none';
        if (upiPane) upiPane.style.display = m === 'upi' ? 'flex' : 'none';
        if (nbPane) nbPane.style.display = m === 'nb' ? 'flex' : 'none';
        if (walPane) walPane.style.display = m === 'wallet' ? 'flex' : 'none';
      });
    });

    // Draw mock QR
    const qrCanvas = $('#co-upi-qr');
    if (qrCanvas) {
      const ctx = qrCanvas.getContext('2d');
      ctx.fillStyle = '#172033';
      ctx.fillRect(10, 10, 30, 30);
      ctx.fillRect(100, 10, 30, 30);
      ctx.fillRect(10, 100, 30, 30);
      ctx.clearRect(16, 16, 18, 18);
      ctx.clearRect(106, 16, 18, 18);
      ctx.clearRect(16, 106, 18, 18);
      ctx.fillRect(20, 20, 10, 10);
      ctx.fillRect(110, 20, 10, 10);
      ctx.fillRect(20, 110, 10, 10);
      // random mock dots
      for (let i = 0; i < 40; i++) {
        const x = Math.floor(Math.random() * 20) * 6 + 10;
        const y = Math.floor(Math.random() * 20) * 6 + 10;
        ctx.fillRect(x, y, 4, 4);
      }
    }

    // Trigger Success / Decline
    function handlePaymentOutcome(isSuccess, reason = '') {
      const outcomeBox = $('#co-outcome-box');
      if (!outcomeBox) return;
      outcomeBox.style.display = 'block';

      if (isSuccess) {
        outcomeBox.style.background = 'var(--okbg)';
        outcomeBox.style.border = '1px solid #A4DEC0';
        outcomeBox.innerHTML = `
          <div style="font-size: 2rem;">✓</div>
          <h3 style="color: var(--ok); margin: 6px 0;">Payment Authorized & Captured!</h3>
          <p style="margin: 4px 0; font-size: 0.88rem;">Reference ID: <strong>txn_${Math.random().toString(36).substr(2,8)}</strong></p>
          <p style="font-size: 0.8rem; color: var(--muted);">₹2,499.00 paid · SMS & Email receipt dispatched.</p>
          <div style="margin-top: 12px; display: flex; gap: 8px; justify-content: center;">
            <button class="btn btn-ghost" style="padding: 6px 12px; font-size: 0.82rem;" onclick="window.toucanApp.downloadReceipt()">📄 Download Receipt</button>
            <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.82rem;" onclick="window.toucanApp.resetCheckout()">New Payment</button>
          </div>
        `;
      } else {
        outcomeBox.style.background = 'var(--errbg)';
        outcomeBox.style.border = '1px solid #F6B4B1';
        outcomeBox.innerHTML = `
          <div style="font-size: 2rem;">✕</div>
          <h3 style="color: var(--err); margin: 6px 0;">Payment Declined by Issuer Bank</h3>
          <p style="margin: 4px 0; font-size: 0.88rem;">${reason || 'Code: 51 - Insufficient funds or card daily transaction limit exceeded.'}</p>
          <p style="font-size: 0.8rem; color: var(--muted);">No funds were deducted from your account.</p>
          <button class="btn btn-primary" style="margin-top: 10px; padding: 6px 14px; font-size: 0.82rem;" onclick="window.toucanApp.resetCheckout()">Try Another Payment Mode</button>
        `;
      }
    }

    // 3DS OTP Simulation Modal trigger
    $('#btn-co-pay-card')?.addEventListener('click', () => {
      window.toucanApp.show3DSModal(() => handlePaymentOutcome(true));
    });
    $('#btn-co-fail-card')?.addEventListener('click', () => {
      handlePaymentOutcome(false, 'Issuer bank security check declined the card.');
    });
    $('#btn-co-pay-upi')?.addEventListener('click', () => {
      notify("UPI collect request dispatched to aarav@okhdfcbank");
      setTimeout(() => handlePaymentOutcome(true), 1500);
    });
    $('#btn-simulate-qr-scan')?.addEventListener('click', () => {
      notify("Simulating phone app QR scan...");
      setTimeout(() => handlePaymentOutcome(true), 2500);
    });
    $('#btn-co-pay-nb')?.addEventListener('click', () => {
      notify("Redirecting to simulated net banking portal...");
      setTimeout(() => handlePaymentOutcome(true), 1800);
    });
    $('#btn-co-pay-wallet')?.addEventListener('click', () => {
      handlePaymentOutcome(true);
    });
    $('#btn-reset-checkout')?.addEventListener('click', () => {
      window.toucanApp.resetCheckout();
    });

    // Coupon applicator
    $('#btn-apply-coupon')?.addEventListener('click', () => {
      const code = ($('#co-coupon-input')?.value || '').trim().toUpperCase();
      const msg = $('#co-coupon-msg');
      const total = $('#co-total-payable');
      if (code === 'TOUCAN20' || code === 'PAYFLOW20') {
        if (msg) { msg.style.color = 'var(--ok)'; msg.textContent = 'Coupon applied! ₹500 discount added.'; }
        if (total) total.textContent = '₹1,999.00';
      } else {
        if (msg) { msg.style.color = 'var(--err)'; msg.textContent = 'Invalid coupon code. Try TOUCAN20.'; }
      }
    });
  }

  // -------------------------------------------------------------
  // 5. Payment Links & No-Code Page Builder
  // -------------------------------------------------------------
  function getPaymentLinksHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Payment Links (No-Code Collections)</h1>
          <p>Create shareable payment links with QR codes, reminders, and partial payment support.</p>
        </div>
        <div class="app-topbar-controls">
          <button class="btn btn-primary" id="btn-create-link-wizard">+ Create Payment Link</button>
        </div>
      </div>

      <div class="panel-card">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Link Title</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th>Collections</th>
                <th>Shareable URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.links.map(l => `
                <tr>
                  <td><strong>${l.title}</strong></td>
                  <td><strong>${fmtINR(l.amount)}</strong></td>
                  <td><span class="status-pill ${l.status === 'active' ? 'success' : 'pending'}">${l.status}</span></td>
                  <td>${l.created}</td>
                  <td>${l.payments} payments</td>
                  <td><code class="table-code">${l.url}</code></td>
                  <td>
                    <button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem;" onclick="window.toucanApp.shareLink('${l.title}', '${l.url}', '${l.amount}')">Share & QR</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function initPaymentLinksEvents() {
    $('#btn-create-link-wizard')?.addEventListener('click', () => {
      window.toucanApp.showCreateLinkModal();
    });
  }

  function getPageBuilderHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>No-Code Payment Page Builder</h1>
          <p>Visual page customizer for digital goods, event tickets, fees, and donations with live preview.</p>
        </div>
        <div class="app-topbar-controls">
          <button class="btn btn-primary" id="btn-publish-page">🚀 Publish Hosted Page</button>
        </div>
      </div>

      <div class="page-builder-split">
        <!-- Editor Controls -->
        <div class="builder-controls">
          <h2 style="font-size: 1.15rem; font-weight: 700; margin: 0;">Page Customization</h2>

          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Page Title</label>
            <input type="text" id="builder-title" value="Bengaluru Tech Summit 2026 Ticket" style="width: 100%; margin-top: 4px;">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Description</label>
            <textarea id="builder-desc" rows="3" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; font: inherit; font-size: 0.85rem; margin-top: 4px;">All-access pass to keynote talks, deep-dive workshops, and networking dinner.</textarea>
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Fixed Amount (₹)</label>
            <input type="number" id="builder-amount" value="3499" style="width: 100%; margin-top: 4px;">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Brand Accent Color</label>
            <div style="display: flex; gap: 8px; margin-top: 4px; align-items: center;">
              <input type="color" id="builder-color" value="#2855C5" style="width: 44px; height: 38px; padding: 2px; border: 1px solid var(--border); border-radius: 6px; cursor: pointer;">
              <span id="builder-color-val" style="font-size: 0.85rem; font-family: monospace;">#2855C5</span>
            </div>
          </div>

          <div>
            <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 6px;">Customer Input Fields</label>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label class="row"><input type="checkbox" id="field-phone" checked> Require Mobile Phone (for SMS receipt)</label>
              <label class="row"><input type="checkbox" id="field-gstin" checked> Require GSTIN & Business Name</label>
              <label class="row"><input type="checkbox" id="field-address"> Require Shipping / Billing Address</label>
            </div>
          </div>
        </div>

        <!-- Live Preview Frame -->
        <div class="builder-preview-canvas">
          <div class="hosted-page-mockup" id="builder-mockup-frame">
            <div id="mock-header-banner" style="background: #2855C5; padding: 24px; color: #fff; text-align: center;">
              <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9;">Secure Checkout</div>
              <h3 id="mock-title" style="margin: 8px 0 4px; font-size: 1.25rem;">Bengaluru Tech Summit 2026 Ticket</h3>
              <div id="mock-amount" style="font-size: 1.6rem; font-weight: 800;">₹3,499.00</div>
            </div>
            <div style="padding: 20px; display: flex; flex-direction: column; gap: 14px; font-size: 0.85rem;">
              <p id="mock-desc" style="color: var(--muted); margin: 0;">All-access pass to keynote talks, deep-dive workshops, and networking dinner.</p>

              <div>
                <label style="font-size: 0.78rem; font-weight: 600; color: var(--muted);">FULL NAME</label>
                <input type="text" placeholder="John Doe" disabled style="width: 100%; margin-top: 2px; padding: 6px 10px; font-size: 0.85rem;">
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 600; color: var(--muted);">EMAIL ADDRESS</label>
                <input type="email" placeholder="john@example.com" disabled style="width: 100%; margin-top: 2px; padding: 6px 10px; font-size: 0.85rem;">
              </div>
              <div id="mock-phone-group">
                <label style="font-size: 0.78rem; font-weight: 600; color: var(--muted);">MOBILE PHONE</label>
                <input type="tel" placeholder="+91 98765 43210" disabled style="width: 100%; margin-top: 2px; padding: 6px 10px; font-size: 0.85rem;">
              </div>
              <div id="mock-gstin-group">
                <label style="font-size: 0.78rem; font-weight: 600; color: var(--muted);">BUSINESS GSTIN</label>
                <input type="text" placeholder="29AAAAA0000A1Z5" disabled style="width: 100%; margin-top: 2px; padding: 6px 10px; font-size: 0.85rem;">
              </div>

              <button id="mock-pay-btn" class="btn btn-primary" style="background: #2855C5; width: 100%; padding: 10px; margin-top: 6px;" disabled>Pay ₹3,499.00</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function initPageBuilderEvents() {
    const titleInput = $('#builder-title');
    const descInput = $('#builder-desc');
    const amountInput = $('#builder-amount');
    const colorInput = $('#builder-color');
    const phoneCheck = $('#field-phone');
    const gstinCheck = $('#field-gstin');

    function syncPreview() {
      const title = titleInput?.value || 'Untitled Payment Page';
      const desc = descInput?.value || '';
      const amt = Number(amountInput?.value || 0);
      const color = colorInput?.value || '#2855C5';

      if ($('#mock-title')) $('#mock-title').textContent = title;
      if ($('#mock-desc')) $('#mock-desc').textContent = desc;
      if ($('#mock-amount')) $('#mock-amount').textContent = fmtINR(amt);
      if ($('#mock-pay-btn')) {
        $('#mock-pay-btn').textContent = `Pay ${fmtINR(amt)}`;
        $('#mock-pay-btn').style.background = color;
      }
      if ($('#mock-header-banner')) $('#mock-header-banner').style.background = color;
      if ($('#builder-color-val')) $('#builder-color-val').textContent = color;

      if ($('#mock-phone-group')) $('#mock-phone-group').style.display = phoneCheck?.checked ? 'block' : 'none';
      if ($('#mock-gstin-group')) $('#mock-gstin-group').style.display = gstinCheck?.checked ? 'block' : 'none';
    }

    titleInput?.addEventListener('input', syncPreview);
    descInput?.addEventListener('input', syncPreview);
    amountInput?.addEventListener('input', syncPreview);
    colorInput?.addEventListener('input', syncPreview);
    phoneCheck?.addEventListener('change', syncPreview);
    gstinCheck?.addEventListener('change', syncPreview);

    $('#btn-publish-page')?.addEventListener('click', () => {
      notify("Payment page published live at https://pay.toucan.example/pages/tech-summit-2026");
    });
  }

  // -------------------------------------------------------------
  // 6. Billing, Subscriptions, and Invoices
  // -------------------------------------------------------------
  function getSubscriptionsHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Subscriptions & Recurring Billing</h1>
          <p>Manage subscription plans, recurring UPI & card mandates, dunning retries, and proration.</p>
        </div>
        <div class="app-topbar-controls">
          <button class="btn btn-primary" id="btn-create-plan">+ Create New Plan</button>
        </div>
      </div>

      <div class="stat-cards-grid">
        <div class="stat-card">
          <div class="stat-header"><span>Monthly Recurring Revenue (MRR)</span><span>🔄</span></div>
          <div class="stat-value">₹3,48,900</div>
          <div class="stat-footer"><span class="stat-pill positive">+18.4% MRR growth</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-header"><span>Active Subscriptions</span><span>👥</span></div>
          <div class="stat-value">342</div>
          <div class="stat-footer"><span class="stat-pill positive">312 active · 30 trialing</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-header"><span>Monthly Churn Rate</span><span>📉</span></div>
          <div class="stat-value">1.4%</div>
          <div class="stat-footer"><span class="stat-pill positive">Well below 3% target</span></div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-card-header">
          <h2 class="panel-card-title">Available Subscription Plans</h2>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Billing Interval</th>
                <th>Price</th>
                <th>Subscribers</th>
                <th>Trial Period</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Starter Cloud</strong></td>
                <td>Monthly</td>
                <td>₹999 / mo</td>
                <td>148 users</td>
                <td>14 days</td>
                <td><span class="status-pill success">Active</span></td>
                <td><button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem;" onclick="window.toucanApp.editPlan('Starter Cloud')">Edit</button></td>
              </tr>
              <tr>
                <td><strong>Growth Pro</strong></td>
                <td>Monthly</td>
                <td>₹2,999 / mo</td>
                <td>154 users</td>
                <td>None</td>
                <td><span class="status-pill success">Active</span></td>
                <td><button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem;" onclick="window.toucanApp.editPlan('Growth Pro')">Edit</button></td>
              </tr>
              <tr>
                <td><strong>Enterprise Scale</strong></td>
                <td>Annual</td>
                <td>₹79,990 / yr</td>
                <td>40 users</td>
                <td>30 days</td>
                <td><span class="status-pill success">Active</span></td>
                <td><button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem;" onclick="window.toucanApp.editPlan('Enterprise Scale')">Edit</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function initSubscriptionsEvents() {
    $('#btn-create-plan')?.addEventListener('click', () => {
      notify("Plan creator modal triggered (demo).");
    });
  }

  function getInvoicesHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>GST Invoicing & Billing Portal</h1>
          <p>Generate compliant GST tax invoices, track payment status, and dispatch PDF receipts.</p>
        </div>
        <div class="app-topbar-controls">
          <button class="btn btn-primary" id="btn-create-invoice">+ Create GST Invoice</button>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-card-header">
          <h2 class="panel-card-title">Issued Invoices</h2>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client / Entity</th>
                <th>Total Amount</th>
                <th>GST (18%)</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.invoices.map(inv => `
                <tr>
                  <td><code class="table-code">${inv.id}</code></td>
                  <td><strong>${inv.customer}</strong></td>
                  <td><strong>${fmtINR(inv.amount)}</strong></td>
                  <td>${fmtINR(inv.gst)}</td>
                  <td><span class="status-pill ${inv.status === 'paid' ? 'success' : (inv.status === 'sent' ? 'pending' : 'failed')}">${inv.status}</span></td>
                  <td>${inv.dueDate}</td>
                  <td>
                    <button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem;" onclick="window.toucanApp.viewInvoice('${inv.id}')">View / Print PDF</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function initInvoicesEvents() {
    $('#btn-create-invoice')?.addEventListener('click', () => {
      window.toucanApp.showCreateInvoiceModal();
    });
  }

  // -------------------------------------------------------------
  // 7. Settlements, Payouts, and Reconciliation
  // -------------------------------------------------------------
  function getSettlementsHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Settlements & Balance Ledger</h1>
          <p>Available balances, automated bank deposits, UTR tracking, and fee reconciliation.</p>
        </div>
        <div class="app-topbar-controls">
          <button class="btn btn-ghost" id="btn-download-settlement-rep">📥 Settlement Report</button>
          <button class="btn btn-primary" id="btn-instant-settle">⚡ Instant Settle Now</button>
        </div>
      </div>

      <div class="stat-cards-grid">
        <div class="stat-card">
          <div class="stat-header"><span>Available Settlement Balance</span><span>💰</span></div>
          <div class="stat-value">₹1,84,320</div>
          <div class="stat-footer"><span class="stat-pill positive">Ready for payout</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-header"><span>In-Transit Clearing (T+1)</span><span>⏳</span></div>
          <div class="stat-value">₹42,800</div>
          <div class="stat-footer"><span>Settling tomorrow 11:00 AM</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-header"><span>Risk Reserve Held (5%)</span><span>🛡️</span></div>
          <div class="stat-value">₹12,500</div>
          <div class="stat-footer"><span>Auto-released after 90 days</span></div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-card-header">
          <h2 class="panel-card-title">Settlement Batches & Bank UTR Numbers</h2>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Settled Date</th>
                <th>Gross Volume</th>
                <th>Deductions (MDR + GST)</th>
                <th>Net Deposited</th>
                <th>Bank UTR Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code class="table-code">set_8812a</code></td>
                <td>2026-10-26</td>
                <td>₹2,48,000</td>
                <td>- ₹4,960</td>
                <td><strong>₹2,43,040</strong></td>
                <td><code class="table-code">HDFCR52026102609812</code></td>
                <td><span class="status-pill success">Deposited</span></td>
              </tr>
              <tr>
                <td><code class="table-code">set_7719b</code></td>
                <td>2026-10-25</td>
                <td>₹1,95,400</td>
                <td>- ₹3,908</td>
                <td><strong>₹1,91,492</strong></td>
                <td><code class="table-code">HDFCR52026102511048</code></td>
                <td><span class="status-pill success">Deposited</span></td>
              </tr>
              <tr>
                <td><code class="table-code">set_6604c</code></td>
                <td>2026-10-24</td>
                <td>₹3,12,000</td>
                <td>- ₹6,240</td>
                <td><strong>₹3,05,760</strong></td>
                <td><code class="table-code">HDFCR52026102488102</code></td>
                <td><span class="status-pill success">Deposited</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function initSettlementsEvents() {
    $('#btn-instant-settle')?.addEventListener('click', () => {
      notify("Instant settlement of ₹1,84,320 initiated to registered HDFC Current Account (UTR will generate in 60s).");
    });
    $('#btn-download-settlement-rep')?.addEventListener('click', () => {
      notify("Downloading settlement reconciliation statement (XLSX/CSV)...");
    });
  }

  function getPayoutsHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Direct Payouts & Vendor Disbursements</h1>
          <p>Instant IMPS & NEFT transfers for vendor payments, refunds, and payroll with maker-checker approvals.</p>
        </div>
        <div class="app-topbar-controls">
          <button class="btn btn-primary" id="btn-create-payout">+ New Payout</button>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-card-header">
          <h2 class="panel-card-title">Recent Payout Records</h2>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Payout ID</th>
                <th>Beneficiary Name</th>
                <th>Account / UPI</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Purpose</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code class="table-code">pout_112a</code></td>
                <td>Apex Logistics Pvt Ltd</td>
                <td>HDFC0000128 - •••• 4019</td>
                <td><strong>₹18,500</strong></td>
                <td>IMPS</td>
                <td>Vendor settlement</td>
                <td><span class="status-pill success">Processed</span></td>
              </tr>
              <tr>
                <td><code class="table-code">pout_339b</code></td>
                <td>Vikram Singhania</td>
                <td>vikram@icici</td>
                <td><strong>₹4,200</strong></td>
                <td>UPI</td>
                <td>Customer refund</td>
                <td><span class="status-pill success">Processed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function initPayoutsEvents() {
    $('#btn-create-payout')?.addEventListener('click', () => {
      window.toucanApp.showCreatePayoutModal();
    });
  }

  // -------------------------------------------------------------
  // 8. Marketplace & Connected Accounts
  // -------------------------------------------------------------
  function getMarketplaceHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Marketplace & Split Payments</h1>
          <p>Multi-vendor seller onboarding, automated commission splits, and escrow transfers.</p>
        </div>
        <div class="app-topbar-controls">
          <button class="btn btn-primary" id="btn-onboard-seller">+ Onboard Connected Seller</button>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-card-header">
          <h2 class="panel-card-title">Split Payment Simulator</h2>
          <p class="panel-card-subtitle">Calculate platform commission and automated seller balance transfers.</p>
        </div>
        <div class="split-simulator-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center;">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="font-size: 0.85rem; font-weight: 600;">Customer Order Total (₹)</label>
              <input type="number" id="split-order-amt" value="10000" style="width: 100%; margin-top: 4px;">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Platform Take Rate (%)</label>
                <input type="number" id="split-take-rate" value="10" style="width: 100%; margin-top: 4px;">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Fixed Platform Fee (₹)</label>
                <input type="number" id="split-fixed-fee" value="15" style="width: 100%; margin-top: 4px;">
              </div>
            </div>
          </div>
          <div style="background: var(--sub); padding: 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between;">
              <span>Platform Commission Retained:</span>
              <strong id="split-platform-share" style="color: var(--accent);">₹1,015.00</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Seller Transfer Amount:</span>
              <strong id="split-seller-share" style="color: var(--ok);">₹8,985.00</strong>
            </div>
            <div style="font-size: 0.78rem; color: var(--muted); margin-top: 4px;">
              Funds are automatically routed to seller's connected account upon order capture.
            </div>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-card-header">
          <h2 class="panel-card-title">Connected Sellers Directory</h2>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Seller Name</th>
                <th>Contact</th>
                <th>Available Balance</th>
                <th>KYC Status</th>
                <th>Commission</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.sellers.map(s => `
                <tr>
                  <td><strong>${s.name}</strong></td>
                  <td>${s.email}</td>
                  <td><strong>${fmtINR(s.balance)}</strong></td>
                  <td><span class="status-pill ${s.kyc === 'verified' ? 'success' : 'pending'}">${s.kyc}</span></td>
                  <td>${s.commission}</td>
                  <td><button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem;">Inspect Seller</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function initMarketplaceEvents() {
    const amtInput = $('#split-order-amt');
    const rateInput = $('#split-take-rate');
    const feeInput = $('#split-fixed-fee');

    function updateSplit() {
      const amt = Number(amtInput?.value || 0);
      const rate = Number(rateInput?.value || 0);
      const fixed = Number(feeInput?.value || 0);
      const platform = (amt * (rate / 100)) + fixed;
      const seller = Math.max(0, amt - platform);

      if ($('#split-platform-share')) $('#split-platform-share').textContent = fmtINR(platform);
      if ($('#split-seller-share')) $('#split-seller-share').textContent = fmtINR(seller);
    }

    amtInput?.addEventListener('input', updateSplit);
    rateInput?.addEventListener('input', updateSplit);
    feeInput?.addEventListener('input', updateSplit);
  }

  // -------------------------------------------------------------
  // 9. Developer Portal & API Management
  // -------------------------------------------------------------
  function getDevelopersHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Developer Portal & API Engine</h1>
          <p>Interactive runnable API console, restricted API keys, and real-time request logs.</p>
        </div>
        <div class="app-topbar-controls">
          <button class="btn btn-ghost" id="btn-roll-keys">🔄 Roll API Keys</button>
          <button class="btn btn-primary" id="btn-new-key">+ Generate API Key</button>
        </div>
      </div>

      <div class="stat-cards-grid">
        <div class="stat-card">
          <div class="stat-header"><span>API Requests (Last 24h)</span><span>📊</span></div>
          <div class="stat-value">124,912</div>
          <div class="stat-footer"><span class="stat-pill positive">99.99% uptime</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-header"><span>Average Latency</span><span>⚡</span></div>
          <div class="stat-value">48 ms</div>
          <div class="stat-footer"><span class="stat-pill positive">Global Edge Network</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-header"><span>Rate Limit Status</span><span>🛡️</span></div>
          <div class="stat-value">180 / 1,000</div>
          <div class="stat-footer"><span>Per second threshold</span></div>
        </div>
      </div>

      <!-- Runnable API Console -->
      <div class="panel-card">
        <div class="panel-card-header">
          <h2 class="panel-card-title">Interactive API Reference Playground</h2>
          <div class="tab-pills" id="api-lang-tabs">
            <button class="tab-pill active" data-lang="curl">cURL</button>
            <button class="tab-pill" data-lang="node">Node.js</button>
            <button class="tab-pill" data-lang="python">Python</button>
            <button class="tab-pill" data-lang="go">Go</button>
          </div>
        </div>

        <div class="dev-console-grid">
          <div class="console-pane">
            <div class="console-header">
              <span>POST https://api.toucan.example/v1/orders</span>
              <button class="btn btn-primary" id="btn-run-api" style="padding: 4px 10px; font-size: 0.8rem;">▶ Run Request</button>
            </div>
            <pre class="console-code-area" id="api-request-code"></pre>
          </div>

          <div class="console-pane">
            <div class="console-header">
              <span id="api-response-status" style="color: var(--ok);">HTTP 200 OK · 46ms</span>
              <button class="btn btn-ghost" id="btn-copy-response" style="padding: 4px 10px; font-size: 0.8rem;">Copy JSON</button>
            </div>
            <pre class="console-code-area" id="api-response-code" style="color: #6EE7B7;"></pre>
          </div>
        </div>
      </div>

      <!-- Active API Keys -->
      <div class="panel-card">
        <div class="panel-card-header">
          <h2 class="panel-card-title">API Credentials (Test Mode)</h2>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Key Name</th>
                <th>Public Publishable Key</th>
                <th>Secret Key</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Primary Store Key</strong></td>
                <td><code class="table-code">pk_test_51Mz00294108412</code></td>
                <td><code>••••••••••••••••••••••••••••••••</code></td>
                <td>2026-10-14</td>
                <td>
                  <button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem;" onclick="window.toucanApp.revealKey()">Reveal Once</button>
                  <button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem; color: var(--err);" onclick="window.toucanApp.revokeKey()">Revoke</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function initDevelopersEvents() {
    const codeReqs = {
      curl: `curl https://api.toucan.example/v1/orders \\\n  -u key_test_981a8c:secret_7721 \\\n  -d amount=249900 \\\n  -d currency=INR \\\n  -d receipt="order_rcpt_102"`,
      node: `const toucan = require('toucan')('key_test_981a8c');\n\nconst order = await toucan.orders.create({\n  amount: 249900, // in paise\n  currency: 'INR',\n  receipt: 'order_rcpt_102'\n});\nconsole.log(order.id);`,
      python: `import toucan\n\nclient = toucan.Client(auth=("key_test_981a8c", "secret_7721"))\norder = client.order.create({\n    'amount': 249900,\n    'currency': 'INR',\n    'receipt': 'order_rcpt_102'\n})\nprint(order['id'])`,
      go: `package main\nimport (\n  "fmt"\n  toucan "github.com/toucan/toucan-go"\n)\n\nfunc main() {\n  client := toucan.NewClient("key_test_981a8c")\n  order, _ := client.Order.Create(map[string]interface{}{\n    "amount": 249900,\n    "currency": "INR",\n  })\n  fmt.Println(order.ID)\n}`
    };

    const sampleResponses = {
      order: `{\n  "id": "order_77a192b0",\n  "entity": "order",\n  "amount": 249900,\n  "amount_paid": 0,\n  "amount_due": 249900,\n  "currency": "INR",\n  "receipt": "order_rcpt_102",\n  "status": "created",\n  "attempts": 0,\n  "created_at": 1793108420\n}`
    };

    let activeLang = 'curl';
    const reqArea = $('#api-request-code');
    const resArea = $('#api-response-code');

    function syncCode() {
      if (reqArea) reqArea.textContent = codeReqs[activeLang];
      if (resArea) resArea.textContent = sampleResponses.order;
    }
    syncCode();

    $$('#api-lang-tabs .tab-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('#api-lang-tabs .tab-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeLang = btn.dataset.lang;
        syncCode();
      });
    });

    $('#btn-run-api')?.addEventListener('click', () => {
      if (resArea) resArea.textContent = '// Dispatching API request to https://api.toucan.example/v1/orders...';
      setTimeout(() => {
        if (resArea) resArea.textContent = sampleResponses.order;
        notify("API execution completed with HTTP 200 OK!");
      }, 350);
    });

    $('#btn-copy-response')?.addEventListener('click', () => {
      navigator.clipboard?.writeText(sampleResponses.order);
      notify("JSON response copied to clipboard!");
    });
  }

  // -------------------------------------------------------------
  // 10. Webhooks & Logs
  // -------------------------------------------------------------
  function getWebhooksHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Webhook Endpoints & Delivery Logs</h1>
          <p>Real-time event subscriptions, payload inspect, and automatic retry/replay controls.</p>
        </div>
        <div class="app-topbar-controls">
          <button class="btn btn-ghost" id="btn-test-ping-webhook">⚡ Ping Webhook</button>
          <button class="btn btn-primary" id="btn-add-webhook">+ Add Webhook Endpoint</button>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-card-header">
          <h2 class="panel-card-title">Configured Endpoints</h2>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Target Endpoint URL</th>
                <th>Subscribed Events</th>
                <th>Health Status</th>
                <th>Signing Secret</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>https://api.merchant.com/v1/toucan/webhook</code></td>
                <td><span class="status-pill success">payment.captured</span> <span class="status-pill refunded">refund.processed</span></td>
                <td><span class="status-pill success">99.8% OK</span></td>
                <td><code class="table-code">whsec_99182a4...</code></td>
                <td>
                  <button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem;">Edit</button>
                  <button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem; color: var(--err);">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-card-header">
          <h2 class="panel-card-title">Event Delivery Attempt History</h2>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Event Type</th>
                <th>Destination</th>
                <th>HTTP Response</th>
                <th>Latency</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.webhooks.map(w => `
                <tr>
                  <td><code class="table-code">${w.id}</code></td>
                  <td><strong>${w.event}</strong></td>
                  <td>${w.url}</td>
                  <td><span class="status-pill ${w.status === 200 ? 'success' : 'failed'}">${w.status}</span></td>
                  <td>${w.duration}</td>
                  <td>${w.time}</td>
                  <td>
                    <button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem;" onclick="window.toucanApp.replayWebhook('${w.id}')">↻ Replay</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function initWebhooksEvents() {
    $('#btn-test-ping-webhook')?.addEventListener('click', () => {
      notify("Sent sample 'payment.captured' ping event -> Received HTTP 200 OK!");
    });
    $('#btn-add-webhook')?.addEventListener('click', () => {
      notify("Add Webhook modal triggered (demo).");
    });
  }

  // -------------------------------------------------------------
  // 11. Sandbox Transaction Simulator
  // -------------------------------------------------------------
  function getSandboxHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Sandbox Scenario Simulator</h1>
          <p>Reproduce tricky edge cases: bank downtimes, 3DS timeouts, network drops, and duplicate submits.</p>
        </div>
      </div>

      <div class="stat-cards-grid">
        <div class="stat-card" style="cursor: pointer;" onclick="window.toucanApp.triggerSandbox('success')">
          <div class="stat-header"><span>Scenario 01</span><span>✓</span></div>
          <h3 style="margin: 6px 0;">Simulate Instant Success</h3>
          <p style="font-size: 0.85rem; color: var(--muted); margin: 0;">Triggers payment.captured webhook, creates invoice, and updates settlement ledger.</p>
        </div>
        <div class="stat-card" style="cursor: pointer;" onclick="window.toucanApp.triggerSandbox('insufficient_funds')">
          <div class="stat-header"><span>Scenario 02</span><span>⚠️</span></div>
          <h3 style="margin: 6px 0;">Simulate Card Decline</h3>
          <p style="font-size: 0.85rem; color: var(--muted); margin: 0;">Simulates ISO 8583 error 51 (insufficient funds) with user recovery guidance.</p>
        </div>
        <div class="stat-card" style="cursor: pointer;" onclick="window.toucanApp.triggerSandbox('bank_down')">
          <div class="stat-header"><span>Scenario 03</span><span>🏛️</span></div>
          <h3 style="margin: 6px 0;">Simulate Bank Gateway Outage</h3>
          <p style="font-size: 0.85rem; color: var(--muted); margin: 0;">Simulates HDFC Netbanking downtime and triggers automatic dynamic rerouting to ICICI.</p>
        </div>
        <div class="stat-card" style="cursor: pointer;" onclick="window.toucanApp.triggerSandbox('dispute')">
          <div class="stat-header"><span>Scenario 04</span><span>⚖️</span></div>
          <h3 style="margin: 6px 0;">Simulate Incoming Chargeback</h3>
          <p style="font-size: 0.85rem; color: var(--muted); margin: 0;">Creates a dispute ticket with a 7-day evidence countdown timer in the risk desk.</p>
        </div>
      </div>
    `;
  }

  function initSandboxEvents() {}

  // -------------------------------------------------------------
  // 12. Risk, Fraud & Compliance Desk
  // -------------------------------------------------------------
  function getRiskHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Fraud Detection & Risk Review Desk</h1>
          <p>Real-time transaction risk scoring (0–100), velocity limits, rule engine, and allow/block lists.</p>
        </div>
        <div class="app-topbar-controls">
          <button class="btn btn-primary" id="btn-add-fraud-rule">+ Create Risk Rule</button>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-card-header">
          <h2 class="panel-card-title">Manual Review Queue (High Risk Flagged)</h2>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Risk ID</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Risk Score</th>
                <th>Flagged Risk Indicators</th>
                <th>Decision Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.riskQueue.map(r => `
                <tr>
                  <td><code class="table-code">${r.id}</code></td>
                  <td><code>${r.txnId}</code></td>
                  <td><strong>${fmtINR(r.amount)}</strong></td>
                  <td><span class="status-pill ${r.score > 75 ? 'failed' : 'pending'}">${r.score} / 100</span></td>
                  <td>${r.reason}</td>
                  <td>
                    <button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem; color: var(--ok);" onclick="window.toucanApp.resolveRisk('${r.id}', 'approve')">✓ Approve</button>
                    <button class="btn btn-ghost" style="padding: 4px 8px; font-size: 0.78rem; color: var(--err);" onclick="window.toucanApp.resolveRisk('${r.id}', 'block')">✕ Block & Refund</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-card-header">
          <h2 class="panel-card-title">Allowlist & Blocklist Management</h2>
        </div>
        <div class="risk-list-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="background: var(--sub); padding: 16px; border-radius: 12px;">
            <h3 style="margin: 0 0 8px; font-size: 0.95rem; color: var(--err);">🚫 Blocked Entities (Auto-Decline)</h3>
            <ul style="margin: 0; padding-left: 20px; font-size: 0.85rem; color: var(--muted); line-height: 1.8;">
              <li>Card BIN: <code>400000******</code> (Known test fraud BIN)</li>
              <li>Email domain: <code>@tempmail.ninja</code> (Disposable emails)</li>
              <li>IP Subnet: <code>185.220.101.0/24</code> (High-risk Tor relays)</li>
            </ul>
          </div>
          <div style="background: var(--sub); padding: 16px; border-radius: 12px;">
            <h3 style="margin: 0 0 8px; font-size: 0.95rem; color: var(--ok);">✓ Trusted Allowlist (Bypass 3DS Step-Up)</h3>
            <ul style="margin: 0; padding-left: 20px; font-size: 0.85rem; color: var(--muted); line-height: 1.8;">
              <li>Customer: <code>aarav@example.com</code> (VIP Customer)</li>
              <li>Entity: <code>Acme Cloud Inc.</code> (Corporate whitelisted)</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function initRiskEvents() {
    $('#btn-add-fraud-rule')?.addEventListener('click', () => {
      notify("Rule Builder dialog triggered (e.g. Block payments > ₹50,000 from international IPs).");
    });
  }

  // -------------------------------------------------------------
  // 13. Settings & Organization Profile
  // -------------------------------------------------------------
  function getSettingsHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Settings & Team Access Control</h1>
          <p>Merchant legal profile, branding themes, team role permissions, and Two-Factor Authentication (2FA).</p>
        </div>
      </div>

      <div class="panel-card">
        <h2 class="panel-card-title">Merchant Legal & Tax Profile</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Registered Entity Name</label>
            <input type="text" value="Toucan Technologies Private Limited" style="width: 100%; margin-top: 4px;">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">GSTIN Number</label>
            <input type="text" value="29AABCP1234F1Z9" style="width: 100%; margin-top: 4px;">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Company PAN</label>
            <input type="text" value="AABCP1234F" style="width: 100%; margin-top: 4px;">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Settlement Bank IFSC & Account</label>
            <input type="text" value="HDFC0000128 - A/C •••• 9812" style="width: 100%; margin-top: 4px;" disabled>
          </div>
        </div>
        <button class="btn btn-primary" style="align-self: flex-start; margin-top: 10px;" onclick="window.toucanApp.notify('Business details saved.')">Save Settings</button>
      </div>

      <div class="panel-card">
        <div class="panel-card-header">
          <h2 class="panel-card-title">Team Members & Permissions (RBAC)</h2>
          <button class="btn btn-ghost" id="btn-invite-team" style="font-size: 0.82rem; padding: 6px 12px;">+ Invite Member</button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Assigned Role</th>
                <th>2FA Status</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Aarav Sharma</strong></td>
                <td>aarav@toucan.example</td>
                <td><span class="status-pill success">Owner / Super-Admin</span></td>
                <td><span class="status-pill success">Enabled</span></td>
                <td>Active now</td>
              </tr>
              <tr>
                <td><strong>Pooja Singhania</strong></td>
                <td>pooja@toucan.example</td>
                <td><span class="status-pill pending">Finance Manager</span></td>
                <td><span class="status-pill success">Enabled</span></td>
                <td>Yesterday</td>
              </tr>
              <tr>
                <td><strong>Kunal Verma</strong></td>
                <td>kunal@toucan.example</td>
                <td><span class="status-pill authorized">Developer</span></td>
                <td><span class="status-pill success">Enabled</span></td>
                <td>3 days ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function initSettingsEvents() {
    $('#btn-invite-team')?.addEventListener('click', () => {
      notify("Team invitation link generated.");
    });
  }

  // -------------------------------------------------------------
  // 14. Super-Admin & Operations Console
  // -------------------------------------------------------------
  function getSuperAdminHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Internal Super-Admin & Operations Console</h1>
          <p>Platform-wide GMV, multi-gateway health monitoring, intelligent routing rules, and merchant approvals.</p>
        </div>
      </div>

      <div class="stat-cards-grid">
        <div class="stat-card">
          <div class="stat-header"><span>Platform-Wide 30D GMV</span><span>🌐</span></div>
          <div class="stat-value">₹48.2 Cr</div>
          <div class="stat-footer"><span class="stat-pill positive">+24% MoM</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-header"><span>Active Platform Merchants</span><span>🏢</span></div>
          <div class="stat-value">4,120</div>
          <div class="stat-footer"><span class="stat-pill positive">38 pending review</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-header"><span>Net Platform Fee Revenue</span><span>💰</span></div>
          <div class="stat-value">₹96.4 Lakh</div>
          <div class="stat-footer"><span class="stat-pill positive">2.0% average take rate</span></div>
        </div>
      </div>

      <div class="panel-card">
        <h2 class="panel-card-title">Multi-Provider Gateway Health & Fallback Routing</h2>
        <div class="provider-status-grid">
          <div class="provider-box">
            <div class="provider-box-header">
              <span class="provider-name">HDFC Gateway</span>
              <span class="provider-pulse"></span>
            </div>
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--ok);">99.98%</div>
            <span style="font-size: 0.78rem; color: var(--muted);">Latency: 42ms · Routing 40%</span>
          </div>
          <div class="provider-box">
            <div class="provider-box-header">
              <span class="provider-name">ICICI Gateway</span>
              <span class="provider-pulse"></span>
            </div>
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--ok);">99.94%</div>
            <span style="font-size: 0.78rem; color: var(--muted);">Latency: 51ms · Routing 35%</span>
          </div>
          <div class="provider-box">
            <div class="provider-box-header">
              <span class="provider-name">Axis Direct UPI</span>
              <span class="provider-pulse degraded"></span>
            </div>
            <div style="font-size: 1.25rem; font-weight: 800; color: #EAB308;">94.20%</div>
            <span style="font-size: 0.78rem; color: var(--muted);">Degraded: Auto-failover to SBI</span>
          </div>
          <div class="provider-box">
            <div class="provider-box-header">
              <span class="provider-name">SBI Gateway</span>
              <span class="provider-pulse"></span>
            </div>
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--ok);">99.10%</div>
            <span style="font-size: 0.78rem; color: var(--muted);">Latency: 68ms · Fallback target</span>
          </div>
        </div>
      </div>
    `;
  }

  function initSuperAdminEvents() {}

  // -------------------------------------------------------------
  // 15. Onboarding & KYC Wizard
  // -------------------------------------------------------------
  function getOnboardingWizardHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Merchant Onboarding & KYC Verification Wizard</h1>
          <p>5-step automated workflow: business profile, promoter identity, bank penny-drop, and RBI consent.</p>
        </div>
      </div>

      <div class="panel-card" style="max-width: 800px; margin: 0 auto; width: 100%;">
        <div class="onboarding-steps" style="display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px; font-size: 0.85rem; font-weight: 600;">
          <span style="color: var(--accent);">01. Profile & Constitution</span>
          <span style="color: var(--accent);">02. Industry & Website</span>
          <span style="color: var(--accent);">03. Promoters PAN</span>
          <span style="color: var(--accent);">04. Bank Penny Drop</span>
          <span style="color: var(--accent);">05. Approval</span>
        </div>

        <form id="onboarding-form" style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Business Constitution</label>
            <select style="width: 100%; margin-top: 4px;">
              <option>Private Limited Company (Pvt Ltd)</option>
              <option>Sole Proprietorship</option>
              <option>Limited Liability Partnership (LLP)</option>
              <option>Partnership Firm</option>
            </select>
          </div>
          <div class="onboarding-form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 0.85rem; font-weight: 600;">Business Legal Name</label>
              <input type="text" value="Apex Cloud Solutions Pvt Ltd" style="width: 100%; margin-top: 4px;">
            </div>
            <div>
              <label style="font-size: 0.85rem; font-weight: 600;">Company PAN</label>
              <input type="text" value="AABCA1234D" style="width: 100%; margin-top: 4px;">
            </div>
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Settlement Bank Account & IFSC</label>
            <div class="onboarding-form-grid" style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 10px; margin-top: 4px;">
              <input type="text" value="50200088192019" placeholder="Account Number">
              <input type="text" value="HDFC0000128" placeholder="IFSC Code">
            </div>
          </div>
          <div style="background: var(--sub); padding: 14px; border-radius: 10px; font-size: 0.85rem;">
            <strong>Penny-Drop Bank Verification Status:</strong>
            <div style="color: var(--ok); margin-top: 4px; display: flex; align-items: center; gap: 6px;">
              <span>✓ Verified</span> — Name matched: "APEX CLOUD SOLUTIONS PVT LTD" (100% confidence)
            </div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center; font-size: 0.85rem;">
            <input type="checkbox" id="chk-rbi-consent" checked>
            <label for="chk-rbi-consent">I confirm compliance with RBI Payment Aggregator directives and declare legitimate business activity.</label>
          </div>
          <button class="btn btn-primary" type="button" style="padding: 12px; margin-top: 8px;" onclick="window.toucanApp.notify('Onboarding documents submitted. Production live mode enabled!')">Submit for Automated Approval</button>
        </form>
      </div>
    `;
  }

  function initOnboardingWizardEvents() {}

  // -------------------------------------------------------------
  // 16. Interactive Frontend Scope & Estimation Calculator (PDF Pages 2, 9, 10, 11)
  // -------------------------------------------------------------
  function getEstimatorHtml() {
    return `
      <div class="app-topbar">
        <div class="app-title-group">
          <h1>Interactive Frontend Scope & Estimation Model</h1>
          <p>Based on the Payment Platform Frontend Scope Guide (PDF Pages 2, 9, 10, 11) inspired by Razorpay and Stripe.</p>
        </div>
        <div class="app-topbar-controls">
          <button class="btn btn-ghost" id="btn-reset-estimator">↻ Reset Model Defaults</button>
          <button class="btn btn-primary" id="btn-export-scope">📥 Export Scope Report</button>
        </div>
      </div>

      <!-- Formula Model Calculator (from Page 10 of PDF) -->
      <div class="estimator-layout">
        <div class="estimator-inputs-card">
          <div class="panel-card-header">
            <h2 class="panel-card-title">1. Estimation Inputs & Assumptions</h2>
            <span style="font-size: 0.78rem; font-family: monospace; color: var(--muted);">Formula: T × H × (1 − R) × (1 + Q)</span>
          </div>

          <div class="calc-field-group">
            <label>
              <span>Unique Templates / Page States (T):</span>
              <strong id="val-est-templates">${state.estimation.templates}</strong>
            </label>
            <input type="range" id="est-templates" min="50" max="400" step="5" value="${state.estimation.templates}">
            <small>Total unique templates across all 14 modules after normalizing repeated patterns.</small>
          </div>

          <div class="calc-field-group">
            <label>
              <span>Base Hours per Template (H):</span>
              <strong id="val-est-hours">${state.estimation.hoursPerTemplate} hrs</strong>
            </label>
            <input type="range" id="est-hours" min="4" max="24" step="1" value="${state.estimation.hoursPerTemplate}">
            <small>Average design, interactive state implementation, and form validation effort.</small>
          </div>

          <div class="calc-field-group">
            <label>
              <span>Pattern Reuse Efficiency (R):</span>
              <strong id="val-est-reuse">${state.estimation.reuseEfficiency}%</strong>
            </label>
            <input type="range" id="est-reuse" min="0" max="60" step="5" value="${state.estimation.reuseEfficiency}">
            <small>Effort reduction from shared design system, tables, modals, and tokens (25% default).</small>
          </div>

          <div class="calc-field-group">
            <label>
              <span>QA & Rework Allowance (Q):</span>
              <strong id="val-est-qa">${state.estimation.qaAllowance}%</strong>
            </label>
            <input type="range" id="est-qa" min="10" max="50" step="5" value="${state.estimation.qaAllowance}">
            <small>Added allowance for cross-browser testing, accessibility, and edge-case validation (25% default).</small>
          </div>
        </div>

        <div class="estimator-results-card">
          <div class="panel-card-header">
            <h2 class="panel-card-title">2. Calculated Engineering Effort</h2>
            <span class="status-pill success">Live Model</span>
          </div>

          <div class="estimator-kpis">
            <div class="est-kpi-box">
              <small>Estimated Hours</small>
              <strong id="res-est-hours">1,875</strong>
            </div>
            <div class="est-kpi-box">
              <small>Person-Months</small>
              <strong id="res-est-pm">11.7</strong>
              <span style="font-size: 0.72rem; color: var(--muted);">(160 hrs / month)</span>
            </div>
          </div>

          <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid var(--border); font-size: 0.85rem; line-height: 1.6;">
            <strong>Scope Architecture Breakdown:</strong>
            <ul style="margin: 8px 0 0; padding-left: 20px; color: var(--muted);">
              <li><strong>Net Development Hours:</strong> <span id="res-est-net">1,500 hrs</span></li>
              <li><strong>QA & Rework Allocation:</strong> <span id="res-est-qa-hrs">375 hrs</span></li>
              <li><strong>Team Velocity (4 Full-Stack Devs):</strong> ~<span id="res-est-timeline">2.9 months</span></li>
            </ul>
          </div>

          <div style="font-size: 0.78rem; color: var(--muted); line-height: 1.5;">
            * Note from PDF Page 10: Model excludes backend microservices, licensing applications, and payment aggregator compliance setup.
          </div>
        </div>
      </div>

      <!-- Complete 14-Module Checklist Inventory from PDF Pages 3-9 -->
      <div class="panel-card">
        <div class="panel-card-header">
          <div>
            <h2 class="panel-card-title">3. Complete 14-Module Scope Inventory & Checklist</h2>
            <p class="panel-card-subtitle">Every module and template group detailed across Pages 3–9 of the guide.</p>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <input type="text" id="chk-filter-search" placeholder="Search checklist items…" style="padding: 6px 12px; font-size: 0.82rem; width: 220px;">
          </div>
        </div>

        <div class="checklist-container">
          ${getChecklistItemsHtml()}
        </div>
      </div>
    `;
  }

  function getChecklistItemsHtml() {
    const modules = [
      { id: 'm1', name: '1. Public website and marketing pages', pages: '18–25 pages', items: ['Homepage (hero, demo, trust indicators, customer logos, CTA)', 'Payment gateway landing page', 'Payment links landing page', 'Subscription billing landing page', 'Invoicing landing page', 'Payouts landing page', 'Marketplace payments landing page', 'Pricing page, fee calculator, plan comparison', 'Integrations directory & detail pages', 'Security, compliance & FAQ'] },
      { id: 'm2', name: '2. Authentication and merchant onboarding', pages: '12–18 states', items: ['Sign up, sign in, email/mobile OTP verification with resend timer', 'Forgot password, reset password, MFA setup', 'Business type selection (Pvt Ltd, LLP, Sole Prop) & business profile', 'KYC document upload, preview, replacement, validation check', 'Bank account verification (penny drop verification)', 'Sandbox activation vs production-access approval'] },
      { id: 'm3', name: '3. Merchant dashboard', pages: '15–22 states', items: ['Role-aware application shell with date-range filters', 'Total payment volume, successful payments, avg value, success rate', 'Revenue and settlement summary cards', 'Recent transactions and real-time live feed', 'Onboarding & KYC verification status cards', 'Global search (Cmd+K), account switcher, notifications center'] },
      { id: 'm4', name: '4. Transactions and customer management', pages: '15–22 states', items: ['Transactions table with pagination, sorting, search, column controls', 'Transaction detail page/drawer with full event timeline', 'Full & partial refund workflows with status tracking', 'Disputes & chargeback evidence submission with deadline indicators', 'Customer list, profile, lifetime spend, notes, and metadata'] },
      { id: 'm5', name: '5. Checkout and payment experiences', pages: '12–18 states', items: ['Hosted checkout and embedded checkout component', 'Card entry with Luhn validation, brand detection, masked details', 'UPI flow with dynamic QR presentation and simulated approval', 'Net banking popular banks selector and wallets', '3-D Secure OTP authentication simulation', 'Receipt confirmation and duplicate-submit prevention'] },
      { id: 'm6', name: '6. Payment links and no-code payment pages', pages: '12–18 states', items: ['Payment links list, status labels, search, and filters', 'Create / edit payment link wizard (fixed or customer-entered)', 'Share link, copy URL, live QR code display, WhatsApp actions', 'No-code payment page visual editor with live real-time preview', 'Brand color picker, logo upload, line items, and custom form fields'] },
      { id: 'm7', name: '7. Billing, subscriptions, and invoices', pages: '15–22 states', items: ['Product catalog, pricing tiers, monthly/annual toggle', 'Subscription list, active/paused/trialing states, proration preview', 'GST invoice creation, line items, 18% tax calculation, discounts', 'PDF invoice preview and instant download', 'Customer billing portal simulation'] },
      { id: 'm8', name: '8. Settlements, payouts, and reconciliation', pages: '10–15 states', items: ['Available, pending, and reserved balance views', 'Settlement list with bank UTR and expected vs actual dates', 'Reconciliation table and unmatched transaction resolution', 'Instant & scheduled payout creation (IMPS/NEFT)', 'Maker-checker approval workflow simulation'] },
      { id: 'm9', name: '9. Marketplace and connected accounts', pages: '10–15 states', items: ['Connected seller directory and identity verification status', 'Commission configuration and split-payment preview simulator', 'Transfer history, seller balance, and payout schedule', 'Account restrictions and compliance remediation'] },
      { id: 'm10', name: '10. Developer portal and API management', pages: '12–18 states', items: ['Interactive API reference with runnable cURL, Node.js, Python, Go examples', 'Test and live environment credentials toggle', 'API key generation, rotation, revocation, and show-secret-once', 'Webhook endpoint management and delivery attempt logs with replay', 'Sandbox transaction scenario simulator'] },
      { id: 'm11', name: '11. Analytics and reporting', pages: '8–12 states', items: ['Revenue and payment volume charts with date filters', 'Success vs failure trend charts and payment-method breakdown', 'Refund and dispute analytics', 'Custom report builder with CSV/XLSX downloads'] },
      { id: 'm12', name: '12. Fraud, disputes, and compliance UI', pages: '10–15 states', items: ['Risk alerts and manual-review queue (0–100 risk score)', 'Allowlist and blocklist management (emails, IPs, card BINs)', 'Fraud rule builder with conditional triggers', 'Dispute evidence builder and case timeline'] },
      { id: 'm13', name: '13. Support, settings, and notifications', pages: '12–18 states', items: ['Support ticket list, details, and priority escalation', 'Merchant profile, GSTIN, PAN, and address configuration', 'Team members, invitations, and role-based permissions (RBAC)', 'Two-Factor Authentication (2FA) and security settings'] },
      { id: 'm14', name: '14. Internal super-admin and operations console', pages: '15–22 states', items: ['Platform-wide GMV and fee revenue metrics', 'Provider configuration and health monitoring (HDFC, ICICI, Axis, SBI)', 'Intelligent routing and automatic fallback rules', 'Merchant approval queues and platform audit logs'] }
    ];

    return modules.map(m => `
      <div class="checklist-item done" data-module="${m.id}">
        <input type="checkbox" checked onclick="this.closest('.checklist-item').classList.toggle('done', this.checked)">
        <div class="checklist-text">
          <h4>${m.name} <span class="nav-badge" style="margin-left: 8px;">${m.pages}</span></h4>
          <p>${m.items.join(' · ')}</p>
        </div>
      </div>
    `).join('');
  }

  function initEstimatorEvents() {
    const tSlider = $('#est-templates');
    const hSlider = $('#est-hours');
    const rSlider = $('#est-reuse');
    const qSlider = $('#est-qa');

    function recalc() {
      const t = Number(tSlider?.value || 200);
      const h = Number(hSlider?.value || 10);
      const r = Number(rSlider?.value || 25);
      const q = Number(qSlider?.value || 25);

      state.estimation.templates = t;
      state.estimation.hoursPerTemplate = h;
      state.estimation.reuseEfficiency = r;
      state.estimation.qaAllowance = q;

      // Formula: Templates × hours × (1 − reuse) × (1 + QA)
      const netHours = t * h * (1 - (r / 100));
      const totalHours = Math.round(netHours * (1 + (q / 100)));
      const pm = (totalHours / 160).toFixed(1);

      if ($('#val-est-templates')) $('#val-est-templates').textContent = t;
      if ($('#val-est-hours')) $('#val-est-hours').textContent = h + ' hrs';
      if ($('#val-est-reuse')) $('#val-est-reuse').textContent = r + '%';
      if ($('#val-est-qa')) $('#val-est-qa').textContent = q + '%';

      if ($('#res-est-hours')) $('#res-est-hours').textContent = totalHours.toLocaleString();
      if ($('#res-est-pm')) $('#res-est-pm').textContent = pm;
      if ($('#res-est-net')) $('#res-est-net').textContent = Math.round(netHours).toLocaleString() + ' hrs';
      if ($('#res-est-qa-hrs')) $('#res-est-qa-hrs').textContent = Math.round(totalHours - netHours).toLocaleString() + ' hrs';
      if ($('#res-est-timeline')) $('#res-est-timeline').textContent = (totalHours / (4 * 160)).toFixed(1) + ' months';
    }

    tSlider?.addEventListener('input', recalc);
    hSlider?.addEventListener('input', recalc);
    rSlider?.addEventListener('input', recalc);
    qSlider?.addEventListener('input', recalc);

    $('#btn-reset-estimator')?.addEventListener('click', () => {
      if (tSlider) tSlider.value = 200;
      if (hSlider) hSlider.value = 10;
      if (rSlider) rSlider.value = 25;
      if (qSlider) qSlider.value = 25;
      recalc();
      notify("Estimator reset to PDF example defaults (200 templates, 1,875 hours, 11.7 PM).");
    });

    $('#btn-export-scope')?.addEventListener('click', () => {
      const scopeSummary = {
        title: "Payment Platform Frontend Scope Report",
        model: "T × H × (1 - R) × (1 + Q)",
        templates: state.estimation.templates,
        hoursPerTemplate: state.estimation.hoursPerTemplate,
        reuseEfficiency: state.estimation.reuseEfficiency + "%",
        qaAllowance: state.estimation.qaAllowance + "%",
        estimatedHours: $('#res-est-hours')?.textContent,
        personMonths: $('#res-est-pm')?.textContent,
        modulesCount: 14,
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(scopeSummary, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `frontend_scope_estimate_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      notify("Frontend Scope Estimation Report exported!");
    });

    // Search filter for checklist
    $('#chk-filter-search')?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      $$('.checklist-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
  }

  // -------------------------------------------------------------
  // Modals & Action Workflows
  // -------------------------------------------------------------
  window.toucanApp = window.payflowApp = {
    setView,
    setTab,
    notify,

    viewTxn(id) {
      const t = state.transactions.find(x => x.id === id) || state.transactions[0];
      const modal = $('#app-modal-overlay');
      const box = $('#app-modal-box');
      if (!modal || !box) return;

      box.innerHTML = `
        <div class="app-modal-header">
          <h3>Transaction Details: <code>${t.id}</code></h3>
          <button class="app-modal-close" onclick="window.toucanApp.closeModal()">✕</button>
        </div>
        <div class="app-modal-body">
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--sub); padding: 14px 18px; border-radius: 12px;">
            <div>
              <span style="font-size: 0.8rem; color: var(--muted); text-transform: uppercase;">Amount Paid</span>
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent);">${fmtINR(t.amount)}</div>
            </div>
            <span class="status-pill ${t.status}" style="font-size: 0.85rem; padding: 4px 12px;">${t.status}</span>
          </div>

          <div>
            <h4 style="margin: 0 0 10px; font-size: 0.95rem;">Payment Lifecycle Timeline</h4>
            <div class="event-timeline">
              <div class="event-step completed">
                <div class="event-step-dot">✓</div>
                <div class="event-title">Order Created</div>
                <div class="event-time">${t.date}</div>
                <div class="event-detail">Customer session initialized from web checkout</div>
              </div>
              <div class="event-step completed">
                <div class="event-step-dot">✓</div>
                <div class="event-title">Payment Authorized by Issuer</div>
                <div class="event-time">${t.date} + 3s</div>
                <div class="event-detail">Bank RRN: <code>${t.rrn}</code> · 3DS Authenticated</div>
              </div>
              <div class="event-step completed">
                <div class="event-step-dot">✓</div>
                <div class="event-title">Funds Captured by Gateway</div>
                <div class="event-time">${t.date} + 4s</div>
                <div class="event-detail">Fee deducted: ${fmtINR(t.fee)} · GST: ${fmtINR(t.gst)} · Net: ${fmtINR(t.net)}</div>
              </div>
              <div class="event-step ${t.status === 'refunded' ? 'failed' : 'completed'}">
                <div class="event-step-dot">${t.status === 'refunded' ? '↩' : '🏦'}</div>
                <div class="event-title">${t.status === 'refunded' ? 'Refund Processed' : 'Settlement Batch Pending'}</div>
                <div class="event-time">Expected deposit: T+1 11:00 AM</div>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.85rem; border-top: 1px solid var(--border); padding-top: 12px;">
            <div><span>Customer:</span> <strong>${t.customer}</strong></div>
            <div><span>Email:</span> <strong>${t.email}</strong></div>
            <div><span>Payment Mode:</span> <strong>${t.method}</strong></div>
            <div><span>Gateway Reference:</span> <code>${t.rrn}</code></div>
          </div>
        </div>
        <div class="app-modal-footer">
          ${t.status === 'captured' ? `<button class="btn btn-ghost" style="color: var(--err);" onclick="window.toucanApp.showRefundModal('${t.id}', ${t.amount})">Issue Refund</button>` : ''}
          ${t.status === 'captured' ? `<button class="btn btn-ghost" style="color: #DC2626;" onclick="window.toucanApp.showDisputeModal('${t.id}')">Raise Dispute</button>` : ''}
          <button class="btn btn-primary" onclick="window.toucanApp.closeModal()">Close</button>
        </div>
      `;
      modal.hidden = false;
    },

    showRefundModal(id, maxAmt) {
      const box = $('#app-modal-box');
      if (!box) return;

      box.innerHTML = `
        <div class="app-modal-header">
          <h3>Issue Refund for <code>${id}</code></h3>
          <button class="app-modal-close" onclick="window.toucanApp.closeModal()">✕</button>
        </div>
        <div class="app-modal-body">
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Refund Type</label>
            <div style="display: flex; gap: 12px; margin-top: 6px;">
              <label class="row"><input type="radio" name="reftype" value="full" checked id="ref-full"> Full Refund (${fmtINR(maxAmt)})</label>
              <label class="row"><input type="radio" name="reftype" value="partial" id="ref-partial"> Partial Refund</label>
            </div>
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Refund Amount (₹)</label>
            <input type="number" id="refund-amt-input" value="${maxAmt}" max="${maxAmt}" style="width: 100%; margin-top: 4px;">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Reason for Refund</label>
            <select id="refund-reason-select" style="width: 100%; margin-top: 4px;">
              <option>Customer requested cancellation</option>
              <option>Defective product / Service dissatisfaction</option>
              <option>Duplicate charge by customer</option>
              <option>Fraudulent transaction mitigation</option>
            </select>
          </div>
          <div style="background: var(--sub); padding: 12px; border-radius: 8px; font-size: 0.8rem; color: var(--muted);">
            ⚡ Instant refund mode: Customer receives credit within 20 minutes for UPI / RuPay.
          </div>
        </div>
        <div class="app-modal-footer">
          <button class="btn btn-ghost" onclick="window.toucanApp.closeModal()">Cancel</button>
          <button class="btn btn-primary" style="background: var(--err);" onclick="window.toucanApp.processRefund('${id}')">Confirm Refund</button>
        </div>
      `;
    },

    processRefund(id) {
      const t = state.transactions.find(x => x.id === id);
      if (t) {
        t.status = 'refunded';
      }
      this.closeModal();
      notify(`Refund successfully initiated for transaction ${id}!`);
      if (state.activeTab === 'transactions') renderTab('transactions');
    },

    showDisputeModal(id) {
      const box = $('#app-modal-box');
      if (!box) return;

      box.innerHTML = `
        <div class="app-modal-header">
          <h3>Dispute & Chargeback Evidence Submission</h3>
          <button class="app-modal-close" onclick="window.toucanApp.closeModal()">✕</button>
        </div>
        <div class="app-modal-body">
          <div class="notice-banner warning">
            <span class="notice-icon">⏰</span>
            <div><strong>Deadline: 5 days remaining</strong> — Failure to submit evidence results in automatic loss to card issuer.</div>
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Upload Proof of Fulfillment / Service Delivery (PDF/JPG)</label>
            <input type="file" style="margin-top: 6px;">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Merchant Rebuttal Explanation</label>
            <textarea rows="3" placeholder="Provide context confirming the legitimate cardholder accessed the service..." style="width: 100%; margin-top: 4px; padding: 8px;"></textarea>
          </div>
        </div>
        <div class="app-modal-footer">
          <button class="btn btn-ghost" onclick="window.toucanApp.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="window.toucanApp.submitDisputeEvidence('${id}')">Submit Evidence</button>
        </div>
      `;
    },

    submitDisputeEvidence(id) {
      this.closeModal();
      notify(`Evidence submitted for dispute on ${id}. Under review by card network.`);
    },

    show3DSModal(onSuccess) {
      const modal = $('#app-modal-overlay');
      const box = $('#app-modal-box');
      if (!modal || !box) return;

      box.innerHTML = `
        <div class="app-modal-header" style="background: #172033; color: #fff;">
          <h3 style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #60A5FA;">🏛️</span> Verified by Visa / RBI 3-D Secure
          </h3>
          <button class="app-modal-close" style="color: #fff;" onclick="window.toucanApp.closeModal()">✕</button>
        </div>
        <div class="app-modal-body" style="text-align: center; padding: 28px 24px;">
          <p style="font-size: 0.95rem; margin: 0 0 12px;">A one-time passcode (OTP) has been dispatched to your mobile ending in <strong>•••• 4910</strong></p>
          <div style="font-size: 0.85rem; color: var(--muted); margin-bottom: 16px;">Merchant: <strong>Toucan Cloud Services</strong> · Amount: <strong>₹2,499.00</strong></div>
          <input type="text" id="demo-3ds-otp" value="784912" maxlength="6" style="text-align: center; font-size: 1.5rem; letter-spacing: 0.3em; width: 180px; margin: 0 auto; display: block; font-weight: 700;">
          <small style="display: block; margin-top: 8px; color: var(--muted);">Demo code: <strong>784912</strong></small>
        </div>
        <div class="app-modal-footer">
          <button class="btn btn-ghost" onclick="window.toucanApp.closeModal()">Cancel</button>
          <button class="btn btn-primary" id="btn-submit-3ds-otp">Verify OTP & Pay</button>
        </div>
      `;
      modal.hidden = false;

      $('#btn-submit-3ds-otp')?.addEventListener('click', () => {
        window.toucanApp.closeModal();
        if (typeof onSuccess === 'function') onSuccess();
      });
    },

    showCreateLinkModal() {
      const modal = $('#app-modal-overlay');
      const box = $('#app-modal-box');
      if (!modal || !box) return;

      box.innerHTML = `
        <div class="app-modal-header">
          <h3>Create Standard Payment Link</h3>
          <button class="app-modal-close" onclick="window.toucanApp.closeModal()">✕</button>
        </div>
        <div class="app-modal-body">
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Link Description / Purpose</label>
            <input type="text" id="new-link-title" value="Quarterly SaaS Retainer" style="width: 100%; margin-top: 4px;">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Amount (₹)</label>
            <input type="number" id="new-link-amount" value="5000" style="width: 100%; margin-top: 4px;">
          </div>
          <div style="display: flex; gap: 14px;">
            <label class="row"><input type="checkbox" id="new-link-partial"> Allow Partial Payments</label>
            <label class="row"><input type="checkbox" id="new-link-remind" checked> Automated SMS Reminders</label>
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Link Expiry</label>
            <select style="width: 100%; margin-top: 4px;">
              <option>Expires in 7 days</option>
              <option>Expires in 30 days</option>
              <option>No expiration</option>
            </select>
          </div>
        </div>
        <div class="app-modal-footer">
          <button class="btn btn-ghost" onclick="window.toucanApp.closeModal()">Cancel</button>
          <button class="btn btn-primary" id="btn-save-new-link">Create & Copy Link</button>
        </div>
      `;
      modal.hidden = false;

      $('#btn-save-new-link')?.addEventListener('click', () => {
        const title = $('#new-link-title')?.value || 'New Payment Link';
        const amt = Number($('#new-link-amount')?.value || 1000);
        const newObj = {
          id: uid('plink_'),
          title,
          amount: amt,
          status: 'active',
          created: new Date().toISOString().slice(0, 10),
          payments: 0,
          url: 'https://pay.toucan.example/l/' + Math.random().toString(36).substr(2, 7)
        };
        state.links.unshift(newObj);
        window.toucanApp.closeModal();
        notify("Payment link generated and copied to clipboard!");
        if (state.activeTab === 'links') renderTab('links');
      });
    },

    shareLink(title, url, amount) {
      const modal = $('#app-modal-overlay');
      const box = $('#app-modal-box');
      if (!modal || !box) return;

      box.innerHTML = `
        <div class="app-modal-header">
          <h3>Share Payment Link: ${title}</h3>
          <button class="app-modal-close" onclick="window.toucanApp.closeModal()">✕</button>
        </div>
        <div class="app-modal-body" style="text-align: center;">
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent);">${fmtINR(amount)}</div>
          <code style="display: block; margin: 12px 0; background: var(--sub); padding: 8px 12px; border-radius: 8px;">${url}</code>
          <div style="display: flex; gap: 8px; justify-content: center; margin-top: 14px;">
            <button class="btn btn-primary" onclick="navigator.clipboard?.writeText('${url}'); window.toucanApp.notify('Link copied!');">📋 Copy Link</button>
            <button class="btn btn-ghost" onclick="window.toucanApp.notify('WhatsApp share link opened.')">💬 WhatsApp</button>
            <button class="btn btn-ghost" onclick="window.toucanApp.notify('Email share draft opened.')">✉️ Email</button>
          </div>
        </div>
        <div class="app-modal-footer">
          <button class="btn btn-primary" onclick="window.toucanApp.closeModal()">Done</button>
        </div>
      `;
      modal.hidden = false;
    },

    showCreateInvoiceModal() {
      const modal = $('#app-modal-overlay');
      const box = $('#app-modal-box');
      if (!modal || !box) return;

      box.classList.add('wide');
      box.innerHTML = `
        <div class="app-modal-header">
          <h3>Create GST Compliant Tax Invoice</h3>
          <button class="app-modal-close" onclick="window.toucanApp.closeModal()">✕</button>
        </div>
        <div class="app-modal-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="font-size: 0.85rem; font-weight: 600;">Bill To (Customer / Entity)</label>
              <input type="text" id="inv-client-name" value="Starlight Dynamics LLP" style="width: 100%; margin-top: 4px;">
            </div>
            <div>
              <label style="font-size: 0.85rem; font-weight: 600;">Client GSTIN</label>
              <input type="text" id="inv-client-gst" value="27AABCS9812K1Z4" style="width: 100%; margin-top: 4px;">
            </div>
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Line Items</label>
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 8px; margin-top: 4px;">
              <input type="text" value="Enterprise Payment Gateway Integration" placeholder="Description">
              <input type="number" id="inv-item-qty" value="1" placeholder="Qty">
              <input type="number" id="inv-item-rate" value="25000" placeholder="Rate (₹)">
            </div>
          </div>
          <div style="background: var(--sub); padding: 14px; border-radius: 10px; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Subtotal:</span>
              <strong id="inv-subtotal">₹25,000.00</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>GST (18% Integrated IGST):</span>
              <strong id="inv-tax">₹4,500.00</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.1rem; color: var(--accent); padding-top: 4px; border-top: 1px dashed var(--border);">
              <span>Total Invoice Payable:</span>
              <strong id="inv-total">₹29,500.00</strong>
            </div>
          </div>
        </div>
        <div class="app-modal-footer">
          <button class="btn btn-ghost" onclick="window.toucanApp.closeModal()">Cancel</button>
          <button class="btn btn-primary" id="btn-save-invoice">Generate & Send Invoice</button>
        </div>
      `;
      modal.hidden = false;

      $('#btn-save-invoice')?.addEventListener('click', () => {
        const inv = {
          id: 'INV-2026-00' + (state.invoices.length + 1),
          customer: $('#inv-client-name')?.value || 'Client',
          amount: 29500,
          gst: 4500,
          status: 'sent',
          dueDate: new Date(Date.now() + 15*86400000).toISOString().slice(0, 10),
          issued: new Date().toISOString().slice(0, 10)
        };
        state.invoices.unshift(inv);
        window.toucanApp.closeModal();
        notify(`Invoice ${inv.id} issued and emailed to client.`);
        if (state.activeTab === 'invoices') renderTab('invoices');
      });
    },

    viewInvoice(id) {
      const inv = state.invoices.find(x => x.id === id) || state.invoices[0];
      const modal = $('#app-modal-overlay');
      const box = $('#app-modal-box');
      if (!modal || !box) return;

      box.classList.add('wide');
      box.innerHTML = `
        <div class="app-modal-header">
          <h3>Tax Invoice: ${inv.id}</h3>
          <button class="app-modal-close" onclick="window.toucanApp.closeModal()">✕</button>
        </div>
        <div class="app-modal-body">
          <div class="invoice-paper">
            <div class="invoice-top">
              <div>
                <div class="invoice-title">Toucan</div>
                <div style="color: var(--muted); font-size: 0.85rem;">Toucan Technologies Pvt Ltd<br>GSTIN: 29AABCP1234F1Z9</div>
              </div>
              <div class="invoice-meta">
                <h3 style="margin: 0; color: var(--text);">TAX INVOICE</h3>
                <div>Invoice #: <strong>${inv.id}</strong></div>
                <div>Date: ${inv.issued}</div>
                <div>Due Date: ${inv.dueDate}</div>
              </div>
            </div>

            <div class="invoice-addresses">
              <div>
                <span style="font-size: 0.78rem; font-weight: 700; color: var(--muted);">BILLED TO:</span>
                <div style="font-weight: 700; font-size: 1rem; margin-top: 4px;">${inv.customer}</div>
                <div style="color: var(--muted); font-size: 0.85rem;">GSTIN: 27AABCS9812K1Z4<br>Mumbai, Maharashtra, India</div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.78rem; font-weight: 700; color: var(--muted);">PAYMENT STATUS:</span>
                <div style="margin-top: 4px;"><span class="status-pill ${inv.status === 'paid' ? 'success' : 'pending'}">${inv.status.toUpperCase()}</span></div>
              </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border); text-align: left; font-size: 0.82rem; color: var(--muted);">
                  <th style="padding: 8px 0;">DESCRIPTION</th>
                  <th style="text-align: right;">QTY</th>
                  <th style="text-align: right;">RATE</th>
                  <th style="text-align: right;">AMOUNT</th>
                </tr>
              </thead>
              <tbody style="font-size: 0.9rem;">
                <tr style="border-bottom: 1px solid var(--border);">
                  <td style="padding: 12px 0;">Payment Processing & API Services</td>
                  <td style="text-align: right;">1</td>
                  <td style="text-align: right;">${fmtINR(inv.amount - inv.gst)}</td>
                  <td style="text-align: right;">${fmtINR(inv.amount - inv.gst)}</td>
                </tr>
              </tbody>
            </table>

            <div style="align-self: flex-end; width: 260px; display: flex; flex-direction: column; gap: 6px; font-size: 0.88rem; margin-top: 10px;">
              <div style="display: flex; justify-content: space-between;"><span>Subtotal:</span> <strong>${fmtINR(inv.amount - inv.gst)}</strong></div>
              <div style="display: flex; justify-content: space-between;"><span>GST (18%):</span> <strong>${fmtINR(inv.gst)}</strong></div>
              <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; color: var(--accent); border-top: 2px solid var(--border); padding-top: 6px;">
                <span>Total:</span> <strong>${fmtINR(inv.amount)}</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="app-modal-footer">
          <button class="btn btn-ghost" onclick="window.print()">🖨️ Print Invoice</button>
          <button class="btn btn-primary" onclick="window.toucanApp.notify('Invoice PDF downloaded.'); window.toucanApp.closeModal();">📥 Download PDF</button>
        </div>
      `;
      modal.hidden = false;
    },

    showCreatePayoutModal() {
      const modal = $('#app-modal-overlay');
      const box = $('#app-modal-box');
      if (!modal || !box) return;

      box.innerHTML = `
        <div class="app-modal-header">
          <h3>Create Single Instant Payout</h3>
          <button class="app-modal-close" onclick="window.toucanApp.closeModal()">✕</button>
        </div>
        <div class="app-modal-body">
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Beneficiary Type</label>
            <div style="display: flex; gap: 12px; margin-top: 4px;">
              <label class="row"><input type="radio" name="pout_type" checked> Bank Account (IMPS/NEFT)</label>
              <label class="row"><input type="radio" name="pout_type"> UPI ID (VPA)</label>
            </div>
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Beneficiary Full Name</label>
            <input type="text" id="pout-name" value="Kavita Enterprises" style="width: 100%; margin-top: 4px;">
          </div>
          <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 10px;">
            <div>
              <label style="font-size: 0.85rem; font-weight: 600;">Account Number</label>
              <input type="text" id="pout-acct" value="5010029410982" style="width: 100%; margin-top: 4px;">
            </div>
            <div>
              <label style="font-size: 0.85rem; font-weight: 600;">IFSC Code</label>
              <input type="text" id="pout-ifsc" value="HDFC0000128" style="width: 100%; margin-top: 4px;">
            </div>
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Payout Amount (₹)</label>
            <input type="number" id="pout-amt" value="12500" style="width: 100%; margin-top: 4px;">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Transfer Purpose</label>
            <select style="width: 100%; margin-top: 4px;">
              <option>Vendor Payment</option>
              <option>Customer Refund</option>
              <option>Employee Salary</option>
            </select>
          </div>
        </div>
        <div class="app-modal-footer">
          <button class="btn btn-ghost" onclick="window.toucanApp.closeModal()">Cancel</button>
          <button class="btn btn-primary" id="btn-submit-payout">Execute IMPS Transfer</button>
        </div>
      `;
      modal.hidden = false;

      $('#btn-submit-payout')?.addEventListener('click', () => {
        window.toucanApp.closeModal();
        notify("Payout of ₹12,500 successfully sent via instant IMPS!");
      });
    },

    viewCustomer(name, email, spent, count) {
      const modal = $('#app-modal-overlay');
      const box = $('#app-modal-box');
      if (!modal || !box) return;

      box.innerHTML = `
        <div class="app-modal-header">
          <h3>Customer Profile: ${name}</h3>
          <button class="app-modal-close" onclick="window.toucanApp.closeModal()">✕</button>
        </div>
        <div class="app-modal-body">
          <div style="display: flex; justify-content: space-between; background: var(--sub); padding: 14px 18px; border-radius: 12px;">
            <div>
              <div style="font-size: 1.15rem; font-weight: 700;">${name}</div>
              <div style="color: var(--muted); font-size: 0.85rem;">${email}</div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 0.78rem; color: var(--muted);">TOTAL SPEND</span>
              <div style="font-size: 1.35rem; font-weight: 800; color: var(--accent);">${spent}</div>
            </div>
          </div>

          <div>
            <h4 style="margin: 0 0 6px; font-size: 0.9rem;">Customer Tags & Internal Notes</h4>
            <textarea rows="2" style="width: 100%; padding: 8px; font: inherit; font-size: 0.85rem; border: 1px solid var(--border); border-radius: 8px;">VIP Client · Enterprise Cloud Tier · Priority SLA Enabled</textarea>
          </div>

          <div>
            <h4 style="margin: 0 0 6px; font-size: 0.9rem;">Saved Payment Methods</h4>
            <div style="display: flex; gap: 8px;">
              <span class="status-pill success">💳 Visa ending in 4242</span>
              <span class="status-pill authorized">⚡ AutoPay UPI Mandate</span>
            </div>
          </div>
        </div>
        <div class="app-modal-footer">
          <button class="btn btn-primary" onclick="window.toucanApp.closeModal()">Close</button>
        </div>
      `;
      modal.hidden = false;
    },

    triggerSandbox(type) {
      if (type === 'success') {
        notify("Sandbox: Emulating captured charge of ₹4,999. Webhook 'payment.captured' dispatched.");
      } else if (type === 'insufficient_funds') {
        notify("Sandbox: Issuer simulated decline - code 51 (insufficient funds). Safe retry activated.");
      } else if (type === 'bank_down') {
        notify("Sandbox: Bank outage simulated. Smart routing switched 100% traffic to ICICI gateway.");
      } else if (type === 'dispute') {
        notify("Sandbox: Simulated dispute created! Added to Risk Review Queue with 5-day countdown.");
      }
    },

    resolveRisk(id, action) {
      state.riskQueue = state.riskQueue.filter(x => x.id !== id);
      notify(`Risk item ${id} was ${action === 'approve' ? 'approved' : 'blocked & refunded'}.`);
      if (state.activeTab === 'risk') renderTab('risk');
    },

    revealKey() {
      notify("Secret API Key revealed: sk_test_51Mz009418a092819041284 (Store securely; won't be shown again).");
    },

    revokeKey() {
      notify("API key revoked. Future calls with this token will return HTTP 401 Unauthorized.");
    },

    replayWebhook(id) {
      notify(`Replaying webhook event ${id} -> HTTP 200 OK received!`);
    },

    downloadReceipt() {
      notify("Payment receipt PDF generated and downloaded.");
    },

    resetCheckout() {
      if (state.activeTab === 'checkout') renderTab('checkout');
    },

    closeModal() {
      const modal = $('#app-modal-overlay');
      if (modal) {
        modal.hidden = true;
        const box = $('#app-modal-box');
        if (box) box.classList.remove('wide');
      }
    }
  };

  // Initialize once DOM is ready
  function init() {
    $('.logo')?.addEventListener('click', (e) => {
      e.preventDefault();
      setView('website');
      history.replaceState(null, '', '#top');
      window.scrollTo({ top: 0, behavior: 'auto' });
    });

    $('#primary-nav')?.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const destination = link.getAttribute('href');
      if (destination === '#platform-estimator') {
        e.preventDefault();
        setView('platform');
        setTab('estimator');
        history.replaceState(null, '', destination);
        return;
      }

      const target = $(destination);
      if (!target || !$('#main')?.contains(target)) return;

      e.preventDefault();
      setView('website');
      history.replaceState(null, '', destination);
      target.scrollIntoView({ behavior: 'smooth' });
    });

    // Mode switcher buttons in header
    $('#view-switch-btn')?.addEventListener('click', () => {
      setView(state.view === 'website' ? 'platform' : 'website');
    });

    // Top bar role select
    $('#mode-role-select')?.addEventListener('change', (e) => {
      state.role = e.target.value;
      notify(`Role switched to ${e.target.options[e.target.selectedIndex].text}`);
    });

    // Top bar environment select
    $('#mode-env-select')?.addEventListener('change', (e) => {
      state.env = e.target.value;
      notify(`Switched to ${state.env.toUpperCase()} environment mode`);
    });

    // Sidebar navigation
    $$('.sidebar-nav-item button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = e.target.closest('.sidebar-nav-item');
        if (item && item.dataset.tab) {
          setTab(item.dataset.tab);
        }
      });
    });

    // Modal overlay click outside to close
    $('#app-modal-overlay')?.addEventListener('click', (e) => {
      if (e.target === $('#app-modal-overlay')) {
        window.toucanApp.closeModal();
      }
    });

    // Support URL hash navigation
    function handleHash() {
      const h = location.hash;
      if (h.startsWith('#platform')) {
        const tab = h.replace('#platform-', '').replace('#platform', '') || 'overview';
        setView('platform');
        if (tab) setTab(tab);
      }
    }
    window.addEventListener('hashchange', handleHash);
    handleHash();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
