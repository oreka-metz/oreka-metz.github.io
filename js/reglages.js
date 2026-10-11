(function () {
  const REPO = "oreka-metz/oreka-metz.github.io";
  const gate = document.getElementById("gate");
  const editor = document.getElementById("editor");
  const status = document.getElementById("status");
  let site = null;

  function showStatus(message) {
    status.hidden = false;
    status.textContent = message;
  }

  async function digest(text) {
    const bytes = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(buf)).map(function (n) {
      return n.toString(16).padStart(2, "0");
    }).join("");
  }

  function parisISO(localValue) {
    const bits = localValue.split("T");
    const date = bits[0].split("-").map(Number);
    const time = bits[1].split(":").map(Number);
    const desired = Date.UTC(date[0], date[1] - 1, date[2], time[0], time[1], 0);
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Paris",
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    function wall(instant) {
      const map = {};
      formatter.formatToParts(new Date(instant)).forEach(function (part) {
        map[part.type] = part.value;
      });
      return Date.UTC(+map.year, +map.month - 1, +map.day, +map.hour, +map.minute, +map.second);
    }
    let instant = desired;
    for (let i = 0; i < 3; i += 1) instant += desired - wall(instant);
    const offsetMin = Math.round((desired - instant) / 60000);
    const sign = offsetMin >= 0 ? "+" : "-";
    const abs = Math.abs(offsetMin);
    const hh = String(Math.floor(abs / 60)).padStart(2, "0");
    const mm = String(abs % 60).padStart(2, "0");
    return localValue + ":00" + sign + hh + ":" + mm;
  }

  function phrasesFrom(iso) {
    const date = new Date(iso);
    const long = date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Paris"
    });
    const month = date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
      timeZone: "Europe/Paris"
    });
    return {
      eyebrow: "Jour J · " + month,
      countNote: "Date indicative : " + long + ". Le collectif confirmera le jour exact."
    };
  }

  function readFile(file, png) {
    return new Promise(function (resolve, reject) {
      const image = new Image();
      image.onload = function () {
        const max = png ? 1400 : 900;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        const type = png ? "image/png" : "image/jpeg";
        canvas.toBlob(function (blob) {
          const reader = new FileReader();
          reader.onload = function () { resolve(reader.result); };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }, type, 0.86);
        URL.revokeObjectURL(image.src);
      };
      image.onerror = reject;
      image.src = URL.createObjectURL(file);
    });
  }

  function partnerCard(item) {
    const box = document.createElement("div");
    box.className = "partner-edit";
    box.innerHTML = ""
      + "<div class=\"row\">"
      + "<label>Nom <input data-p=\"name\"></label>"
      + "<label>Place <select data-p=\"group\"><option>Pour le projet</option><option>Pour le jour J</option></select></label>"
      + "</div>"
      + "<label>Texte <input data-p=\"detail\"></label>"
      + "<div class=\"partner-tools\">"
      + "<img data-photo alt=\"\" hidden>"
      + "<label class=\"mini\">Photo <input data-file type=\"file\" accept=\"image/png,image/jpeg,image/webp\" hidden></label>"
      + "<button class=\"mini\" type=\"button\" data-up>Monter</button>"
      + "<button class=\"mini\" type=\"button\" data-down>Descendre</button>"
      + "<button class=\"mini\" type=\"button\" data-clear>Retirer la photo</button>"
      + "<button class=\"mini\" type=\"button\" data-remove>Supprimer</button>"
      + "</div>";
    box.querySelector('[data-p="name"]').value = item.name || "";
    box.querySelector('[data-p="group"]').value = item.group || "Pour le projet";
    box.querySelector('[data-p="detail"]').value = item.detail || "";
    const photo = box.querySelector("[data-photo]");
    photo.dataset.value = item.photo || "";
    if (item.photo) {
      photo.src = item.photo;
      photo.hidden = false;
    }
    box.querySelector("[data-file]").addEventListener("change", async function (event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const data = await readFile(file, false);
      photo.dataset.value = data;
      photo.src = data;
      photo.hidden = false;
      saveDraft();
    });
    box.querySelector("[data-clear]").addEventListener("click", function () {
      photo.dataset.value = "";
      photo.removeAttribute("src");
      photo.hidden = true;
      saveDraft();
    });
    box.querySelector("[data-remove]").addEventListener("click", function () {
      box.remove();
      saveDraft();
    });
    box.querySelector("[data-up]").addEventListener("click", function () {
      const prev = box.previousElementSibling;
      if (prev) box.parentNode.insertBefore(box, prev);
      saveDraft();
    });
    box.querySelector("[data-down]").addEventListener("click", function () {
      const next = box.nextElementSibling;
      if (next) box.parentNode.insertBefore(next, box);
      saveDraft();
    });
    box.addEventListener("input", saveDraft);
    return box;
  }

  function renderPartners(list) {
    const root = document.getElementById("partner-list");
    root.replaceChildren();
    (list || []).forEach(function (item) {
      root.appendChild(partnerCard(item));
    });
  }

  function fill(data) {
    site = data;
    const local = (data.countdown || "").slice(0, 16);
    document.getElementById("field-countdown").value = local;
    document.querySelectorAll("[data-text]").forEach(function (field) {
      const key = field.getAttribute("data-text");
      field.value = (data.texts && data.texts[key]) || "";
    });
    const colors = data.colors || {};
    document.getElementById("color-bg").value = colors.bg || "#fff7fb";
    document.getElementById("color-ink").value = colors.ink || "#2a1220";
    document.getElementById("color-muted").value = colors.muted || "#5c3a4a";
    document.getElementById("color-pink").value = colors.pink || "#f61c96";
    document.getElementById("color-pink2").value = colors.pink2 || "#d01278";
    const logo = document.getElementById("logo-preview");
    logo.src = data.logo || "assets/logo-officiel.png?v=2";
    logo.dataset.value = data.logo || "";
    renderPartners(data.partners || []);
    document.documentElement.style.setProperty("--bg", colors.bg || "#fff7fb");
    document.documentElement.style.setProperty("--pink", colors.pink || "#f61c96");
  }

  function collect() {
    const texts = {};
    document.querySelectorAll("[data-text]").forEach(function (field) {
      texts[field.getAttribute("data-text")] = field.value.trim();
    });
    const partners = Array.prototype.map.call(document.querySelectorAll(".partner-edit"), function (box) {
      return {
        name: box.querySelector('[data-p="name"]').value.trim(),
        group: box.querySelector('[data-p="group"]').value,
        detail: box.querySelector('[data-p="detail"]').value.trim(),
        photo: box.querySelector("[data-photo]").dataset.value || ""
      };
    }).filter(function (item) { return item.name; });
    const local = document.getElementById("field-countdown").value;
    return {
      logo: document.getElementById("logo-preview").dataset.value || site.logo,
      countdown: local ? parisISO(local) : site.countdown,
      colors: {
        bg: document.getElementById("color-bg").value,
        ink: document.getElementById("color-ink").value,
        muted: document.getElementById("color-muted").value,
        pink: document.getElementById("color-pink").value,
        pink2: document.getElementById("color-pink2").value
      },
      texts: texts,
      partners: partners
    };
  }

  function saveDraft() {
    try {
      localStorage.setItem("oreka-draft", JSON.stringify(collect()));
    } catch (error) {
      showStatus("Le brouillon est trop lourd pour ce navigateur. Publiez, ou utilisez des photos plus petites.");
    }
  }

  async function openEditor() {
    gate.hidden = true;
    editor.hidden = false;
    let data = null;
    try {
      const raw = localStorage.getItem("oreka-draft");
      if (raw) data = JSON.parse(raw);
    } catch (error) { data = null; }
    if (!data) {
      const response = await fetch("data/site.json", { cache: "no-store" });
      data = await response.json();
    } else {
      showStatus("Brouillon de ce navigateur repris. Le site public n’a pas encore changé.");
    }
    fill(data);
    const saved = localStorage.getItem("oreka-token") || "";
    if (saved) document.getElementById("token").value = saved;
  }

  document.getElementById("gate-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const code = document.getElementById("gate-code").value;
    const hash = await digest(code);
    const error = document.getElementById("gate-error");
    if (hash !== window.OREKA_GATE) {
      error.hidden = false;
      return;
    }
    sessionStorage.setItem("oreka-gate", "ok");
    error.hidden = true;
    openEditor();
  });

  if (sessionStorage.getItem("oreka-gate") === "ok") openEditor();

  document.getElementById("field-countdown").addEventListener("input", function () {
    if (!document.getElementById("sync-date-text").checked) {
      saveDraft();
      return;
    }
    const local = document.getElementById("field-countdown").value;
    if (!local) return;
    const lines = phrasesFrom(parisISO(local));
    document.getElementById("field-eyebrow").value = lines.eyebrow;
    document.getElementById("field-countNote").value = lines.countNote;
    saveDraft();
  });

  document.getElementById("editor").addEventListener("input", function (event) {
    if (event.target.id === "token" || event.target.id === "field-countdown") return;
    saveDraft();
  });

  document.getElementById("field-logo").addEventListener("change", async function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const png = file.type === "image/png";
    const data = await readFile(file, png);
    const logo = document.getElementById("logo-preview");
    logo.src = data;
    logo.dataset.value = data;
    saveDraft();
  });

  document.getElementById("add-partner").addEventListener("click", function () {
    document.getElementById("partner-list").appendChild(partnerCard({
      name: "",
      group: "Pour le projet",
      detail: "",
      photo: ""
    }));
  });

  document.getElementById("preview-link").addEventListener("click", saveDraft);

  function toBase64(bytes) {
    let binary = "";
    const size = 0x8000;
    for (let i = 0; i < bytes.length; i += size) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + size));
    }
    return btoa(binary);
  }

  async function putFile(token, path, base64, message) {
    const url = "https://api.github.com/repos/" + REPO + "/contents/" + path.split("/").map(encodeURIComponent).join("/");
    let sha = "";
    const current = await fetch(url, {
      headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json" }
    });
    if (current.ok) sha = (await current.json()).sha;
    else if (current.status !== 404) throw new Error("Lecture impossible (" + current.status + ").");
    const body = { message: message, content: base64, branch: "main" };
    if (sha) body.sha = sha;
    const saved = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!saved.ok) {
      const detail = await saved.json().catch(function () { return {}; });
      throw new Error(detail.message || ("Publication impossible (" + saved.status + ")."));
    }
  }

  document.getElementById("publish").addEventListener("click", async function () {
    const token = document.getElementById("token").value.trim();
    if (!token) {
      showStatus("Collez le jeton GitHub pour publier. L’aperçu, lui, fonctionne sans jeton.");
      return;
    }
    const button = document.getElementById("publish");
    button.disabled = true;
    try {
      const next = collect();
      if (!next.partners.length) throw new Error("Ajoutez au moins un partenaire.");
      showStatus("Envoi en cours…");
      if (next.logo.indexOf("data:") === 0) {
        const ext = next.logo.indexOf("image/png") === 5 ? "png" : "jpg";
        const path = "assets/uploads/logo-" + Date.now() + "." + ext;
        await putFile(token, path, next.logo.split(",")[1], "Mettre à jour le logo OREKA.");
        next.logo = path + "?v=" + Date.now();
      }
      for (let i = 0; i < next.partners.length; i += 1) {
        const photo = next.partners[i].photo;
        if (photo && photo.indexOf("data:") === 0) {
          const path = "assets/uploads/partenaire-" + Date.now() + "-" + i + ".jpg";
          await putFile(token, path, photo.split(",")[1], "Ajouter la photo d’un partenaire OREKA.");
          next.partners[i].photo = path + "?v=" + Date.now();
        }
      }
      const json = JSON.stringify(next, null, 2) + "\n";
      await putFile(
        token,
        "data/site.json",
        toBase64(new TextEncoder().encode(json)),
        "Mettre à jour les réglages du site OREKA."
      );
      localStorage.setItem("oreka-token", token);
      localStorage.setItem("oreka-draft", JSON.stringify(next));
      fill(next);
      showStatus("C’est publié. Le site public se met à jour dans environ une minute. Rechargez la page d’accueil ensuite.");
    } catch (error) {
      showStatus(error.message || "La publication n’a pas abouti.");
    }
    button.disabled = false;
  });
})();
