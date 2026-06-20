(function(){
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll(){
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  function closeMobileNav(){
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    mobileNav.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function openMobileNav(){
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    mobileNav.classList.add("is-open");
    mobileNav.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  if (navToggle && mobileNav){
    navToggle.addEventListener("click", function(){
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) closeMobileNav();
      else openMobileNav();
    });

    mobileNav.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click", closeMobileNav);
    });

    document.addEventListener("keydown", function(e){
      if (e.key === "Escape") closeMobileNav();
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion){
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach(function(el){ revealObserver.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("is-visible"); });
  }

  /* ---------- Animated stat counters ---------- */
  var statEls = document.querySelectorAll(".stat-num");

  function animateCount(el){
    var target = parseFloat(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion || isNaN(target)){
      el.textContent = target.toLocaleString() + suffix;
      return;
    }
    var duration = 1400;
    var start = null;

    function step(timestamp){
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(step);
  }

  if (statEls.length){
    if ("IntersectionObserver" in window){
      var statObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      statEls.forEach(function(el){ statObserver.observe(el); });
    } else {
      statEls.forEach(animateCount);
    }
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function(item){
    var question = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    answer.style.maxHeight = "0px";

    question.addEventListener("click", function(){
      var isOpen = question.getAttribute("aria-expanded") === "true";

      faqItems.forEach(function(other){
        var otherQuestion = other.querySelector(".faq-question");
        var otherAnswer = other.querySelector(".faq-answer");
        if (otherQuestion !== question){
          otherQuestion.setAttribute("aria-expanded", "false");
          otherAnswer.style.maxHeight = "0px";
        }
      });

      if (isOpen){
        question.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = "0px";
      } else {
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* Recalculate open FAQ height on resize (text reflow) */
  window.addEventListener("resize", function(){
    faqItems.forEach(function(item){
      var question = item.querySelector(".faq-question");
      var answer = item.querySelector(".faq-answer");
      if (question && answer && question.getAttribute("aria-expanded") === "true"){
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

})();
