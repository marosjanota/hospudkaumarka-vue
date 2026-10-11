/* Update jídelníčku: Word (.docx) → formulář → json/menu.json na GitHubu,
   a z téhož formuláře XLSX pro rozvoz.
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

  // Export pro rozvoz (XLSX podle docs/dj_food_import_template.xlsx).
  // POS ID je nepovinné a zatím ho neznáme – sloupec zůstává prázdný.
  // Až bude, stačí ho doplnit sem (nebo pokaždé v okně exportu).
  var EXPORT_POS_ID = "";
  // Obal se už zvlášť neúčtuje – je započítaný v ceně jídla (přirážka).
  // Sloupec v šabloně ale zůstává, takže se do něj píše nula.
  var EXPORT_PACKAGING = 0;
  // Polévka má v exportu pevnou cenu, na ostatní jídla se přičítá přirážka.
  var EXPORT_SOUP_PRICE = 45;
  var SURCHARGE_KEY = "hum-export-surcharge";
  var SOUP_PRICE_KEY = "hum-export-soup-price";

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

  /* Který týden se nejspíš nahrává.
     Po–Pá  → pondělí tohohle týdne (v pondělí se ještě často něco mění,
              a přes týden se opravuje běžící jídelníček)
     So, Ne → pondělí toho příštího (to je ten obvyklý nedělní upload) */
  function defaultMonday(now) {
    now = now || new Date();
    var dow = now.getDay(); // 0 = neděle … 6 = sobota
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (dow === 0) d.setDate(d.getDate() + 1); // neděle → zítřek
    else if (dow === 6) d.setDate(d.getDate() + 2); // sobota → pozítří
    else d.setDate(d.getDate() - (dow - 1)); // po–pá → zpět na pondělí

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

  /* Objekt → formulář. `withDate` se použije jen při ručním načtení toho,
     co je na webu; při startu se datum nechává spočítané podle dneška,
     protože jde o týden, který se nahrává, ne o ten publikovaný. */
  function fill(data, withDate) {
    var repeat = data.dailyRepeat || {};
    $("meal04").value = repeat.meal04 || "";
    $("meal05").value = repeat.meal05 || "";
    $("price04").value = repeat.price04 || "";
    $("price05").value = repeat.price05 || "";
    if (withDate && repeat.mondayDate) $("mondayDate").value = repeat.mondayDate;

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

  function loadCurrent(withDate) {
    var saveStatus = $("save-status");
    window.Menu.load()
      .then(function (data) {
        fill(data, withDate);
        status(saveStatus, "Načten jídelníček, který je teď na webu.", "ok");
      })
      .catch(function (err) {
        status(saveStatus, "Současný jídelníček se nepodařilo načíst: " + err.message, "err");
      });
  }

  function saveFile(blob, name) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function download() {
    var blob = new Blob([JSON.stringify(collect(), null, 2) + "\n"], {
      type: "application/json",
    });
    saveFile(blob, "menu.json");
  }

  /* --- Export pro rozvoz (XLSX) ----------------------------------------- */

  var EXPORT_SLOTS = [
    { label: "0,3l", meal: "meal01", price: "price01", daily: true, soup: true },
    { label: "1.", meal: "meal02", price: "price02", daily: true },
    { label: "2.", meal: "meal03", price: "price03", daily: true },
    { label: "3.", meal: "meal04", price: "price04", daily: false },
    { label: "4.", meal: "meal05", price: "price05", daily: false },
  ];

  function priceNumber(text) {
    var num = String(text == null ? "" : text).match(/\d+/);
    return num ? Number(num[0]) : null;
  }

  /* "2026-10-12" + offset dní → "2026-10-14". */
  function addDays(isoDate, offsetDays) {
    var parts = isoDate.split("-");
    return toDateInput(new Date(+parts[0], +parts[1] - 1, +parts[2] + offsetDays));
  }

  /* Jídelníček (stejný objekt jako menu.json) → řádky exportu. Jídlo týdne
     a salát se opakují u každého dne, zavřené dny a prázdná jídla se
     vynechají. Cena je ta, kterou ukazuje web – včetně výchozích cen. */
  function exportRows(data) {
    var repeat = data.dailyRepeat || {};
    var rows = [];
    if (!repeat.mondayDate) return rows;

    (data.dailyMenu || []).forEach(function (day) {
      if (day.open === false) return;

      EXPORT_SLOTS.forEach(function (slot) {
        var source = slot.daily ? day : repeat;
        var name = (source[slot.meal] || "").replace(/^jídlo týdne\s*[-–:]\s*/i, "").trim();
        if (!name) return;

        rows.push({
          dayId: day.id,
          day: day.day,
          label: slot.label,
          soup: !!slot.soup,
          date: addDays(repeat.mondayDate, day.id - 1),
          name: name,
          price: priceNumber(source[slot.price] || window.Menu.FALLBACK_PRICES[slot.price]),
        });
      });
    });

    return rows;
  }

  /* Pořadové číslo dne, jak ho ukládá Excel (1 = 1. 1. 1900). */
  function excelSerial(isoDate) {
    var parts = isoDate.split("-");
    return Date.UTC(+parts[0], +parts[1] - 1, +parts[2]) / 86400000 + 25569;
  }

  function xmlEscape(text) {
    return String(text)
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  var CRC_TABLE = (function () {
    var table = [];
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    var crc = 0xffffffff;
    for (var i = 0; i < bytes.length; i++) {
      crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function u16(n) {
    return [n & 0xff, (n >>> 8) & 0xff];
  }

  function u32(n) {
    return [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff];
  }

  /* Soubory [{ name, text }] → ZIP bez komprese. Na pár kB XML to stačí
     a není kvůli tomu potřeba další knihovna. */
  function zip(files) {
    var encoder = new TextEncoder();
    var local = [];
    var central = [];

    files.forEach(function (file) {
      var name = Array.from(encoder.encode(file.name));
      var data = Array.from(encoder.encode(file.text));
      // Část hlavičky společná pro lokální i centrální záznam.
      var meta = [].concat(
        u16(20), // verze potřebná k rozbalení
        u16(0x0800), // názvy v UTF-8
        u16(0), // bez komprese
        u16(0), // čas
        u16(0x21), // datum 1. 1. 1980
        u32(crc32(data)),
        u32(data.length),
        u32(data.length),
        u16(name.length),
        u16(0)
      );
      var offset = local.length;

      local = local.concat(u32(0x04034b50), meta, name, data);
      central = central.concat(
        u32(0x02014b50), u16(20), meta, u16(0), u16(0), u16(0), u32(0), u32(offset), name
      );
    });

    var end = [].concat(
      u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length),
      u32(central.length), u32(local.length), u16(0)
    );

    return new Uint8Array(local.concat(central, end));
  }

  /* Řádky [{ name, description, price, packaging, date, posId }] → .xlsx
     se stejnými sloupci, listem a formátem data jako šablona. */
  function buildXlsx(rows) {
    var XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
    var MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
    var REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
    var PKG = "http://schemas.openxmlformats.org/package/2006/relationships";
    var TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.";

    var strings = [];
    var stringIndex = {};

    function text(ref, value) {
      if (value == null || value === "") return "";
      if (!(value in stringIndex)) {
        stringIndex[value] = strings.length;
        strings.push(value);
      }
      return '<c r="' + ref + '" t="s"><v>' + stringIndex[value] + "</v></c>";
    }

    function number(ref, value, style) {
      if (value == null || value === "") return "";
      return '<c r="' + ref + '"' + (style ? ' s="' + style + '"' : "") + "><v>" + value + "</v></c>";
    }

    var header = ["název", "popis", "cena", "cena - obal", "datum", "pos id"];
    var sheetRows = [
      '<row r="1">' +
        header
          .map(function (title, i) {
            return text("ABCDEF"[i] + "1", title);
          })
          .join("") +
        "</row>",
    ];

    rows.forEach(function (row, i) {
      var r = i + 2;
      sheetRows.push(
        '<row r="' + r + '">' +
          text("A" + r, row.name) +
          text("B" + r, row.description) +
          number("C" + r, row.price) +
          number("D" + r, row.packaging) +
          number("E" + r, excelSerial(row.date), 1) +
          number("F" + r, row.posId) +
          "</row>"
      );
    });

    return zip([
      {
        name: "[Content_Types].xml",
        text:
          XML +
          '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
          '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
          '<Default Extension="xml" ContentType="application/xml"/>' +
          '<Override PartName="/xl/workbook.xml" ContentType="' + TYPE + 'sheet.main+xml"/>' +
          '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="' + TYPE + 'worksheet+xml"/>' +
          '<Override PartName="/xl/styles.xml" ContentType="' + TYPE + 'styles+xml"/>' +
          '<Override PartName="/xl/sharedStrings.xml" ContentType="' + TYPE + 'sharedStrings+xml"/>' +
          "</Types>",
      },
      {
        name: "_rels/.rels",
        text:
          XML +
          '<Relationships xmlns="' + PKG + '">' +
          '<Relationship Id="rId1" Type="' + REL + '/officeDocument" Target="xl/workbook.xml"/>' +
          "</Relationships>",
      },
      {
        name: "xl/workbook.xml",
        text:
          XML +
          '<workbook xmlns="' + MAIN + '" xmlns:r="' + REL + '">' +
          '<sheets><sheet name="Worksheet" sheetId="1" r:id="rId1"/></sheets>' +
          "</workbook>",
      },
      {
        name: "xl/_rels/workbook.xml.rels",
        text:
          XML +
          '<Relationships xmlns="' + PKG + '">' +
          '<Relationship Id="rId1" Type="' + REL + '/worksheet" Target="worksheets/sheet1.xml"/>' +
          '<Relationship Id="rId2" Type="' + REL + '/styles" Target="styles.xml"/>' +
          '<Relationship Id="rId3" Type="' + REL + '/sharedStrings" Target="sharedStrings.xml"/>' +
          "</Relationships>",
      },
      {
        // Styl 1 = datum dd/mm/yyyy, stejně jako v šabloně.
        name: "xl/styles.xml",
        text:
          XML +
          '<styleSheet xmlns="' + MAIN + '">' +
          '<numFmts count="1"><numFmt numFmtId="164" formatCode="dd/mm/yyyy"/></numFmts>' +
          '<fonts count="1"><font><sz val="11"/><color rgb="FF000000"/><name val="Calibri"/></font></fonts>' +
          '<fills count="2"><fill><patternFill patternType="none"/></fill>' +
          '<fill><patternFill patternType="gray125"/></fill></fills>' +
          '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
          '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
          '<cellXfs count="2">' +
          '<xf xfId="0" fontId="0" numFmtId="0" fillId="0" borderId="0"/>' +
          '<xf xfId="0" fontId="0" numFmtId="164" fillId="0" borderId="0" applyNumberFormat="1"/>' +
          "</cellXfs>" +
          '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
          "</styleSheet>",
      },
      {
        name: "xl/sharedStrings.xml",
        text:
          XML +
          '<sst xmlns="' + MAIN + '" count="' + strings.length + '" uniqueCount="' + strings.length + '">' +
          strings
            .map(function (value) {
              return '<si><t xml:space="preserve">' + xmlEscape(value) + "</t></si>";
            })
            .join("") +
          "</sst>",
      },
      {
        name: "xl/worksheets/sheet1.xml",
        text:
          XML +
          '<worksheet xmlns="' + MAIN + '">' +
          "<cols>" +
          '<col min="1" max="1" width="30" customWidth="1"/>' +
          '<col min="2" max="2" width="45" customWidth="1"/>' +
          '<col min="3" max="6" width="15" customWidth="1"/>' +
          "</cols>" +
          "<sheetData>" + sheetRows.join("") + "</sheetData>" +
          "</worksheet>",
      },
    ]);
  }

  /* Okno exportu: ceny pro rozvoz jsou jiné než v jídelníčku (je v nich
     i obal), takže se před stažením dají upravit – hromadně přirážkou
     i každá zvlášť. */

  var exportDraft = [];

  function exportPriceInputs() {
    return Array.from($("export-list").querySelectorAll("[data-export-price]"));
  }

  /* Přepočítá všechny ceny: polévka má pevnou cenu (prázdné pole = cena
     z jídelníčku), ostatní jídla cenu z jídelníčku + přirážku. */
  function applyPrices() {
    var surcharge = priceNumber($("export-surcharge").value) || 0;
    var soupPrice = priceNumber($("export-soup").value);

    exportPriceInputs().forEach(function (input, i) {
      var row = exportDraft[i];
      var price = row.price == null ? null : row.price + surcharge;
      if (row.soup) price = soupPrice != null ? soupPrice : row.price;
      input.value = price == null ? "" : String(price);
      input.classList.remove("is-empty");
    });
  }

  function openExport() {
    var data = collect();
    if (!data.dailyRepeat.mondayDate) {
      status($("save-status"), "Nejdřív vyplň datum pondělí – export z něj počítá datum každého dne.", "err");
      return;
    }

    exportDraft = exportRows(data);
    if (!exportDraft.length) {
      status($("save-status"), "V jídelníčku není žádné jídlo k exportu.", "err");
      return;
    }

    var list = $("export-list");
    list.textContent = "";
    var lastDay = null;

    exportDraft.forEach(function (row) {
      if (row.dayId !== lastDay) {
        lastDay = row.dayId;
        var heading = document.createElement("h3");
        heading.textContent =
          row.day + " " + window.Menu.formatDayDate(data.dailyRepeat.mondayDate, row.dayId - 1);
        list.appendChild(heading);
      }

      var line = document.createElement("div");
      line.className = "admin__meal";
      var label = document.createElement("span");
      label.textContent = row.label;
      var name = document.createElement("span");
      name.textContent = row.name;
      var price = document.createElement("input");
      price.type = "text";
      price.inputMode = "numeric";
      price.setAttribute("data-export-price", "");
      price.setAttribute("aria-label", "Cena – " + row.day + ", " + row.name);
      line.append(label, name, price);
      list.appendChild(line);
    });

    $("export-surcharge").value = localStorage.getItem(SURCHARGE_KEY) || "0";
    var savedSoup = localStorage.getItem(SOUP_PRICE_KEY);
    $("export-soup").value = savedSoup != null ? savedSoup : String(EXPORT_SOUP_PRICE);
    $("export-posid").value = String(EXPORT_POS_ID);
    $("export-status").hidden = true;
    applyPrices();

    $("export-dialog").showModal();
  }

  function downloadExport() {
    var whole = /^\d+$/;
    var invalid = 0;

    var prices = exportPriceInputs().map(function (input) {
      var ok = whole.test(input.value.trim());
      input.classList.toggle("is-empty", !ok);
      if (!ok) invalid++;
      return Number(input.value.trim());
    });

    var posId = $("export-posid").value.trim();
    var posIdOk = posId === "" || whole.test(posId);
    $("export-posid").classList.toggle("is-empty", !posIdOk);
    if (!posIdOk) invalid++;

    if (invalid) {
      status($("export-status"), "Zvýrazněná pole musí být celé číslo.", "err");
      return;
    }

    var rows = exportDraft.map(function (row, i) {
      return {
        name: row.name,
        description: "",
        price: prices[i],
        packaging: EXPORT_PACKAGING,
        date: row.date,
        posId: posId === "" ? null : Number(posId),
      };
    });

    var blob = new Blob([buildXlsx(rows)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveFile(blob, "dj_food_import_" + exportDraft[0].date + ".xlsx");

    localStorage.setItem(SURCHARGE_KEY, String(priceNumber($("export-surcharge").value) || 0));
    var soupPrice = priceNumber($("export-soup").value);
    localStorage.setItem(SOUP_PRICE_KEY, soupPrice == null ? "" : String(soupPrice));
    $("export-dialog").close();
    status($("save-status"), "XLSX pro Foodora stažen – řádků: " + rows.length + ".", "ok");
  }

  /* --- Start ------------------------------------------------------------ */

  function init() {
    weekBox = $("week");
    previewBox = $("preview");
    jsonBox = $("json");
    if (!weekBox) return;

    buildForm();
    $("mondayDate").value = defaultMonday();

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
    $("reload").addEventListener("click", function () {
      loadCurrent(true); // ruční načtení bere i datum z publikovaného souboru
    });
    $("download").addEventListener("click", download);
    $("export").addEventListener("click", openExport);
    $("export-surcharge").addEventListener("input", applyPrices);
    $("export-soup").addEventListener("input", applyPrices);
    $("export-download").addEventListener("click", downloadExport);
    $("export-cancel").addEventListener("click", function () {
      $("export-dialog").close();
    });
    $("forget").addEventListener("click", function () {
      localStorage.removeItem(TOKEN_KEY);
      $("token").value = "";
      status($("save-status"), "Token z prohlížeče smazán.", "ok");
    });

    // Start s tím, co je právě na webu.
    loadCurrent(false);
  }

  // Vystaveno kvůli testům parseru (viz test/parser.test.js).
  window.MenuParser = {
    parseDocxText: parseDocxText,
    defaultMonday: defaultMonday,
    exportRows: exportRows,
    buildXlsx: buildXlsx,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
