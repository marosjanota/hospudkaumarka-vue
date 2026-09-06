# Hospůdka u Marka

Statický web — čisté HTML, CSS a JavaScript. **Žádný build, žádný `npm install`,
žádné `node_modules`.** Co je v repozitáři, to běží na webu.

## Struktura

```
index.html              hlavní stránka (dnešní menu, galerie, kontakt)
poledni-menu/           jídelníček na celý týden
napojovy-listek/        nápojový lístek (statický text)
kontakt/                kontakt a otevírací doba
update-jidelak/         interní nástroj na nahrání jídelníčku
404.html

css/style.css           všechny styly
js/site.js              navigace, rok v patičce, lightbox u fotek
js/menu.js              načtení a vykreslení jídelníčku
js/admin.js             parser Wordu + formulář + uložení na GitHub
js/vendor/              mammoth (čtení .docx), načítá se jen v adminu

json/menu.json          jídelníček – jediná věc, která se mění každý týden
images/, akce/          fotky
test/                   testy parseru, spouští se `node test/parser.test.js`
```

## Úprava obsahu

| Co změnit | Kde |
| --- | --- |
| Jídelníček | přes `/update-jidelak/`, nebo ručně v `json/menu.json` |
| Nápojový lístek, ceny piva | `napojovy-listek/index.html` |
| Otevírací doba, adresa, telefon | `kontakt/index.html` **a** `index.html` (je na obou) |
| Mimořádné oznámení („zavřeno – dovolená") | zakomentovaný blok v `index.html` / `poledni-menu/index.html` |
| Reklamní box | zakomentovaný blok v `index.html` |
| Fotky v galerii | `images/` + seznam v `index.html` |

Navigace a patička jsou v každém souboru zkopírované. Když se mění, musí se
změnit ve všech pěti — jsou schválně znak po znaku stejné, takže se dají
najít a nahradit najednou.

## Jídelníček každý týden

1. Stáhnout Word z e-mailu.
2. Otevřít `hospudkaumarka.cz/update-jidelak/`.
3. Přetáhnout Word na stránku. Parser předvyplní formulář, prázdná pole se
   červeně zvýrazní.
4. Zkontrolovat v náhledu, případně opravit.
5. **Uložit a publikovat.** Na webu je to zhruba do minuty.

Nástroj potřebuje GitHub token — fine-grained personal access token s právem
**Contents: write** jen na tenhle repozitář. Uloží se do prohlížeče, takže se
zadává jednou. Nastavení repozitáře a větve je nahoře v `js/admin.js`.

Parser je jen pomůcka; poslední slovo má vždycky formulář. Když se ve Wordu
změní formátování, nejhorší co se stane je, že se něco nepředvyplní.

## Vývoj

Otevřít soubory rovnou v prohlížeči nejde — `fetch` na `json/menu.json` by
narazil na CORS. Stačí jakýkoli statický server ve složce repozitáře:

```sh
npx serve .          # nebo: python -m http.server 8000
```

Testy parseru a logiky výběru dne (nepotřebují nic doinstalovat):

```sh
node test/parser.test.js
```

## Nasazení

GitHub Pages servíruje větev `main` z kořene repozitáře. Push = nasazeno,
žádný build krok. Doména je v souboru `CNAME`.
