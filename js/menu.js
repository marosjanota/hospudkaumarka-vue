/* Načítanie a vykreslenie poledního menu.
   Používa hlavná stránka (dnešný deň), /poledni-menu/ (celý týždeň)
   a /update-jidelak/ (živý náhľad). */

(function () {
  "use strict";

  // Ceny, ktoré sa použijú, keď ich jídelníček neuvádza.
  var FALLBACK_PRICES = {
    price01: "35,-",
    price02: "130,-",
    price03: "140,-",
    price04: "145,-",
    price05: "140,-",
  };

  var dayFormat = new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "long",
  });

  /* Ktorý deň (id 1–5) ukázať na hlavnej stránke.
     Po–Št po 14:00 preskočí na nasledujúci deň, v piatok po obedoch
     a v sobotu sa nezobrazuje nič, v nedeľu už pondelok. */
  function pickDayId(now) {
    now = now || new Date();
    var dow = now.getDay(); // 0 = nedeľa … 6 = sobota
    var afterLunch = now.getHours() >= 14;

    if (dow === 0) return 1; // nedeľa → pondelok
    if (dow === 6) return null; // sobota → nič
    if (dow === 5) return afterLunch ? null : 5; // piatok
    return afterLunch ? dow + 1 : dow; // pondelok–štvrtok
  }

  /* "2026-01-19" + offset dní → "19. ledna". Parsuje sa ako lokálny dátum,
     aby sa deň neposunul kvôli časovému pásmu. */
  function formatDayDate(mondayDate, offsetDays) {
    if (!mondayDate) return "";
    var parts = String(mondayDate).split("-");
    if (parts.length !== 3) return "";
    var d = new Date(+parts[0], +parts[1] - 1, +parts[2] + (offsetDays || 0));
    if (isNaN(d)) return "";
    return dayFormat.format(d);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function priceOf(source, key) {
    var value = source && source[key];
    return value != null && value !== "" ? value : FALLBACK_PRICES[key];
  }

  function addRow(grid, label, meal, price) {
    grid.appendChild(el("span", "menu-item__value", label));
    grid.appendChild(el("span", "menu-item__meal", meal || ""));
    grid.appendChild(el("span", "menu-item__price", price));
  }

  /* Jeden deň → DocumentFragment. */
  function renderDay(day, repeated) {
    var frag = document.createDocumentFragment();
    if (!day || !repeated) return frag;

    var title = day.day;
    var date = formatDayDate(repeated.mondayDate, day.id - 1);
    frag.appendChild(el("h3", "menu-item__title", date ? title + " " + date : title));

    if (!day.open) {
      frag.appendChild(el("p", null, day.closedText || "Zavřeno"));
      return frag;
    }

    var grid = el("div", "menu-item");
    addRow(grid, "0,3l", day.meal01, priceOf(day, "price01"));
    addRow(grid, "1.", day.meal02, priceOf(day, "price02"));
    addRow(grid, "2.", day.meal03, priceOf(day, "price03"));
    addRow(grid, "3.", repeated.meal04, priceOf(repeated, "price04"));
    addRow(grid, "4.", repeated.meal05, priceOf(repeated, "price05"));
    frag.appendChild(grid);

    return frag;
  }

  /* Celý týždeň do zadaného kontajnera. */
  function renderWeek(container, data) {
    container.textContent = "";
    (data.dailyMenu || []).forEach(function (day) {
      var wrap = el("div", "menu");
      wrap.appendChild(renderDay(day, data.dailyRepeat || {}));
      container.appendChild(wrap);
    });
  }

  function load() {
    // Cache-busting: jídelníček sa mení každý týždeň a GitHub Pages
    // by inak mohol servírovať starú verziu.
    return fetch("/json/menu.json?v=" + Date.now(), { cache: "no-store" }).then(
      function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      }
    );
  }

  /* Automatická inicializácia podľa toho, čo je na stránke. */
  function init() {
    var todayBox = document.querySelector("[data-menu-today]");
    var weekBox = document.querySelector("[data-menu-week]");
    if (!todayBox && !weekBox) return;

    load()
      .then(function (data) {
        if (weekBox) renderWeek(weekBox, data);

        if (todayBox) {
          var id = pickDayId();
          var day = id && (data.dailyMenu || []).find(function (d) {
            return d.id === id;
          });
          if (day) {
            todayBox.appendChild(renderDay(day, data.dailyRepeat || {}));
            var section = todayBox.closest("[data-menu-today-section]");
            if (section) section.hidden = false;
          }
        }
      })
      .catch(function (err) {
        console.error("Nepodarilo sa načítať jídelníček:", err);
        if (weekBox) {
          weekBox.textContent = "Jídelníček se nepodařilo načíst. Zkuste to prosím později.";
        }
      });
  }

  window.Menu = {
    pickDayId: pickDayId,
    formatDayDate: formatDayDate,
    renderDay: renderDay,
    renderWeek: renderWeek,
    load: load,
    FALLBACK_PRICES: FALLBACK_PRICES,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
