/* Update jídelníčku: Word (.docx) → formulář → json/menu.json na GitHubu.
   Parser jen předvyplní, poslední slovo má vždycky formulář. */

(function () {
  "use strict";

  /* --- Nastavení -------------------------------------------------------- */

  var REPO_OWNER = "marosjanota";
  var REPO_NAME = "hospudkaumarka-vue";
  // Větev, ze které GitHub Pages publikuje web. Musí sedět s nastavením
  // v Settings → Pages, jinak se uložený jídelníček na webu neobjeví.
  var BRANCH = "static-rewrite";
  var FILE_PATH = "json/menu.json";
  var TOKEN_KEY = "hum-github-token";

  var DAYS = [
    { id: 1, name: "Pondělí", match: /^pond[eě]l[ií]/i },
    { id: 2, name: "Úterý", match: /^[uůú]ter/i },
    { id: 3, name: "Středa", match: /^st[rř]eda/i },
    { id: 4, name: "Čtvrtek", match: /^[cč]tvrtek/i },
    { id: 5, name: "Pátek", match: /^p[aá]tek/i },
  ];

  var $ = function (id) {
    return document.getElementById(id);
  };

  /* --- Parser Wordu ----------------------------------------------------- */

  var SOUP_MARKER = /^0[,.]?3\s*l\.?$/i;
  var NUM_MARKER = /^([1-4])\.$/;
  var PRICE = /^\d{1,4}\s*(?:[,.]-|,-|-|kč|kc)?\s*$/i;
  var DATE_IN_TEXT = /(\d{1,2})\s*\.\s*(\d{1,2})\s*\.\s*(\d{4})/;

  function isPrice(line) {
    return !!line && PRICE.test(line) && /\d/.test(line);
  }

  function isMarker(line) {
    return SOUP_MARKER.test(line) || NUM_MARKER.test(line);
  }

  function isClosed(line) {
    return /zav[rř]eno/i.test(line);
  }

  function normalizePrice(line) {
    var num = (line.match(/\d+/) || [])[0];
    return num ? num + ",-" : "";
  }

  /* Je řádek nadpis dne? Krátký řádek, aby "…v pátek…" uvnitř jídla neplet. */
  function dayHeader(line) {
    if (!line || line.length > 40) return null;
    for (var i = 0; i < DAYS.length; i++) {
      if (DAYS[i].match.test(line)) return DAYS[i];
    }
    return null;
  }

  /* Blok jednoho dne → jídla a ceny. */
  function parseBlock(lines) {
    var closedLine = lines.find(isClosed);
    if (closedLine) return { open: false, closedText: closedLine, meals: {} };

    var out = { open: true, closedText: "", meals: {} };

    for (var i = 0; i < lines.length; i++) {
      var key = null;
      if (SOUP_MARKER.test(lines[i])) {
        key = "01";
      } else {
        var num = lines[i].match(NUM_MARKER);
        if (num) key = "0" + (Number(num[1]) + 1);
      }
      if (!key) continue;

      // Jídlo = první následující řádek, který není cena.
      var j = i + 1;
      while (j < lines.length && isPrice(lines[j])) j++;
      if (j >= lines.length || isMarker(lines[j])) continue;

      out.meals[key] = {
        meal: lines[j],
        price: isPrice(lines[j + 1]) ? normalizePrice(lines[j + 1]) : "",
      };
      i = j;
    }

    return out;
  }

  function parseDocxText(text) {
    var lines = text
      .split("\n")
      .map(function (l) {
        return l.replace(/\s+/g, " ").trim();
      })
      .filter(Boolean);

    // Rozdělení na bloky podle nadpisů dnů.
    var blocks = [];
    var current = null;
    var preamble = [];

    lines.forEach(function (line) {
      var day = dayHeader(line);
      if (day) {
        current = { day: day, lines: [] };
        blocks.push(current);
      } else if (current) {
        current.lines.push(line);
      } else {
        preamble.push(line);
      }
    });

    var result = { days: {}, weekly: {}, foundDate: null, daysFound: 0 };

    blocks.forEach(function (block) {
      var parsed = parseBlock(block.lines);
      result.days[block.day.id] = parsed;
      result.daysFound++;

      // Jídlo týdne a salát jsou u všech dnů stejné – vezmeme první výskyt.
      ["04", "05"].forEach(function (key) {
        if (!result.weekly[key] && parsed.meals[key]) {
          result.weekly[key] = parsed.meals[key];
        }
      });
    });

    // Datum v hlavičce dokumentu (např. "19. 1. 2026") → pondělí toho týdne.
    var dateLine = preamble.join(" ").match(DATE_IN_TEXT);
    if (dateLine) {
      var d = new Date(+dateLine[3], +dateLine[2] - 1, +dateLine[1]);
      if (!isNaN(d)) {
        var shift = (d.getDay() + 6) % 7; // posun zpět na pondělí
        d.setDate(d.getDate() - shift);
        result.foundDate = toDateInput(d);
      }
    }

    return result;
  }

  /* --- Datumy ----------------------------------------------------------- */

  function toDateInput(date) {
    var m = String(date.getMonth() + 1).padStart(2, "0");
    var d = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + m + "-" + d;
  }

  function nextMonday() {
    var d = new Date();
    d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
    return toDateInput(d);
  }

  /* --- Formulář --------------------------------------------------------- */

  var weekBox, previewBox, jsonBox;

  function buildForm() {
    weekBox.textContent = "";

    DAYS.forEach(function (day) {
      var wrap = document.createElement("div");
      wrap.className = "admin__day";
      wrap.dataset.day = String(day.id);

      wrap.innerHTML = [
        '<div class="admin__day-head">',
        "  <h3>" + day.name + "</h3>",
        '  <label><input type="checkbox" data-field="open" checked /> Otevřeno</label>',
        "</div>",
        '<div data-open-fields>',
        mealRow("0,3l", "meal01", "price01", "Polévka", "35,-"),
        mealRow("1.", "meal02", "price02", "První jídlo", "130,-"),
        mealRow("2.", "meal03", "price03", "Druhé jídlo", "140,-"),
        "</div>",
        '<div class="admin__row" data-closed-fields hidden>',
        '  <label class="admin__label">Text místo menu</label>',
        '  <input type="text" data-field="closedText" placeholder="Zavřeno" />',
        "</div>",
      ].join("\n");

      weekBox.appendChild(wrap);
    });
  }

  function mealRow(label, mealField, priceField, placeholder, pricePlaceholder) {
    return [
      '<div class="admin__meal">',
      "  <span>" + label + "</span>",
      '  <input type="text" data-field="' + mealField + '" placeholder="' + placeholder + '" />',
      '  <input type="text" data-field="' + priceField + '" placeholder="' + pricePlaceholder + '" />',
      "</div>",
    ].join("\n");
  }

  function dayEl(id) {
    return weekBox.querySelector('[data-day="' + id + '"]');
  }

  function field(id, name) {
    return dayEl(id).querySelector('[data-field="' + name + '"]');
  }

  /* Formulář → objekt, který se uloží jako menu.json. */
  function collect() {
    var repeat = {
      meal04: $("meal04").value.trim(),
      meal05: $("meal05").value.trim(),
      mondayDate: $("mondayDate").value,
    };
    if ($("price04").value.trim()) repeat.price04 = $("price04").value.trim();
    if ($("price05").value.trim()) repeat.price05 = $("price05").value.trim();

    var dailyMenu = DAYS.map(function (day) {
      var open = field(day.id, "open").checked;
      var entry = {
        id: day.id,
        day: day.name,
        open: open,
        meal01: field(day.id, "meal01").value.trim(),
        meal02: field(day.id, "meal02").value.trim(),
        meal03: field(day.id, "meal03").value.trim(),
        closedText: field(day.id, "closedText").value.trim(),
      };
      ["price01", "price02", "price03"].forEach(function (key) {
        var value = field(day.id, key).value.trim();
        if (value) entry[key] = value;
      });
      return entry;
    });

    return { dailyRepeat: repeat, dailyMenu: dailyMenu };
  }

  /* Objekt → formulář. */
  function fill(data) {
    var repeat = data.dailyRepeat || {};
    $("meal04").value = repeat.meal04 || "";
    $("meal05").value = repeat.meal05 || "";
    $("price04").value = repeat.price04 || "";
    $("price05").value = repeat.price05 || "";
    if (repeat.mondayDate) $("mondayDate").value = repeat.mondayDate;

    (data.dailyMenu || []).forEach(function (entry) {
      if (!dayEl(entry.id)) return;
      field(entry.id, "open").checked = entry.open !== false;
      ["meal01", "meal02", "meal03", "price01", "price02", "price03", "closedText"].forEach(
        function (key) {
          field(entry.id, key).value = entry[key] || "";
        }
      );
    });

    refresh();
  }

  /* Výsledek parsování Wordu → formulář (nepřepisuje to, co Word neobsahoval). */
  function applyParsed(parsed) {
    if (parsed.foundDate) $("mondayDate").value = parsed.foundDate;

    if (parsed.weekly["04"]) {
      var weekly = parsed.weekly["04"];
      $("meal04").value = /^jídlo týdne/i.test(weekly.meal)
        ? weekly.meal
        : "Jídlo týdne - " + weekly.meal;
      if (weekly.price) $("price04").value = weekly.price;
    }
    if (parsed.weekly["05"]) {
      $("meal05").value = parsed.weekly["05"].meal;
      if (parsed.weekly["05"].price) $("price05").value = parsed.weekly["05"].price;
    }

    DAYS.forEach(function (day) {
      var block = parsed.days[day.id];
      if (!block) return;

      field(day.id, "open").checked = block.open;
      field(day.id, "closedText").value = block.open ? "" : block.closedText;

      ["01", "02", "03"].forEach(function (key) {
        var item = block.meals[key];
        field(day.id, "meal" + key).value = item ? item.meal : "";
        field(day.id, "price" + key).value = item && item.price ? item.price : "";
      });
    });

    refresh();
  }

  /* --- Náhled, validace ------------------------------------------------- */

  function missingFields() {
    var missing = [];
    DAYS.forEach(function (day) {
      if (!field(day.id, "open").checked) return;
      ["meal01", "meal02", "meal03"].forEach(function (key) {
        if (!field(day.id, key).value.trim()) missing.push(day.name);
      });
    });
    if (!$("meal04").value.trim()) missing.push("Jídlo týdne");
    if (!$("meal05").value.trim()) missing.push("Salát");
    return missing.filter(function (name, i, all) {
      return all.indexOf(name) === i;
    });
  }

  function refresh() {
    // Zavřený den → schovat jídla, ukázat text.
    DAYS.forEach(function (day) {
      var open = field(day.id, "open").checked;
      dayEl(day.id).querySelector("[data-open-fields]").hidden = !open;
      dayEl(day.id).querySelector("[data-closed-fields]").hidden = open;
    });

    // Prázdná povinná pole zvýraznit.
    DAYS.forEach(function (day) {
      var open = field(day.id, "open").checked;
      ["meal01", "meal02", "meal03"].forEach(function (key) {
        var input = field(day.id, key);
        input.classList.toggle("is-empty", open && !input.value.trim());
      });
    });
    [$("meal04"), $("meal05")].forEach(function (input) {
      input.classList.toggle("is-empty", !input.value.trim());
    });

    var data = collect();
    jsonBox.textContent = JSON.stringify(data, null, 2);

    previewBox.textContent = "";
    window.Menu.renderWeek(previewBox, data);
  }

  /* --- Stavové hlášky --------------------------------------------------- */

  function status(el, text, kind) {
    el.hidden = false;
    el.textContent = text;
    el.className = "status mt-lg" + (kind ? " status--" + kind : "");
  }

  /* --- Načtení Wordu ---------------------------------------------------- */

  function handleFile(file) {
    var parseStatus = $("parse-status");
    if (!file) return;
    if (!/\.docx?$/i.test(file.name)) {
      status(parseStatus, "Tohle není wordovský soubor (.doc / .docx).", "err");
      return;
    }

    status(parseStatus, "Zpracovávám " + file.name + "…");

    file
      .arrayBuffer()
      .then(function (arrayBuffer) {
        return window.mammoth.extractRawText({ arrayBuffer: arrayBuffer });
      })
      .then(function (result) {
        var parsed = parseDocxText(result.value);

        if (!parsed.daysFound) {
          status(
            parseStatus,
            "V dokumentu jsem nenašel žádný den. Vyplň jídelníček ručně níže.",
            "err"
          );
          return;
        }

        applyParsed(parsed);

        var missing = missingFields();
        var note = "Načteno z " + file.name + " – dnů: " + parsed.daysFound + ".";
        if (parsed.foundDate) note += " Týden od " + parsed.foundDate + ".";

        if (missing.length) {
          status(
            parseStatus,
            note + " Chybí doplnit: " + missing.join(", ") + ". Zkontroluj to níže.",
            "warn"
          );
        } else {
          status(parseStatus, note + " Zkontroluj to níže a ulož.", "ok");
        }
      })
      .catch(function (err) {
        console.error(err);
        status(parseStatus, "Soubor se nepodařilo přečíst: " + err.message, "err");
      });
  }

  /* --- GitHub ----------------------------------------------------------- */

  function toBase64(text) {
    var bytes = new TextEncoder().encode(text);
    var binary = "";
    bytes.forEach(function (b) {
      binary += String.fromCharCode(b);
    });
    return btoa(binary);
  }

  function api(path, options) {
    options = options || {};
    options.headers = Object.assign(
      {
        Authorization: "Bearer " + $("token").value.trim(),
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      options.headers || {}
    );
    return fetch("https://api.github.com/repos/" + REPO_OWNER + "/" + REPO_NAME + path, options);
  }

  function save() {
    var saveStatus = $("save-status");
    var token = $("token").value.trim();

    if (!token) {
      status(saveStatus, "Nejdřív vlož GitHub token.", "err");
      $("token").focus();
      return;
    }

    var missing = missingFields();
    if (missing.length) {
      var proceed = confirm(
        "Pozor, nevyplněno: " + missing.join(", ") + ".\n\nOpravdu uložit takhle?"
      );
      if (!proceed) return;
    }

    var data = collect();
    var content = JSON.stringify(data, null, 2) + "\n";
    var button = $("save");
    button.disabled = true;
    status(saveStatus, "Ukládám na GitHub…");

    api("/contents/" + FILE_PATH + "?ref=" + BRANCH)
      .then(function (res) {
        if (res.status === 200) return res.json();
        if (res.status === 404) return null; // soubor zatím neexistuje
        if (res.status === 401 || res.status === 403) {
          throw new Error("Token neplatí nebo nemá právo zapisovat (Contents: write).");
        }
        throw new Error("GitHub vrátil " + res.status);
      })
      .then(function (existing) {
        return api("/contents/" + FILE_PATH, {
          method: "PUT",
          body: JSON.stringify({
            message: "Jídelníček na týden od " + data.dailyRepeat.mondayDate,
            content: toBase64(content),
            sha: existing ? existing.sha : undefined,
            branch: BRANCH,
          }),
        });
      })
      .then(function (res) {
        return res.json().then(function (body) {
          if (!res.ok) throw new Error(body.message || "GitHub vrátil " + res.status);
          return body;
        });
      })
      .then(function () {
        localStorage.setItem(TOKEN_KEY, token);
        status(
          saveStatus,
          "Hotovo. Na webu se to objeví zhruba do minuty (GitHub Pages to musí přegenerovat).",
          "ok"
        );
      })
      .catch(function (err) {
        console.error(err);
        status(saveStatus, "Nepovedlo se: " + err.message, "err");
      })
      .then(function () {
        button.disabled = false;
      });
  }

  /* --- Ostatní tlačítka ------------------------------------------------- */

  function loadCurrent() {
    var saveStatus = $("save-status");
    window.Menu.load()
      .then(function (data) {
        fill(data);
        status(saveStatus, "Načten jídelníček, který je teď na webu.", "ok");
      })
      .catch(function (err) {
        status(saveStatus, "Současný jídelníček se nepodařilo načíst: " + err.message, "err");
      });
  }

  function download() {
    var blob = new Blob([JSON.stringify(collect(), null, 2) + "\n"], {
      type: "application/json",
    });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "menu.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* --- Start ------------------------------------------------------------ */

  function init() {
    weekBox = $("week");
    previewBox = $("preview");
    jsonBox = $("json");
    if (!weekBox) return;

    buildForm();
    $("mondayDate").value = nextMonday();

    // Kam se ukládá – ať je vidět, že to sedí s nastavením GitHub Pages.
    $("target").textContent =
      "Ukládá se do: " + REPO_OWNER + "/" + REPO_NAME +
      " → větev " + BRANCH + " → " + FILE_PATH;

    var savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedToken) $("token").value = savedToken;

    // Přepočet náhledu při každé změně.
    document.querySelector(".admin").addEventListener("input", refresh);
    document.querySelector(".admin").addEventListener("change", refresh);

    // Dropzone: klik i přetažení.
    var dropzone = $("dropzone");
    var fileInput = $("file");

    dropzone.addEventListener("click", function (e) {
      if (e.target !== fileInput) fileInput.click();
    });
    dropzone.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInput.click();
      }
    });
    fileInput.addEventListener("change", function () {
      handleFile(fileInput.files[0]);
    });

    ["dragenter", "dragover"].forEach(function (type) {
      dropzone.addEventListener(type, function (e) {
        e.preventDefault();
        dropzone.classList.add("is-over");
      });
    });
    ["dragleave", "drop"].forEach(function (type) {
      dropzone.addEventListener(type, function (e) {
        e.preventDefault();
        dropzone.classList.remove("is-over");
      });
    });
    dropzone.addEventListener("drop", function (e) {
      handleFile(e.dataTransfer.files[0]);
    });

    // Zabrání tomu, aby prohlížeč otevřel soubor puštěný vedle dropzony.
    ["dragover", "drop"].forEach(function (type) {
      window.addEventListener(type, function (e) {
        if (!dropzone.contains(e.target)) e.preventDefault();
      });
    });

    $("save").addEventListener("click", save);
    $("reload").addEventListener("click", loadCurrent);
    $("download").addEventListener("click", download);
    $("forget").addEventListener("click", function () {
      localStorage.removeItem(TOKEN_KEY);
      $("token").value = "";
      status($("save-status"), "Token z prohlížeče smazán.", "ok");
    });

    // Start s tím, co je právě na webu.
    loadCurrent();
  }

  // Vystaveno kvůli testům parseru (viz test/parser.test.js).
  window.MenuParser = { parseDocxText: parseDocxText, nextMonday: nextMonday };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
