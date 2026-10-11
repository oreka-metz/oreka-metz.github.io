(function () {
  const inbox = (window.OREKA_INBOX || "").trim();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ROLES = {
    hotel: "hôtel",
    restaurant: "restaurant",
    traiteur: "traiteur",
    animateur: "animateur",
    dj: "DJ"
  };

  const GROUPS = {
    hotel: "du projet",
    restaurant: "du projet",
    traiteur: "du projet",
    animateur: "du jour J",
    dj: "du jour J"
  };

  function boot(name, fn) {
    try { fn(); }
    catch (error) { console.error(name, error); }
  }

  boot("progress", function () {
    const bar = document.querySelector(".scroll-progress");
    if (!bar) return;
    const paint = function () {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    };
    paint();
    window.addEventListener("scroll", paint, { passive: true });
    window.addEventListener("resize", paint);
  });

  boot("nav", function () {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "Menu";
      document.body.classList.remove("nav-open");
    }

    toggle.addEventListener("click", function () {
      const open = toggle.getAttribute("aria-expanded") === "true";
      if (open) close();
      else {
        nav.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.textContent = "Fermer";
        document.body.classList.add("nav-open");
      }
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) close();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") close();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080) close();
    });

    const links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
    const sections = links.map(function (link) {
      const id = (link.getAttribute("href") || "").split("#")[1];
      return id ? document.getElementById(id) : null;
    }).filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return;
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          const id = (link.getAttribute("href") || "").split("#")[1];
          if (id === entry.target.id) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 });
    sections.forEach(function (section) { spy.observe(section); });
  });

  boot("reveal", function () {
    const nodes = document.querySelectorAll(".reveal");
    if (!nodes.length || reduced || !("IntersectionObserver" in window)) {
      nodes.forEach(function (node) { node.classList.add("in"); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    nodes.forEach(function (node) { io.observe(node); });
  });

  boot("tabs", function () {
    const tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    function select(index, focus) {
      tabs.forEach(function (tab, i) {
        const on = i === index;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
        if (on && focus) tab.focus();
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { select(index, false); });
      tab.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
        event.preventDefault();
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        select(next, true);
      });
    });
  });

  boot("faq", function () {
    document.querySelectorAll(".faq-q").forEach(function (button) {
      button.addEventListener("click", function () {
        const panel = document.getElementById(button.getAttribute("aria-controls"));
        const open = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", open ? "false" : "true");
        if (panel) panel.hidden = open;
      });
    });
  });

  boot("members", function () {
    const caption = document.getElementById("member-caption");
    if (!caption) return;
    document.querySelectorAll(".members button").forEach(function (button) {
      function mark() {
        document.querySelectorAll(".members button").forEach(function (other) {
          other.classList.toggle("is-on", other === button);
        });
        caption.textContent = button.getAttribute("data-label");
      }
      button.addEventListener("mouseenter", mark);
      button.addEventListener("focus", mark);
      button.addEventListener("click", mark);
    });
  });

  boot("network", function () {
    const canvases = document.querySelectorAll("canvas[data-network]");
    canvases.forEach(mountNetwork);
  });

  function mountNetwork(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let running = true;
    let looping = false;
    let appear = 0;

    function draw(time) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 300;
      const h = canvas.clientHeight || 220;
      const pw = Math.round(w * dpr);
      const ph = Math.round(h * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const want = canvas.dataset.active === "1" ? 1 : 0;
      appear += (want - appear) * (reduced ? 1 : 0.08);
      if (Math.abs(want - appear) < 0.002) appear = want;

      const cx = w * 0.5;
      const cy = h * 0.52;
      const unit = Math.min(w, h);
      const ox = canvas.dataset.mode === "hero" && canvas._px ? canvas._px * 14 : 0;
      const oy = canvas.dataset.mode === "hero" && canvas._py ? canvas._py * 10 : 0;
      const nodes = [
        { x: cx - unit * 0.055 + ox * 0.2, y: cy + oy * 0.2, r: Math.max(10, unit * 0.045), c: "#F61C96" },
        { x: cx + unit * 0.055 + ox * 0.2, y: cy + oy * 0.2, r: Math.max(10, unit * 0.045), c: "#FA5BB2" }
      ];

      for (let i = 0; i < 13; i += 1) {
        const angle = -Math.PI / 2 + (i / 13) * Math.PI * 2;
        const wobble = reduced ? 0 : Math.sin(time / 900 + i) * 4;
        const radius = unit * (canvas.dataset.mode === "hero" ? 0.34 : 0.3) + wobble;
        nodes.push({
          x: cx + Math.cos(angle) * radius + ox,
          y: cy + Math.sin(angle) * radius * 0.86 + oy,
          r: Math.max(3.2, unit * 0.012),
          c: i % 2 ? "#FA5BB2" : "#F61C96",
          student: true,
          i: i
        });
      }

      if (appear > 0.01) {
        const radius = unit * 0.3;
        nodes.push({
          x: cx + Math.cos(-0.4) * radius * (0.35 + appear * 0.85),
          y: cy + Math.sin(-0.4) * radius * 0.86,
          r: Math.max(6, unit * 0.02),
          c: "#d01278",
          partner: true
        });
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < 13; i += 1) {
        const a = nodes[2 + i];
        const b = nodes[2 + ((i + 1) % 13)];
        ctx.strokeStyle = "rgba(224, 19, 134, 0.28)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.strokeStyle = "rgba(246, 28, 150, 0.28)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(nodes[i % 2].x, nodes[i % 2].y);
        ctx.stroke();
      }

      const partner = nodes.find(function (node) { return node.partner; });
      if (partner) {
        ctx.strokeStyle = "rgba(209, 18, 120, 0.85)";
        ctx.beginPath();
        ctx.moveTo(partner.x, partner.y);
        ctx.lineTo(nodes[0].x, nodes[0].y);
        ctx.stroke();
      }

      nodes.forEach(function (node) {
        if (node.partner) {
          ctx.beginPath();
          ctx.fillStyle = "rgba(246, 28, 150, 0.28)";
          ctx.arc(node.x, node.y, node.r + 8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.fillStyle = node.c;
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (partner && canvas.dataset.label) {
        ctx.fillStyle = "#2a1220";
        ctx.font = "600 13px Manrope, Segoe UI, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(canvas.dataset.label, partner.x, partner.y + partner.r + 16);
      }
    }

    function frame(time) {
      draw(time || 0);
      if (!reduced && running) requestAnimationFrame(frame);
      else looping = false;
    }

    function kick() {
      if (reduced) {
        draw(0);
        return;
      }
      if (looping) return;
      looping = true;
      requestAnimationFrame(frame);
    }

    if ("IntersectionObserver" in window) {
      const watch = new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
        if (running) kick();
      });
      watch.observe(canvas);
    }

    if (canvas.dataset.mode === "hero") {
      const move = function (event) {
        const rect = canvas.getBoundingClientRect();
        canvas._px = (event.clientX - rect.left) / rect.width - 0.5;
        canvas._py = (event.clientY - rect.top) / rect.height - 0.5;
      };
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerleave", function () {
        canvas._px = 0;
        canvas._py = 0;
      });
    }

    window.addEventListener("resize", function () { draw(performance.now()); });
    kick();
    canvas._redraw = function () { draw(performance.now()); kick(); };
  }

  boot("countdown", function () {
    const root = document.querySelector("[data-countdown]");
    if (!root) return;
    let target = new Date("2027-03-20T18:00:00+01:00").getTime();
    let whenLabel = "20 mars 2027";
    let lastSpoken = "";

    function useSiteDate() {
      const iso = window.OREKA_SITE && window.OREKA_SITE.countdown;
      if (!iso) return;
      const next = new Date(iso).getTime();
      if (Number.isNaN(next)) return;
      target = next;
      whenLabel = new Date(iso).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Paris"
      });
      lastSpoken = "";
    }

    if (window.OREKA_READY) useSiteDate();
    document.addEventListener("oreka-content", useSiteDate);
    const units = {
      days: root.querySelector('[data-count="days"]'),
      hours: root.querySelector('[data-count="hours"]'),
      minutes: root.querySelector('[data-count="minutes"]'),
      seconds: root.querySelector('[data-count="seconds"]')
    };
    const live = document.getElementById("count-live");

    function pad(value) {
      return String(value).padStart(2, "0");
    }

    function tick() {
      let diff = target - Date.now();
      if (diff < 0) diff = 0;
      const total = Math.floor(diff / 1000);
      const days = Math.floor(total / 86400);
      const hours = Math.floor((total % 86400) / 3600);
      const minutes = Math.floor((total % 3600) / 60);
      const seconds = total % 60;
      if (units.days) units.days.textContent = String(days);
      if (units.hours) units.hours.textContent = pad(hours);
      if (units.minutes) units.minutes.textContent = pad(minutes);
      if (units.seconds) units.seconds.textContent = pad(seconds);
      const spoken = diff === 0
        ? "La date indicative du jour J est atteinte."
        : days + " jours, " + hours + " heures et " + minutes + " minutes avant le jour J, date indicative du " + whenLabel + ".";
      if (live && spoken !== lastSpoken && (seconds === 0 || lastSpoken === "")) {
        live.textContent = spoken;
        lastSpoken = spoken;
      }
    }

    tick();
    window.setInterval(tick, 1000);
  });

  function mountReel() {
    const root = document.querySelector("[data-reel]");
    if (!root) return;
    const stage = root.querySelector(".reel-stage");
    const cards = Array.prototype.slice.call(root.querySelectorAll("[data-card]"));
    const detail = document.getElementById("reel-detail");
    const n = cards.length;
    if (!stage || !n) return;
    const step = 360 / n;
    let angle = 0;
    let target = 0;
    let dragging = false;
    let paused = false;
    let visible = true;
    let lastX = 0;
    let holdUntil = 0;

    function hold() {
      holdUntil = performance.now() + 3200;
    }

    function nearest(desired) {
      const turns = Math.round((target - desired) / 360);
      return desired + turns * 360;
    }

    function frontIndex(value) {
      let best = 0;
      let bestCos = -2;
      for (let i = 0; i < n; i += 1) {
        const depth = Math.cos((value + i * step) * Math.PI / 180);
        if (depth > bestCos) {
          bestCos = depth;
          best = i;
        }
      }
      return best;
    }

    function render() {
      const radius = Math.max(168, Math.min(430, stage.clientWidth * 0.4));
      const front = frontIndex(angle);
      cards.forEach(function (card, i) {
        const theta = (angle + i * step) * Math.PI / 180;
        const depth = Math.cos(theta);
        const x = Math.sin(theta) * radius;
        const scale = depth > 0.85 ? 1 : 0.84;
        const opacity = depth < 0.12 ? 0 : Math.min(1, (depth - 0.12) / 0.88);
        card.style.transform = "translate(-50%, -50%) translateX(" + x.toFixed(1) + "px) scale(" + scale.toFixed(3) + ")";
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = String(Math.round((depth + 1) * 40));
        card.style.pointerEvents = depth < 0.2 ? "none" : "auto";
        const on = i === front;
        card.classList.toggle("is-front", on);
        card.tabIndex = on ? 0 : -1;
      });
      if (detail) detail.textContent = cards[front].getAttribute("data-detail") || "";
    }

    function frame(now) {
      if (visible && !dragging && !paused && !reduced) {
        if (!holdUntil) holdUntil = now + 2800;
        if (now >= holdUntil) {
          target -= step;
          holdUntil = now + 2800;
        }
      }
      angle += (target - angle) * (reduced ? 1 : 0.08);
      if (Math.abs(target - angle) < 0.04) angle = target;
      render();
      window.requestAnimationFrame(frame);
    }

    const prev = root.querySelector("[data-prev]");
    const next = root.querySelector("[data-next]");
    if (prev) prev.addEventListener("click", function () { target += step; hold(); });
    if (next) next.addEventListener("click", function () { target -= step; hold(); });

    cards.forEach(function (card, i) {
      card.addEventListener("click", function () {
        target = nearest(-i * step);
        hold();
      });
    });

    stage.addEventListener("pointerdown", function (event) {
      if (event.target.closest(".reel-arrow")) return;
      dragging = true;
      paused = true;
      lastX = event.clientX;
      if (stage.setPointerCapture) stage.setPointerCapture(event.pointerId);
    });
    stage.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      lastX = event.clientX;
      target += dx * 0.42;
      angle = target;
      hold();
    });
    function endDrag() {
      dragging = false;
      paused = false;
    }
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    root.addEventListener("mouseenter", function () { paused = true; });
    root.addEventListener("mouseleave", function () {
      if (!dragging) paused = false;
    });
    root.addEventListener("focusin", function () { paused = true; });
    root.addEventListener("focusout", function (event) {
      if (!root.contains(event.relatedTarget)) paused = false;
    });
    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        target -= step;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        target += step;
      }
    });

    if ("IntersectionObserver" in window) {
      const watch = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      });
      watch.observe(root);
    }

    render();
    window.requestAnimationFrame(frame);
  }

  boot("reel", function () {
    if (window.OREKA_READY) {
      mountReel();
      return;
    }
    let started = false;
    const go = function () {
      if (started) return;
      started = true;
      mountReel();
    };
    document.addEventListener("oreka-content", go);
    window.setTimeout(go, 2200);
  });

  boot("form", function () {
    const form = document.getElementById("partner-form");
    if (!form) return;
    const sentence = document.getElementById("network-sentence");
    const status = document.getElementById("network-status");
    const canvas = document.getElementById("studio-net");
    const alertBox = document.getElementById("form-alert");
    const success = document.getElementById("form-success");
    const preview = document.getElementById("message-preview");
    const submit = form.querySelector("[type=submit]");
    const fieldsWrap = document.getElementById("form-body");
    if (inbox && submit) submit.textContent = "Envoyer la demande";

    function selectedRole() {
      const input = form.querySelector('input[name="role"]:checked');
      return input ? input.value : "";
    }

    function valueOf(id) {
      const el = document.getElementById(id);
      return el ? el.value.trim() : "";
    }

    function refresh() {
      const role = selectedRole();
      const org = valueOf("structure");
      const bits = [];
      if (!role) bits.push("Choisissez hôtel, restaurant, traiteur, animateur ou DJ.");
      else bits.push("Partenaire " + GROUPS[role] + " : " + ROLES[role] + ".");
      if (org) bits.push("Établissement : " + org + ".");
      if (sentence) sentence.textContent = bits.join(" ");
      if (status) status.textContent = role ? "Place esquissée" : "En attente";
      [canvas, document.getElementById("hero-net")].forEach(function (board) {
        if (!board) return;
        board.dataset.active = role ? "1" : "0";
        board.dataset.label = role ? ROLES[role] : "";
        if (board._redraw) board._redraw();
      });
    }

    function showError(id, message) {
      const field = document.getElementById(id);
      const err = document.getElementById("err-" + id);
      if (field) {
        if (message) {
          field.setAttribute("aria-invalid", "true");
          field.setAttribute("aria-describedby", "err-" + id);
        } else {
          field.removeAttribute("aria-invalid");
          field.removeAttribute("aria-describedby");
        }
      }
      if (err) {
        err.hidden = !message;
        err.textContent = message || "";
      }
      return !message;
    }

    function validate() {
      const problems = [];
      const roleOk = showError("role-set", selectedRole() ? "" : "Choisissez un type de partenaire.");
      if (!roleOk) problems.push(["role-set", "Choisir un type"]);
      const nom = valueOf("nom");
      if (!showError("nom", nom.length >= 2 ? "" : "Indiquez votre nom.")) problems.push(["nom", "Nom"]);
      const structure = valueOf("structure");
      if (!showError("structure", structure.length >= 2 ? "" : "Indiquez l’établissement.")) problems.push(["structure", "Établissement"]);
      const email = valueOf("email");
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!showError("email", emailOk ? "" : "Indiquez un e-mail valide.")) problems.push(["email", "E-mail"]);
      const consent = document.getElementById("consent");
      const consentOk = consent && consent.checked;
      showError("consent", consentOk ? "" : "Confirmez l’usage de ces informations.");
      if (!consentOk) problems.push(["consent", "Confirmation"]);

      if (alertBox) {
        if (!problems.length) {
          alertBox.hidden = true;
          alertBox.innerHTML = "";
        } else {
          alertBox.hidden = false;
          alertBox.innerHTML = "<strong>Il reste " + problems.length + (problems.length > 1 ? " points" : " point") + " à compléter.</strong>";
          problems.forEach(function (item) {
            const link = document.createElement("a");
            link.href = "#" + item[0];
            link.textContent = item[1];
            alertBox.append(" ");
            alertBox.append(link);
          });
          const first = document.getElementById(problems[0][0]);
          if (first && first.focus) first.focus();
        }
      }
      return problems.length === 0;
    }

    function compose() {
      const role = ROLES[selectedRole()] || "";
      const when = new Date().toLocaleDateString("fr-FR", { dateStyle: "long" });
      const lines = [
        "Demande de partenariat — OREKA",
        "Date : " + when,
        "Nom : " + valueOf("nom"),
        "Établissement : " + valueOf("structure"),
        "Place : partenaire " + (GROUPS[selectedRole()] || ""),
        "Type : " + role,
        "E-mail : " + valueOf("email")
      ];
      if (valueOf("message")) {
        lines.push("");
        lines.push(valueOf("message"));
      }
      return lines.join("\n");
    }

    function saveDraft() {
      try {
        const data = {
          role: selectedRole(),
          nom: valueOf("nom"),
          structure: valueOf("structure"),
          email: valueOf("email"),
          message: valueOf("message"),
          consent: document.getElementById("consent").checked
        };
        sessionStorage.setItem("oreka-partner-draft", JSON.stringify(data));
      } catch (error) { /* session unavailable */ }
    }

    function restoreDraft() {
      try {
        const raw = sessionStorage.getItem("oreka-partner-draft");
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data.role) {
          const radio = form.querySelector('input[name="role"][value="' + data.role + '"]');
          if (radio) radio.checked = true;
        }
        ["nom", "structure", "email", "message"].forEach(function (id) {
          const el = document.getElementById(id);
          if (el && data[id]) el.value = data[id];
        });
        if (data.consent) document.getElementById("consent").checked = true;
      } catch (error) { /* ignore broken draft */ }
    }

    async function copyText(text) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        const area = document.createElement("textarea");
        area.value = text;
        document.body.appendChild(area);
        area.select();
        let ok = false;
        try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
        area.remove();
        return ok;
      }
    }

    async function send(text) {
      if (!inbox) return false;
      const response = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(inbox), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: valueOf("nom"),
          email: valueOf("email"),
          structure: valueOf("structure"),
          profil: ROLES[selectedRole()] || "",
          place: GROUPS[selectedRole()] || "",
          message: text,
          _subject: "Partenariat OREKA — " + valueOf("structure"),
          _template: "table",
          _captcha: "false"
        })
      });
      if (!response.ok) return false;
      const data = await response.json().catch(function () { return {}; });
      return data.success === true || data.success === "true";
    }

    restoreDraft();
    refresh();

    form.addEventListener("input", function () {
      refresh();
      saveDraft();
    });
    form.addEventListener("change", function () {
      refresh();
      saveDraft();
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (!validate()) return;
      const text = compose();
      if (submit) {
        submit.disabled = true;
        submit.textContent = "Préparation…";
      }
      let sent = false;
      try { sent = await send(text); }
      catch (error) { sent = false; }
      const copied = await copyText(text);
      if (preview) preview.textContent = text;
      const title = document.getElementById("success-title");
      const lead = document.getElementById("success-lead");
      if (sent) {
        if (title) title.textContent = "Demande envoyée";
        if (lead) lead.textContent = "Le collectif a reçu votre message et peut vous répondre à l’adresse indiquée. Une copie est aussi dans le presse-papiers.";
      } else if (inbox) {
        if (title) title.textContent = "Demande prête";
        if (lead) lead.textContent = copied
          ? "L’envoi automatique n’a pas abouti. Le message est copié : transmettez-le au collectif."
          : "L’envoi automatique n’a pas abouti. Copiez le message ci-dessous et transmettez-le au collectif.";
      } else {
        if (title) title.textContent = "Demande prête";
        if (lead) lead.textContent = "Ouvrez le message dans votre e-mail pour l’adresser au collectif, ou copiez-le.";
      }
      const mail = document.getElementById("mailto-link");
      if (mail) {
        mail.href = "mailto:" + (inbox || "")
          + "?subject=" + encodeURIComponent("Partenariat OREKA — " + valueOf("structure"))
          + "&body=" + encodeURIComponent(text);
      }
      if (fieldsWrap) fieldsWrap.hidden = true;
      if (success) success.hidden = false;
      try { sessionStorage.removeItem("oreka-partner-draft"); } catch (error) { /* ignore */ }
      if (submit) {
        submit.disabled = false;
        submit.textContent = inbox ? "Envoyer la demande" : "Composer la demande";
      }
      if (success) success.focus();
    });

    const again = document.getElementById("new-request");
    if (again) {
      again.addEventListener("click", function () {
        form.reset();
        refresh();
        if (fieldsWrap) fieldsWrap.hidden = false;
        if (success) success.hidden = true;
        document.getElementById("nom").focus();
      });
    }

    const copyBtn = document.getElementById("copy-message");
    if (copyBtn) {
      copyBtn.addEventListener("click", async function () {
        const ok = await copyText(preview ? preview.textContent : "");
        copyBtn.textContent = ok ? "Message copié" : "Copie impossible";
      });
    }
  });
})();
