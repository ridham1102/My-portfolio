/* =========================================================
   Ridham Arora — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Nav: scroll state, mobile toggle, active link ---------------- */
  const nav = document.getElementById("nav");
  const navLinks = document.getElementById("navLinks");
  const navToggle = document.getElementById("navToggle");

  const onScroll = () => {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Active link highlighting
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const linkFor = (id) => document.querySelector('.nav__links a[href="#' + id + '"]');
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const link = linkFor(e.target.id);
          if (!link) return;
          if (e.isIntersecting) {
            document.querySelectorAll(".nav__links a").forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revObserver.observe(el));
  }

  /* ---------------- Animated counters ---------------- */
  function formatNum(value, decimals) {
    return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-IN");
  }
  function animateCount(el) {
    const target = parseFloat(el.dataset.count || "0");
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    if (prefersReduced) {
      el.textContent = prefix + formatNum(target, decimals) + suffix;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + formatNum(target * eased, decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const counters = Array.from(document.querySelectorAll("[data-count]"));
  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => countObserver.observe(c));
  } else {
    counters.forEach(animateCount);
  }

  /* =========================================================
     DASHBOARD DEMO  (representative sample data)
     Swap these arrays with a real CSV export anytime.
     heat = avg PnL points, rows = Mon..Fri, cols = DTE 0..4
     equity = cumulative PnL (₹ lakhs) for years below
     ========================================================= */
  const YEARS = ["2019", "2020", "2021", "2022", "2023", "2024"];
  const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const DTE_COLS = ["0 DTE", "1", "2", "3", "4"];

  const DASH = {
    NIFTY: {
      heat: [
        [30, 16, 10, 5, -3],
        [44, 26, 14, 8, 1],
        [61, 37, 20, 9, 2],
        [78, 41, 18, -9, -16],
        [14, 7, 4, -2, -8],
      ],
      equity: [8, 19, 33, 30, 52, 74],
    },
    BANKNIFTY: {
      heat: [
        [52, 28, 12, -6, -14],
        [70, 39, 19, 4, -5],
        [96, 55, 26, 8, -2],
        [120, 62, 21, -18, -33],
        [22, 11, -4, -12, -20],
      ],
      equity: [11, 26, 47, 41, 73, 102],
    },
    FINNIFTY: {
      heat: [
        [18, 10, 6, 2, -2],
        [27, 15, 8, 3, 0],
        [-9, 4, 9, 5, 1],
        [44, 25, 11, -5, -10],
        [9, 5, 2, -3, -7],
      ],
      equity: [null, null, 9, 21, 38, 61],
    },
  };

  let currentIndex = "NIFTY";
  let equityChart = null;

  function cellStyle(v, maxAbs) {
    const t = Math.min(Math.abs(v) / maxAbs, 1);
    const hue = v >= 0 ? 152 : 2;
    const sat = 20 + t * 58;
    const light = 30 + t * 30;
    return {
      bg: "hsl(" + hue + " " + sat.toFixed(0) + "% " + light.toFixed(0) + "%)",
      fg: light > 46 ? "#06120d" : "rgba(255,255,255,0.92)",
    };
  }

  function renderHeatmap(indexKey) {
    const host = document.getElementById("heatmap");
    if (!host) return;
    const grid = DASH[indexKey].heat;
    const maxAbs = Math.max(...grid.flat().map((v) => Math.abs(v)), 1);
    host.innerHTML = "";

    // Header row
    const header = document.createElement("div");
    header.className = "hm-row";
    header.innerHTML =
      '<span class="hm-corner">Day \\ DTE</span>' +
      DTE_COLS.map((d) => '<span class="hm-head">' + d + "</span>").join("");
    host.appendChild(header);

    // Data rows
    grid.forEach((row, r) => {
      const rowEl = document.createElement("div");
      rowEl.className = "hm-row";
      rowEl.innerHTML = '<span class="hm-rowlabel">' + WEEKDAYS[r] + "</span>";
      row.forEach((v, c) => {
        const { bg, fg } = cellStyle(v, maxAbs);
        const cell = document.createElement("span");
        cell.className = "hm-cell";
        cell.style.background = bg;
        cell.style.color = fg;
        cell.textContent = v > 0 ? "+" + v : String(v);
        cell.title = WEEKDAYS[r] + " · " + DTE_COLS[c] + " → " + (v > 0 ? "+" : "") + v + " pts (avg)";
        rowEl.appendChild(cell);
      });
      host.appendChild(rowEl);
    });
  }

  function renderEquity(indexKey) {
    const canvas = document.getElementById("equityChart");
    if (!canvas || typeof Chart === "undefined") return;
    const data = DASH[indexKey].equity;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 280);
    grad.addColorStop(0, "rgba(45, 212, 191, 0.35)");
    grad.addColorStop(1, "rgba(45, 212, 191, 0)");

    if (equityChart) {
      equityChart.data.datasets[0].data = data;
      equityChart.data.datasets[0].label = indexKey + " cumulative PnL";
      equityChart.update();
      return;
    }

    equityChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: YEARS,
        datasets: [
          {
            label: indexKey + " cumulative PnL",
            data: data,
            borderColor: "#2dd4bf",
            backgroundColor: grad,
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: "#2dd4bf",
            spanGaps: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0a0e14",
            borderColor: "#2dd4bf",
            borderWidth: 1,
            padding: 10,
            callbacks: { label: (c) => " ₹" + c.parsed.y + " lakhs" },
          },
        },
        scales: {
          x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#6b7686" } },
          y: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: { color: "#6b7686", callback: (v) => "₹" + v + "L" },
          },
        },
        animation: prefersReduced ? false : { duration: 900, easing: "easeInOutQuart" },
      },
    });
  }

  function setIndex(indexKey) {
    if (!DASH[indexKey]) return;
    currentIndex = indexKey;
    document.querySelectorAll(".seg__btn").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.index === indexKey)
    );
    renderHeatmap(indexKey);
    renderEquity(indexKey);
  }

  document.querySelectorAll(".seg__btn").forEach((btn) =>
    btn.addEventListener("click", () => setIndex(btn.dataset.index))
  );

  function initDashboard() {
    renderHeatmap(currentIndex);
    renderEquity(currentIndex);
  }
  if (typeof Chart !== "undefined") {
    initDashboard();
  } else {
    window.addEventListener("load", initDashboard);
  }

  /* ---------------- Contact form ---------------- */
  const form = document.getElementById("contactForm");
  if (form) {
    const emailInput = document.getElementById("userEmail");
    const msgInput = document.getElementById("userMessage");
    const emailErr = document.getElementById("emailError");
    const msgErr = document.getElementById("messageError");
    const success = document.getElementById("formSuccess");
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const showErr = (el, m) => { if (el) { el.textContent = m; el.classList.add("show"); } };
    const hideErr = (el) => { if (el) { el.textContent = ""; el.classList.remove("show"); } };

    const validEmail = () => {
      const v = (emailInput.value || "").trim();
      if (!v) return showErr(emailErr, "Email is required"), false;
      if (!emailRe.test(v)) return showErr(emailErr, "Enter a valid email address"), false;
      return hideErr(emailErr), true;
    };
    const validMsg = () => {
      const v = (msgInput.value || "").trim();
      if (!v) return showErr(msgErr, "Message is required"), false;
      if (v.length < 10) return showErr(msgErr, "Please write at least 10 characters"), false;
      return hideErr(msgErr), true;
    };

    emailInput.addEventListener("input", () => hideErr(emailErr));
    msgInput.addEventListener("input", () => hideErr(msgErr));

    const SENT_MSG = success ? success.textContent : "";
    const MAIL_MSG = "📨 Opening your email app — just hit send and it reaches me directly.";
    const showSuccess = (msg) => {
      if (!success) return;
      success.textContent = msg || SENT_MSG;
      success.classList.remove("hidden");
      form.reset();
      setTimeout(() => success.classList.add("hidden"), 7000);
    };

    const openEmail = () => {
      const subject = encodeURIComponent("Portfolio contact from " + emailInput.value.trim());
      const body = encodeURIComponent("From: " + emailInput.value.trim() + "\n\n" + msgInput.value.trim());
      window.open("mailto:aridham1102@gmail.com?subject=" + subject + "&body=" + body, "_blank");
      showSuccess(MAIL_MSG);
    };

    // Netlify hosts the form backend; anywhere else (e.g. GitHub Pages) we open email
    // so a message is never silently dropped — and the UI says which path was taken.
    const isNetlify = /netlify\.app$/.test(location.hostname) || form.dataset.handler === "netlify";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const okEmail = validEmail();
      const okMsg = validMsg();
      if (!okEmail || !okMsg) return;

      if (!isNetlify) {
        openEmail();
        return;
      }

      const payload = new URLSearchParams(new FormData(form)).toString();
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload,
      })
        .then((r) => (r.ok ? showSuccess() : openEmail()))
        .catch(openEmail);
    });
  }
})();
