/**
 * ============================================================================
 * Interactive 3D & Physics Card Animation Engine
 * Inspired by high-end studio card animations with GSAP & ScrollTrigger
 * Powers:
 *   1. Bank-grade Security & Compliance Cards (#security)
 *   2. Tailored Business Model Bento Cards (#solutions)
 *   3. Follow a Payment Timeline & Money Flow Nodes (#story)
 *   4. Pricing Plans 3D Deck Fan & Fee Calculator (#pricing)
 *   5. Frequently Asked Questions 3D Accordion Cards (#faq)
 * ============================================================================
 */

(function () {
  "use strict";

  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  function initAllInteractiveCardSections() {
    const hasGSAP = typeof window.gsap !== "undefined";
    const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

    if (hasGSAP && hasScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    // 1. Bank-grade Security Cards (#security)
    setupCardGrid({
      sectionId: "security",
      cardSelector: ".sec-card",
      scrubMoves: [
        { x: -36, rot: -3.5 },
        { x: -12, rot: -1.2 },
        { x: 12, rot: 1.2 },
        { x: 36, rot: 3.5 }
      ],
      hoverScale: 1.06,
      tiltFactor: 20,
      liftZ: 32,
      hasGSAP,
      hasScrollTrigger
    });

    // 2. Tailored Business Model Bento Grid (#solutions)
    setupCardGrid({
      sectionId: "solutions",
      cardSelector: ".bento-card",
      scrubMoves: [
        { x: -24, rot: -2 },
        { x: 22, rot: 1.8 },
        { x: -14, rot: -1.5 },
        { x: 16, rot: 1.5 },
        { x: 0, rot: -0.5 }
      ],
      hoverScale: 1.04,
      tiltFactor: 16,
      liftZ: 28,
      hasGSAP,
      hasScrollTrigger
    });

    // 3. Follow a Payment Timeline & Money Flow Cards (#story)
    setupCardGrid({
      sectionId: "story",
      cardSelector: ".flow-card-node",
      scrubMoves: [
        { x: -18, rot: -1.5 },
        { x: 0, rot: 0 },
        { x: 18, rot: 1.5 }
      ],
      hoverScale: 1.055,
      tiltFactor: 16,
      liftZ: 26,
      hasGSAP,
      hasScrollTrigger
    });

    setupTimelineInteractions(hasGSAP, hasScrollTrigger);

    // 4. Pricing Plans 3D Deck Fan & Fee Calculator (#pricing)
    setupPricingDeckInteractions(hasGSAP, hasScrollTrigger);

    // 5. Frequently Asked Questions 3D Accordion (#faq)
    setupFAQAccordionInteractions(hasGSAP, hasScrollTrigger);

    // 6. Checkout Terminal 3D Simulator (#checkout)
    setupCheckoutTerminalInteractions(hasGSAP, hasScrollTrigger);
  }

  function setupCardGrid(config) {
    const sec = document.getElementById(config.sectionId);
    if (!sec) return;

    const cards = Array.from(sec.querySelectorAll(config.cardSelector));
    if (!cards.length) return;

    if (config.hasGSAP && !isReduced) {
      initGSAPCardGrid(sec, cards, config);
    } else {
      initFallbackCardGrid(sec, cards, config);
    }
  }

  // ==========================================================================
  // FAQ 3D Accordion & Interactive Card Engine
  // ==========================================================================
  function setupFAQAccordionInteractions(hasGSAP, hasScrollTrigger) {
    const sec = document.getElementById("faq");
    if (!sec) return;

    const cards = Array.from(sec.querySelectorAll(".faq-card"));
    if (!cards.length) return;

    // 1. Accordion Toggle Logic with 3D tactile spring
    cards.forEach((card) => {
      const header = card.querySelector(".faq-card-header");
      if (!header) return;

      const toggleCard = () => {
        const isOpen = card.classList.contains("faq-card-open");

        // Close other open cards for clean single accordion mode
        cards.forEach((other) => {
          if (other !== card && other.classList.contains("faq-card-open")) {
            other.classList.remove("faq-card-open");
            const otherHeader = other.querySelector(".faq-card-header");
            if (otherHeader) otherHeader.setAttribute("aria-expanded", "false");
          }
        });

        card.classList.toggle("faq-card-open", !isOpen);
        header.setAttribute("aria-expanded", String(!isOpen));

        // 3D tactile bounce on toggle
        if (hasGSAP && window.gsap && !isReduced) {
          window.gsap.fromTo(
            card,
            { scale: 1.025, translateZ: 35 },
            { scale: 1, translateZ: !isOpen ? 18 : 0, duration: 0.35, ease: "back.out(2)" }
          );
        }
      };

      header.addEventListener("click", toggleCard);
      header.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleCard();
        }
      });

      // 2. 3D Hover Lift, Tilt & Specular Light Reflection
      if (isFinePointer && !isReduced) {
        card.addEventListener("mousemove", (e) => {
          card.dataset.isHovered = "true";
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;

          const glareX = ((e.clientX - r.left) / r.width) * 100;
          const glareY = ((e.clientY - r.top) / r.height) * 100;
          card.style.setProperty("--mouse-x", `${glareX}%`);
          card.style.setProperty("--mouse-y", `${glareY}%`);

          const shadowX = -px * 24;
          const shadowY = -py * 20 + 20;

          if (hasGSAP && window.gsap) {
            window.gsap.to(card, {
              rotateX: -py * 12,
              rotateY: px * 12,
              translateZ: 28,
              y: -5,
              scale: 1.015,
              boxShadow: `${shadowX}px ${shadowY}px 50px -12px rgba(12, 131, 255, 0.18), 0 8px 18px -4px rgba(15, 23, 42, 0.06)`,
              duration: 0.35,
              ease: "power2.out",
              transformPerspective: 900,
              overwrite: "auto"
            });
          }
        });

        card.addEventListener("mouseleave", () => {
          card.dataset.isHovered = "";
          const isOpen = card.classList.contains("faq-card-open");
          if (hasGSAP && window.gsap) {
            window.gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              translateZ: isOpen ? 18 : 0,
              scale: 1,
              y: 0,
              boxShadow: "",
              duration: 0.8,
              ease: "elastic.out(1, 0.6)",
              overwrite: "auto"
            });
          }
        });
      }
    });

    // 3. Mouse Parallax across FAQ Section
    if (isFinePointer && !isReduced) {
      let mx = 0, my = 0, tx = 0, ty = 0;
      sec.addEventListener("mousemove", (e) => {
        const r = sec.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      });
      sec.addEventListener("mouseleave", () => {
        mx = 0;
        my = 0;
      });
      function faqParallax() {
        tx += (mx - tx) * 0.05;
        ty += (my - ty) * 0.05;
        cards.forEach((card) => {
          if (!card.dataset.isHovered) {
            const d = parseFloat(card.dataset.depth) || 7;
            card.style.translate = `${tx * d}px ${ty * d * 0.5}px`;
          }
        });
        requestAnimationFrame(faqParallax);
      }
      requestAnimationFrame(faqParallax);
    }

    // 4. ScrollTrigger Entrance Animation
    if (hasGSAP && hasScrollTrigger && !isReduced) {
      window.ScrollTrigger.create({
        trigger: sec,
        start: "top 80%",
        once: true,
        onEnter: () => {
          window.gsap.from(cards, {
            y: 50,
            opacity: 0,
            scale: 0.94,
            rotation: (i, el) => parseFloat(el.dataset.rot) || (i % 2 === 0 ? -1 : 1),
            duration: 0.9,
            stagger: 0.1,
            ease: "back.out(1.4)"
          });
        }
      });
    }
  }

  // ==========================================================================
  // Checkout Terminal 3D Simulator Engine
  // ==========================================================================
  function setupCheckoutTerminalInteractions(hasGSAP, hasScrollTrigger) {
    const sec = document.getElementById("checkout");
    if (!sec) return;

    const terminal = sec.querySelector(".co");
    const simulatorPill = sec.querySelector(".checkout-simulator-pill");
    if (!terminal) return;

    // 1. 3D Hover Tilt & Specular Glare on Terminal
    if (isFinePointer && !isReduced) {
      terminal.addEventListener("mousemove", (e) => {
        terminal.dataset.isHovered = "true";
        const r = terminal.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;

        const glareX = ((e.clientX - r.left) / r.width) * 100;
        const glareY = ((e.clientY - r.top) / r.height) * 100;
        terminal.style.setProperty("--mouse-x", `${glareX}%`);
        terminal.style.setProperty("--mouse-y", `${glareY}%`);

        const shadowX = -px * 28;
        const shadowY = -py * 24 + 20;

        if (hasGSAP && window.gsap) {
          window.gsap.to(terminal, {
            rotateX: -py * 10,
            rotateY: px * 10,
            translateZ: 26,
            y: -6,
            scale: 1.012,
            boxShadow: `${shadowX}px ${shadowY}px 55px -12px rgba(12, 131, 255, 0.25), 0 10px 22px -6px rgba(15, 23, 42, 0.08)`,
            duration: 0.35,
            ease: "power2.out",
            transformPerspective: 950,
            overwrite: "auto"
          });
        }
      });

      terminal.addEventListener("mouseleave", () => {
        terminal.dataset.isHovered = "";
        if (hasGSAP && window.gsap) {
          window.gsap.to(terminal, {
            rotateX: 0,
            rotateY: 0,
            translateZ: 0,
            y: 0,
            scale: 1,
            boxShadow: "",
            duration: 0.85,
            ease: "elastic.out(1, 0.6)",
            overwrite: "auto"
          });
        }
      });

      // 2. Mouse Parallax across Checkout Section
      let mx = 0, my = 0, tx = 0, ty = 0;
      sec.addEventListener("mousemove", (e) => {
        const r = sec.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      });
      sec.addEventListener("mouseleave", () => {
        mx = 0;
        my = 0;
      });
      function checkoutParallax() {
        tx += (mx - tx) * 0.05;
        ty += (my - ty) * 0.05;
        if (!terminal.dataset.isHovered) {
          const d = parseFloat(terminal.dataset.depth) || 8;
          terminal.style.translate = `${tx * d}px ${ty * d * 0.5}px`;
        }
        if (simulatorPill) {
          simulatorPill.style.translate = `${tx * 5}px ${ty * 2.5}px`;
        }
        requestAnimationFrame(checkoutParallax);
      }
      requestAnimationFrame(checkoutParallax);
    }

    // 3. Tactile spring bounce on button clicks
    terminal.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (hasGSAP && window.gsap && !isReduced) {
          window.gsap.fromTo(btn, { scale: 1.04 }, { scale: 1, duration: 0.2, ease: "back.out(2)" });
        }
      });
    });

    // 4. ScrollTrigger 3D Entrance
    if (hasGSAP && hasScrollTrigger && !isReduced) {
      window.ScrollTrigger.create({
        trigger: sec,
        start: "top 80%",
        once: true,
        onEnter: () => {
          window.gsap.from(terminal, {
            y: 60,
            opacity: 0,
            scale: 0.94,
            rotateX: 10,
            duration: 1.0,
            ease: "back.out(1.4)"
          });
        }
      });
    }
  }

  // ==========================================================================
  // Pricing Deck & Fee Calculator 3D Interactivity
  // ==========================================================================
  function setupPricingDeckInteractions(hasGSAP, hasScrollTrigger) {
    const sec = document.getElementById("pricing");
    if (!sec) return;

    const calc = sec.querySelector(".calc");
    const cards = Array.from(sec.querySelectorAll(".plan-card"));

    // Specular Glare & 3D Hover Tilt for Calculator Card
    if (calc && isFinePointer && !isReduced) {
      calc.addEventListener("mousemove", (e) => {
        const r = calc.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const glareX = ((e.clientX - r.left) / r.width) * 100;
        const glareY = ((e.clientY - r.top) / r.height) * 100;
        calc.style.setProperty("--mouse-x", `${glareX}%`);
        calc.style.setProperty("--mouse-y", `${glareY}%`);

        if (hasGSAP && window.gsap) {
          window.gsap.to(calc, {
            rotateX: -py * 8,
            rotateY: px * 8,
            translateZ: 18,
            y: -6,
            duration: 0.35,
            ease: "power2.out",
            transformPerspective: 950,
            overwrite: "auto"
          });
        }
      });

      calc.addEventListener("mouseleave", () => {
        if (hasGSAP && window.gsap) {
          window.gsap.to(calc, {
            rotateX: 0,
            rotateY: 0,
            translateZ: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.6)",
            overwrite: "auto"
          });
        }
      });
    }

    // Specular Glare & Tactile Click for Plan Cards
    cards.forEach((card) => {
      if (isFinePointer) {
        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          const glareX = ((e.clientX - r.left) / r.width) * 100;
          const glareY = ((e.clientY - r.top) / r.height) * 100;
          card.style.setProperty("--mouse-x", `${glareX}%`);
          card.style.setProperty("--mouse-y", `${glareY}%`);
        });
      }

      card.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        if (hasGSAP && window.gsap) {
          window.gsap.fromTo(card, { scale: 1.05 }, { scale: 1, duration: 0.22, ease: "back.out(2)" });
        }
      });
    });

    // ScrollTrigger entrance for plan cards
    if (hasGSAP && hasScrollTrigger && !isReduced) {
      window.ScrollTrigger.create({
        trigger: sec.querySelector(".plan-deck-wrapper") || sec,
        start: "top 80%",
        once: true,
        onEnter: () => {
          window.gsap.from(cards, {
            y: 55,
            opacity: 0,
            scale: 0.92,
            duration: 0.95,
            stagger: 0.12,
            ease: "back.out(1.4)"
          });
        }
      });
    }
  }

  // ==========================================================================
  // Timeline Track & Step Interactivity
  // ==========================================================================
  function setupTimelineInteractions(hasGSAP, hasScrollTrigger) {
    const story = document.getElementById("story");
    if (!story) return;

    const steps = Array.from(story.querySelectorAll(".story-step"));
    const fill = story.querySelector(".story-timeline-fill");
    if (!steps.length) return;

    let currentProgress = 0.82; // Default ~82% as shown in screenshot

    const updateVisuals = (p) => {
      if (fill) fill.style.width = `${Math.min(100, Math.max(0, p * 100))}%`;
      steps.forEach((step, idx) => {
        const threshold = idx / (steps.length - 1) - 0.06;
        const isActive = p >= threshold;
        step.classList.toggle("active", isActive);
        step.classList.toggle("on", isActive);
      });
    };

    updateVisuals(currentProgress);

    if (hasGSAP && hasScrollTrigger && !isReduced) {
      window.ScrollTrigger.create({
        trigger: story,
        start: "top 78%",
        end: "bottom 35%",
        scrub: 0.6,
        onUpdate: (self) => {
          const prog = 0.28 + self.progress * 0.72;
          updateVisuals(prog);
        }
      });
    }

    steps.forEach((step, idx) => {
      step.addEventListener("click", () => {
        const targetP = idx / (steps.length - 1);
        if (hasGSAP && window.gsap) {
          window.gsap.to({ p: currentProgress }, {
            p: targetP,
            duration: 0.45,
            ease: "power2.out",
            onUpdate: function () {
              updateVisuals(this.targets()[0].p);
            },
            onComplete: () => {
              currentProgress = targetP;
            }
          });
        } else {
          currentProgress = targetP;
          updateVisuals(currentProgress);
        }
      });
    });
  }

  // ==========================================================================
  // GSAP + ScrollTrigger Implementation
  // ==========================================================================
  function initGSAPCardGrid(sec, cards, config) {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    // 1. Initial State: apply dataset rotation and start position
    cards.forEach((card) => {
      const rot = parseFloat(card.dataset.rot) || 0;
      card.dataset.restRot = rot;
      gsap.set(card, {
        y: 60,
        rotation: rot + (rot >= 0 ? 5 : -5),
        opacity: 0,
        scale: 0.92,
        transformPerspective: 850
      });
    });

    // 2. Entrance Animation on ScrollTrigger
    if (config.hasScrollTrigger) {
      ScrollTrigger.create({
        trigger: sec,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: (i, el) => parseFloat(el.dataset.restRot) || 0,
            duration: 1.05,
            stagger: { each: 0.08, from: "start" },
            ease: "back.out(1.4)",
            onComplete: () => startContinuousFloat(cards)
          });
        }
      });
    } else {
      gsap.to(cards, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: (i, el) => parseFloat(el.dataset.restRot) || 0,
        duration: 1.0,
        stagger: 0.08,
        ease: "back.out(1.4)",
        delay: 0.2,
        onComplete: () => startContinuousFloat(cards)
      });
    }

    // 3. Continuous Gentle Floating Effect
    function startContinuousFloat(cardList) {
      cardList.forEach((card, i) => {
        const rot = parseFloat(card.dataset.restRot) || 0;
        gsap.to(card, {
          y: `+=${4 + (i % 3) * 3}`,
          rotation: rot + (i % 2 === 0 ? 0.75 : -0.75),
          duration: 3.2 + (i % 3) * 0.5,
          delay: i * 0.12,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      });
    }

    // 4. Mouse Parallax Across the Section
    if (isFinePointer) {
      let mx = 0, my = 0, tx = 0, ty = 0;

      sec.addEventListener("mousemove", (e) => {
        const r = sec.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      });

      sec.addEventListener("mouseleave", () => {
        mx = 0;
        my = 0;
      });

      function parallaxLoop() {
        tx += (mx - tx) * 0.05;
        ty += (my - ty) * 0.05;

        cards.forEach((card) => {
          if (window.matchMedia("(max-width: 640px)").matches) {
            card.style.translate = "0px 0px";
          } else if (!card.dataset.isHovered) {
            const d = parseFloat(card.dataset.depth) || 8;
            card.style.translate = `${tx * d}px ${ty * d * 0.5}px`;
          }
        });

        requestAnimationFrame(parallaxLoop);
      }
      requestAnimationFrame(parallaxLoop);
    }

    // 5. 3D Hover Lift, Dynamic Tilt & Stereoscopic Depth
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        card.dataset.isHovered = "true";
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;

        // Move glare reflection point
        const glareX = ((e.clientX - r.left) / r.width) * 100;
        const glareY = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty("--mouse-x", `${glareX}%`);
        card.style.setProperty("--mouse-y", `${glareY}%`);

        const tilt = config.tiltFactor || 18;
        const scale = config.hoverScale || 1.05;
        const liftZ = config.liftZ || 30;

        // Dynamic 3D lighting shadow based on tilt angle
        const shadowX = -px * 30;
        const shadowY = -py * 25 + 24;

        gsap.to(card, {
          rotateX: -py * tilt,
          rotateY: px * tilt,
          translateZ: liftZ,
          scale: scale,
          y: -10,
          zIndex: 30,
          boxShadow: `${shadowX}px ${shadowY}px 55px -12px rgba(12, 131, 255, 0.22), 0 12px 24px -6px rgba(15, 23, 42, 0.08)`,
          duration: 0.35,
          ease: "power2.out",
          transformPerspective: 850,
          overwrite: "auto"
        });
      });

      card.addEventListener("mouseleave", () => {
        card.dataset.isHovered = "";
        const restRot = parseFloat(card.dataset.restRot) || 0;
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          translateZ: 0,
          scale: 1,
          y: 0,
          rotation: restRot,
          zIndex: 2,
          boxShadow: "",
          duration: 0.85,
          ease: "elastic.out(1, 0.6)",
          overwrite: "auto"
        });
      });

      // 6. Interactive Click Micro-Interaction
      card.addEventListener("click", () => {
        gsap.fromTo(
          card,
          { scale: (config.hoverScale || 1.04) * 1.06 },
          {
            scale: config.hoverScale || 1.04,
            duration: 0.18,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
          }
        );
      });
    });

    // 7. Scroll Fan-Out / Parallax Spread
    if (config.hasScrollTrigger && config.scrubMoves) {
      ScrollTrigger.create({
        trigger: sec,
        start: "top 90%",
        end: "bottom 10%",
        scrub: 0.75,
        onUpdate: (self) => {
          const p = self.progress;
          const moves = config.scrubMoves;
          const isCompact = window.matchMedia("(max-width: 640px)").matches;
          cards.forEach((card, i) => {
            if (moves[i] && !card.dataset.isHovered) {
              const rest = parseFloat(card.dataset.restRot) || 0;
              const shiftX = isCompact ? 0 : moves[i].x * (p - 0.5) * 1.6;
              const shiftRot = rest + moves[i].rot * (p - 0.5) * (isCompact ? 0.35 : 1);
              gsap.set(card, {
                x: shiftX,
                rotation: shiftRot,
                overwrite: "auto"
              });
            }
          });
        }
      });
    }
  }

  // ==========================================================================
  // Resilient Vanilla JS Fallback (offline / no-CDN mode)
  // ==========================================================================
  function initFallbackCardGrid(sec, cards, config) {
    cards.forEach((card) => {
      const rot = parseFloat(card.dataset.rot) || 0;
      card.style.transform = `rotate(${rot}deg)`;
      card.style.opacity = "1";

      if (isFinePointer && !isReduced) {
        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          const glareX = ((e.clientX - r.left) / r.width) * 100;
          const glareY = ((e.clientY - r.top) / r.height) * 100;
          card.style.setProperty("--mouse-x", `${glareX}%`);
          card.style.setProperty("--mouse-y", `${glareY}%`);
          card.style.transform = `perspective(850px) rotateX(${-py * 16}deg) rotateY(${px * 16}deg) translateY(-8px) translateZ(${config.liftZ || 25}px) scale(${config.hoverScale || 1.04})`;
          card.style.zIndex = "20";
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = `rotate(${rot}deg)`;
          card.style.zIndex = "2";
        });

        card.addEventListener("click", () => {
          card.style.transform = `scale(0.97) rotate(${rot}deg)`;
          setTimeout(() => {
            card.style.transform = `rotate(${rot}deg)`;
          }, 150);
        });
      }
    });
  }

  // Initialize once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllInteractiveCardSections);
  } else {
    initAllInteractiveCardSections();
  }
})();
