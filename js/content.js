(function () {
  const preview = new URLSearchParams(location.search).has("apercu");

  function apply(data) {
    if (!data) return;
    window.OREKA_SITE = data;
    const colors = data.colors || {};
    const root = document.documentElement;
    if (colors.bg) root.style.setProperty("--bg", colors.bg);
    if (colors.ink) root.style.setProperty("--ink", colors.ink);
    if (colors.muted) root.style.setProperty("--muted", colors.muted);
    if (colors.pink) root.style.setProperty("--pink", colors.pink);
    if (colors.pink2) {
      root.style.setProperty("--pink-2", colors.pink2);
      root.style.setProperty("--pink-soft", colors.pink2);
    }
    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme && colors.bg) theme.setAttribute("content", colors.bg);

    const texts = data.texts || {};
    document.querySelectorAll("[data-bind]").forEach(function (node) {
      const key = node.getAttribute("data-bind");
      if (texts[key] != null) node.textContent = texts[key];
    });

    if (data.logo) {
      document.querySelectorAll("[data-logo]").forEach(function (img) {
        img.src = data.logo;
      });
    }

    const stage = document.querySelector(".reel-stage");
    if (stage && Array.isArray(data.partners) && data.partners.length) {
      stage.replaceChildren();
      data.partners.forEach(function (item) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "reel-card";
        button.setAttribute("data-card", "");
        button.setAttribute("data-detail", item.detail || "");
        if (item.photo) {
          const photo = document.createElement("img");
          photo.className = "reel-photo";
          photo.alt = "";
          photo.src = item.photo;
          button.appendChild(photo);
        }
        const kicker = document.createElement("span");
        kicker.className = "reel-kicker";
        kicker.textContent = item.group || "";
        const name = document.createElement("strong");
        name.textContent = item.name || "";
        button.append(kicker, name);
        stage.appendChild(button);
      });
    }

    if (preview) {
      const bar = document.createElement("p");
      bar.className = "preview-banner";
      bar.textContent = "Aperçu local. Le site public n’affiche ce brouillon qu’après publication.";
      document.body.prepend(bar);
    }
  }

  function ready(data) {
    apply(data);
    window.OREKA_READY = true;
    document.dispatchEvent(new Event("oreka-content"));
  }

  if (preview) {
    try {
      const raw = localStorage.getItem("oreka-draft");
      if (raw) {
        ready(JSON.parse(raw));
        return;
      }
    } catch (error) { /* use the published file */ }
  }

  fetch("data/site.json", { cache: "no-store" })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (data) { ready(data); })
    .catch(function () { ready(null); });
})();
