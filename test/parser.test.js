/*
 * Testy parseru jídelníčku a logiky výběru dne.
 *
 *   node test/parser.test.js
 *
 * Nepotřebuje npm install – mammoth se bere z js/vendor/, tedy přesně ten
 * build, který běží v prohlížeči.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const mammoth = require(path.join(ROOT, "js/vendor/mammoth.browser.min.js"));

/* --- Minimální shim prohlížeče, aby šly načíst js/menu.js a js/admin.js --- */

global.window = {};
global.document = {
  readyState: "loading",
  addEventListener() {},
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: () => ({
    style: {},
    dataset: {},
    classList: { add() {}, toggle() {} },
    appendChild() {},
    append() {},
    addEventListener() {},
    setAttribute() {},
  }),
  createDocumentFragment: () => ({ appendChild() {} }),
  body: { appendChild() {} },
};

function loadBrowserScript(file) {
  new Function(fs.readFileSync(path.join(ROOT, file), "utf8"))();
}
loadBrowserScript("js/menu.js");
loadBrowserScript("js/admin.js");

const { parseDocxText, defaultMonday } = window.MenuParser;
const { pickDayId, formatDayDate } = window.Menu;

/* --- Drobný test runner ------------------------------------------------- */

let failures = 0;

function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "  ok  " : " FAIL "} ${name}`);
  if (!ok) {
    console.log(`         čekáno: ${JSON.stringify(expected)}`);
    console.log(`         reálně: ${JSON.stringify(actual)}`);
  }
}

function group(name) {
  console.log(`\n=== ${name} ===`);
}

/* --- Testy -------------------------------------------------------------- */

const fixture = fs.readFileSync(path.join(__dirname, "fixtures/jidelak.docx"));
const arrayBuffer = fixture.buffer.slice(
  fixture.byteOffset,
  fixture.byteOffset + fixture.byteLength
);

mammoth
  .extractRawText({ arrayBuffer })
  .then((res) => {
    group("Parser – skutečný .docx přes mammoth");
    const p = parseDocxText(res.value);

    check("nalezených dnů", p.daysFound, 5);
    check("pondělí z hlavičky dokumentu", p.foundDate, "2026-01-19");
    check("po – polévka", p.days[1].meals["01"], { meal: "Zelňačka", price: "35,-" });
    check("po – jídlo 1", p.days[1].meals["02"], {
      meal: "Hamburská vepřová kýta, houskové knedlíky",
      price: "130,-",
    });
    check("po – jídlo 2", p.days[1].meals["03"], {
      meal: "Topinka s pečeným trhaným masem, sypaná sýrem",
      price: "140,-",
    });
    check("středa zavřeno", p.days[3].open, false);
    check("středa – text", p.days[3].closedText, "Zavřeno - dovolená");
    check("čtvrtek – vlastní cena", p.days[4].meals["02"].price, "135,-");
    check(
      "pátek – jídlo 2",
      p.days[5].meals["03"].meal,
      "Burritos mexicanos, tři druhy pikantních omáček"
    );
    check("jídlo týdne", p.weekly["04"], {
      meal: "Řecký gyros, tzatziky, pita, steakové hranolky",
      price: "145,-",
    });
    check("salát", p.weekly["05"].meal, "Salát Caesar s kuřecím masem, krutony a sýrem");

    group("Parser – odolnost proti překlepům");

    const messy = parseDocxText(
      ["Ůterý", "0.3 l", "Kulajda", "1.", "Svíčková na smetaně", "2.", "Rizoto", "155,-"].join("\n")
    );
    check("překlep Ůterý → id 2", Object.keys(messy.days), ["2"]);
    check("0.3 l bez čárky", messy.days[2].meals["01"], { meal: "Kulajda", price: "" });
    check("jídlo bez ceny", messy.days[2].meals["02"], {
      meal: "Svíčková na smetaně",
      price: "",
    });
    check("jídlo s cenou", messy.days[2].meals["03"], { meal: "Rizoto", price: "155,-" });

    check("dokument bez jídelníčku", parseDocxText("Nějaký text").daysFound, 0);

    const tricky = parseDocxText(
      ["Pondělí", "1.", "Nedělní pečeně jako v pátek u babičky", "130,-"].join("\n")
    );
    check(
      "název dne uvnitř jídla nezaloží nový blok",
      tricky.days[1].meals["02"].meal,
      "Nedělní pečeně jako v pátek u babičky"
    );

    group("Výběr dne pro hlavní stránku");
    const at = (iso) => pickDayId(new Date(iso));

    check("pondělí 11:00 → po", at("2026-01-19T11:00"), 1);
    check("pondělí 15:00 → út", at("2026-01-19T15:00"), 2);
    check("středa 13:59 → st", at("2026-01-21T13:59"), 3);
    check("čtvrtek 11:00 → čt", at("2026-01-22T11:00"), 4);
    check("čtvrtek 15:00 → pá", at("2026-01-22T15:00"), 5);
    check("pátek 11:00 → pá", at("2026-01-23T11:00"), 5);
    check("pátek 15:00 → nic", at("2026-01-23T15:00"), null);
    check("sobota → nic", at("2026-01-24T11:00"), null);
    check("neděle → po", at("2026-01-25T11:00"), 1);

    group("Předvyplněné pondělí v adminu");
    // 2026-09-07 je pondělí, 2026-09-14 to následující.
    const monday = (iso) => defaultMonday(new Date(iso));

    check("pondělí → tenhle týden", monday("2026-09-07T09:00"), "2026-09-07");
    check("úterý → tenhle týden", monday("2026-09-08T09:00"), "2026-09-07");
    check("středa → tenhle týden", monday("2026-09-09T18:00"), "2026-09-07");
    check("čtvrtek → tenhle týden", monday("2026-09-10T09:00"), "2026-09-07");
    check("pátek → tenhle týden", monday("2026-09-11T23:30"), "2026-09-07");
    check("sobota → příští týden", monday("2026-09-12T09:00"), "2026-09-14");
    check("neděle → příští týden", monday("2026-09-13T20:00"), "2026-09-14");

    // Přelom měsíce i roku: 2026-11-30 a 2026-12-28 jsou pondělky.
    check("neděle přes přelom měsíce", monday("2026-11-29T20:00"), "2026-11-30");
    check("neděle přes přelom roku", monday("2027-01-03T20:00"), "2027-01-04");
    check("pátek na konci roku", monday("2027-01-01T12:00"), "2026-12-28");

    group("Formát data");
    check("pondělí", formatDayDate("2026-01-19", 0), "19. ledna");
    check("pátek (+4 dny)", formatDayDate("2026-01-19", 4), "23. ledna");
    check("přelom měsíce", formatDayDate("2026-01-29", 4), "02. února");
    check("prázdný vstup", formatDayDate("", 0), "");

    console.log(failures ? `\n${failures} test(ů) selhalo\n` : "\nVšechny testy prošly\n");
    process.exit(failures ? 1 : 0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
