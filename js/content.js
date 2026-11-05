(function () {
  const preview = new URLSearchParams(location.search).has("apercu");

  function apply(data) {
    if (!data) return;
    window.OREKA_SITE = data;
    const colors = data.colors || {};
    const root = document.documentElement;
    const colorVars = {
      bg: "--bg",
      surface: "--surface",
      ink: "--ink",
      muted: "--muted",
      faint: "--faint",
      pink: "--pink",
      pink2: "--pink-2",
      pinkSoft: "--pink-soft",
      inkOnPink: "--ink-on-pink",
      linkHover: "--link-hover",
      line: "--line-color",
      alert: "--alert",
      memberLight: "--member-light",
      memberLight2: "--member-light-2"
    };
    Object.keys(colorVars).forEach(function (key) {
      if (colors[key]) root.style.setProperty(colorVars[key], colors[key]);
    });
    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme && colors.bg) theme.setAttribute("content", colors.bg);

    const texts = data.texts || {};
    function value(key) {
      return texts[key] != null ? String(texts[key]) : null;
    }
    document.querySelectorAll("[data-bind]").forEach(function (node) {
      const key = node.getAttribute("data-bind");
      const next = value(key);
      if (next == null) return;
      node.textContent = next;
      if (node.tagName === "A" && key === "mentionsInbox" && next.indexOf("@") > 0) {
        node.setAttribute("href", "mailto:" + next.trim());
      }
    });
    document.querySelectorAll("[data-bind-aria]").forEach(function (node) {
      const next = value(node.getAttribute("data-bind-aria"));
      if (next != null) node.setAttribute("aria-label", next);
    });
    document.querySelectorAll("[data-bind-roledescription]").forEach(function (node) {
      const next = value(node.getAttribute("data-bind-roledescription"));
      if (next != null) node.setAttribute("aria-roledescription", next);
    });
    document.querySelectorAll("[data-bind-placeholder]").forEach(function (node) {
      const next = value(node.getAttribute("data-bind-placeholder"));
      if (next != null) node.setAttribute("placeholder", next);
    });
    document.querySelectorAll("[data-bind-alt]").forEach(function (node) {
      const next = value(node.getAttribute("data-bind-alt"));
      if (next != null) node.setAttribute("alt", next);
    });
    document.querySelectorAll("[data-bind-content]").forEach(function (node) {
      const next = value(node.getAttribute("data-bind-content"));
      if (next != null) node.setAttribute("content", next);
    });
    const titleKey = document.documentElement.getAttribute("data-title");
    if (titleKey && value(titleKey) != null) document.title = value(titleKey);
    const ld = document.getElementById("site-ld");
    if (ld) {
      try {
        const schema = JSON.parse(ld.textContent);
        if (value("schemaName") != null) schema.name = value("schemaName");
        if (value("schemaDescription") != null) schema.description = value("schemaDescription");
        if (schema.address && value("schemaCity") != null) schema.address.addressLocality = value("schemaCity");
        ld.textContent = JSON.stringify(schema);
      } catch (error) { /* keep the published schema */ }
    }
    document.querySelectorAll(".nav-toggle").forEach(function (toggle) {
      if (value("navMenu") != null) toggle.dataset.openLabel = value("navMenu");
      if (value("navClose") != null) toggle.dataset.closeLabel = value("navClose");
      if (toggle.getAttribute("aria-expanded") !== "true" && value("navMenu") != null) {
        toggle.textContent = value("navMenu");
      }
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
        const emptyLabel = (value("memberEmpty") || "Membre {n} du projet, IAE Metz.").replace("{n}", number);
        const namedLabel = (value("memberWithName") || "{who}, membre du projet, IAE Metz.").replace("{who}", who);
        const roleLabel = (value("memberWithRole") || "Membre {n}, {role}.").replace("{n}", number).replace("{role}", role);
        let label = emptyLabel;
        if (who && role) label = who + ", " + role + ".";
        else if (who) label = namedLabel;
        else if (role) label = roleLabel;
        button.setAttribute("data-label", label);
        button.setAttribute("aria-label", label);
        if (who || role) {
          button.classList.add("is-named");
          const mark = document.createElement("span");
          mark.className = "member-mark";
          mark.textContent = number;
          const name = document.createElement("span");
          name.className = "member-name";
          name.textContent = who || (value("memberNumberName") || "Membre {n}").replace("{n}", number);
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
      bar.textContent = value("previewBanner") || "Aperçu local. Le site public n’affiche ce brouillon qu’après publication.";
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
