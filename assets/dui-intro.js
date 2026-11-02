/**
 * D-UI Animated Intro Screen Controller
 * Automatically transitions to the main Toucan website after exactly 5 seconds.
 */
(function() {
  function initDuiIntro() {
    const introScreen = document.getElementById('dui-intro-screen');
    const skipBtn = document.getElementById('dui-intro-skip-btn');
    const introLogo = introScreen.querySelector('.dui-intro-logo');
    if (!introScreen) return;

    // Prevent scrolling while intro is visible
    document.body.classList.add('dui-intro-active');

    let isTransitioned = false;

    function transitionToMain(instant) {
      if (isTransitioned) return;
      isTransitioned = true;

      // Cancel the auto-timer if still pending
      if (typeof introTimer !== 'undefined') {
        clearTimeout(introTimer);
      }

      if (instant) {
        // Direct fast transition when user explicitly clicks Logo or Skip
        introScreen.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        introScreen.classList.add('dui-fading');

        setTimeout(function() {
          document.body.classList.remove('dui-intro-active');
          introScreen.style.display = 'none';
          introScreen.setAttribute('aria-hidden', 'true');

          window.dispatchEvent(new Event('resize'));
          if (typeof window.dispatchEvent === 'function') {
            window.dispatchEvent(new Event('scroll'));
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
        return;
      }

      // Add fade out & subtle zoom classes
      introScreen.classList.add('dui-fading');

      // Wait for CSS fade transition (1100ms) to finish cleanly
      setTimeout(function() {
        document.body.classList.remove('dui-intro-active');
        introScreen.style.display = 'none';
        introScreen.setAttribute('aria-hidden', 'true');

        // Trigger resize event to ensure canvas, charts & sticky navigations adjust
        window.dispatchEvent(new Event('resize'));
        
        // Re-evaluate scroll triggers for reveal animations if present
        if (typeof window.dispatchEvent === 'function') {
          window.dispatchEvent(new Event('scroll'));
        }
      }, 1100);
    }

    // Exactly 5 seconds timeout transition
    const introTimer = setTimeout(transitionToMain, 5000);

    // Direct transition to main page on pressing Logo
    if (introLogo) {
      introLogo.addEventListener('click', function(e) {
        e.preventDefault();
        transitionToMain(true);
      });
    }

    // Optional Skip button for immediate access
    if (skipBtn) {
      skipBtn.addEventListener('click', function(e) {
        e.preventDefault();
        transitionToMain(true);
      });
    }

    // Allow ESC key to skip intro
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !isTransitioned) {
        clearTimeout(introTimer);
        transitionToMain();
      }
    });

    // Check prefers-reduced-motion: if reduced motion is requested, transition quicker
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      clearTimeout(introTimer);
      setTimeout(transitionToMain, 1500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDuiIntro);
  } else {
    initDuiIntro();
  }
})();
