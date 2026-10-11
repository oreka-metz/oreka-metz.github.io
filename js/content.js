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
      if (texts[key] != null && String(texts[key]).trim() !== "") node.textContent = texts[key];
    });

    if (data.logo) {
      document.querySelectorAll("[data-logo]").forEach(function (img) {
        img.src = data.logo;
      });
    }

    const memberList = document.querySelector(".members");
    if (memberList && Array.isArray(data.members)) {
      memberList.replaceChildren();
      data.members.forEach(function (item, index) {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        const number = String(index + 1).padStart(2, "0");
        const prenom = (item.prenom || "").trim();
        const nom = (item.nom || "").trim();
        const role = (item.role || "").trim();
        const who = [prenom, nom].filter(Boolean).join(" ");
        let label = "Membre " + number + " du projet, IAE Metz.";
        if (who && role) label = who + ", " + role + ".";
        else if (who) label = who + ", membre du projet, IAE Metz.";
        else if (role) label = "Membre " + number + ", " + role + ".";
        button.setAttribute("data-label", label);
        button.setAttribute("aria-label", label);
        if (who || role) {
          button.classList.add("is-named");
          const mark = document.createElement("span");
          mark.className = "member-mark";
          mark.textContent = number;
          const name = document.createElement("span");
          name.className = "member-name";
          name.textContent = who || ("Membre " + number);
          button.append(mark, name);
          if (role) {
            const roleNode = document.createElement("span");
            roleNode.className = "member-role";
            roleNode.textContent = role;
            button.append(roleNode);
          }
        } else {
          button.textContent = number;
        }
        li.appendChild(button);
        memberList.appendChild(li);
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
