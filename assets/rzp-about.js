// Toucan About & Flow AI Assistant Integration
(function() {
  function initFlowAbout() {
    const askRayBtn = document.getElementById('ask-ray-btn');
    const modalOverlay = document.getElementById('rzp-ray-modal-overlay');
    const closeBtn = document.getElementById('rzp-ray-close');
    const chatBody = document.getElementById('rzp-ray-chat-body');
    const chatInput = document.getElementById('rzp-ray-chat-input');
    const sendBtn = document.getElementById('rzp-ray-send-btn');

    if (!askRayBtn || !modalOverlay) return;

    // Knowledge base for Toucan Assistant (Flow)
    const knowledge = {
      methods: {
        keywords: ['payment modes', 'cards', 'upi', 'methods', 'accept', 'wallet', 'netbanking'],
        answer: "Toucan supports 100+ payment modes in India: UPI (PhonePe, Google Pay, Paytm, CRED), Credit/Debit cards (Visa, Mastercard, RuPay, Amex, Diners Club), Netbanking across 58+ banks, Wallets (Airtel Money, JioMoney, Ola Money, Mobikwik), and EMI/PayLater."
      },
      settlement: {
        keywords: ['settlement', 'payout', 'instant', 'schedule', 'settle'],
        answer: "Standard settlements on Toucan happen on T+1 or T+2 days automatically to your registered bank account. With Toucan Instant Settlements, eligible merchants receive funds directly in their accounts within 15 seconds, 24x7x365, even on bank holidays!"
      },
      banking: {
        keywords: ['banking', 'toucanx', 'payflowx', 'razorpayx', 'current account', 'payouts', 'vendor', 'payroll'],
        answer: "ToucanX supercharges business banking with fully functional Current Accounts (in partnership with Axis Bank, IDFC FIRST, RBL), automated vendor payouts via API, bulk payouts, tax payments, and automated payroll compliance."
      },
      api: {
        keywords: ['api', 'docs', 'integration', 'keys', 'webhook', 'sdk'],
        answer: "You can integrate Toucan's Checkout SDK with under 10 lines of JavaScript or use official client SDKs for React, iOS, Android, Flutter, and Node.js. Test mode keys (flow_test_...) allow end-to-end sandbox simulation without real money."
      },
      pricing: {
        keywords: ['pricing', 'fee', 'charge', 'rate', 'cost', 'percentage'],
        answer: "Toucan pricing is transparent: standard 2% + GST per successful transaction across domestic debit/credit cards, netbanking, and wallets. Standard UPI payments are supported at 0% MDR for merchants according to regulatory norms."
      },
      kyc: {
        keywords: ['kyc', 'onboarding', 'activation', 'documents', 'documents required'],
        answer: "Fast digital onboarding: Sign up on Toucan, enter your business PAN, Aadhaar/address proof, and settlement bank account. You can start testing immediately in sandbox mode while live KYC verification takes 24 hours."
      }
    };

    function openFlow() {
      modalOverlay.classList.add('active');
      modalOverlay.setAttribute('aria-hidden', 'false');
      if (chatInput) chatInput.focus();
    }

    function closeFlow() {
      modalOverlay.classList.remove('active');
      modalOverlay.setAttribute('aria-hidden', 'true');
    }

    askRayBtn.addEventListener('click', openFlow);
    if (closeBtn) closeBtn.addEventListener('click', closeFlow);
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) closeFlow();
    });

    // Handle ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeFlow();
      }
    });

    function appendMessage(text, isUser = false) {
      if (!chatBody) return;
      const bubble = document.createElement('div');
      bubble.className = 'rzp-chat-bubble ' + (isUser ? 'user' : 'assistant');
      bubble.textContent = text;
      chatBody.appendChild(bubble);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleUserInput(query) {
      const q = query.trim().toLowerCase();
      if (!q) return;

      appendMessage(query, true);
      if (chatInput) chatInput.value = '';

      // Simulate typing delay
      setTimeout(() => {
        let matched = null;
        for (const key in knowledge) {
          const item = knowledge[key];
          if (item.keywords.some(kw => q.includes(kw))) {
            matched = item.answer;
            break;
          }
        }

        if (matched) {
          appendMessage(matched, false);
        } else {
          appendMessage("Thanks for asking! I'm Flow, your Toucan payments copilot. You can explore our live payment simulator, check the API Docs, or test the Merchant Console from the top navigation.", false);
        }
      }, 350);
    }

    if (sendBtn && chatInput) {
      sendBtn.addEventListener('click', function() {
        handleUserInput(chatInput.value);
      });

      chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleUserInput(chatInput.value);
        }
      });
    }

    // Quick chips
    document.querySelectorAll('.rzp-quick-chip').forEach(btn => {
      btn.addEventListener('click', function() {
        const text = this.getAttribute('data-prompt') || this.textContent;
        handleUserInput(text);
      });
    });

    // Modals for legal links
    document.querySelectorAll('.open-terms-modal').forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        const app = window.toucanApp || window.payflowApp;
        if (app && app.showNotification) {
          app.showNotification("Terms & Policies: Standard RBI Master Direction on Payment Aggregators & Gateways compliant.");
        } else {
          alert("Toucan Terms of Service: RBI compliant Payment Aggregator terms for merchant onboarding and settlements.");
        }
      });
    });

    document.querySelectorAll('.open-privacy-modal').forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        const app = window.toucanApp || window.payflowApp;
        if (app && app.showNotification) {
          app.showNotification("Privacy Policy: ISO 27001 & PCI-DSS Level 1 certified bank-grade data security.");
        } else {
          alert("Toucan Privacy Policy: We protect customer and merchant financial data with 256-bit encryption.");
        }
      });
    });

    document.querySelectorAll('.open-support-modal').forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        openFlow();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFlowAbout);
  } else {
    initFlowAbout();
  }
})();
