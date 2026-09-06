/* Spoločné pre všetky stránky: hamburger menu, rok v pätičke, lightbox. */

(function () {
  "use strict";

  /* --- Hamburger ------------------------------------------------------- */

  function initNav() {
    var nav = document.querySelector(".nav");
    var burger = document.querySelector(".nav__burger");
    if (!nav || !burger) return;

    burger.addEventListener("click", function () {
      var opened = nav.classList.toggle("opened");
      burger.setAttribute("aria-expanded", String(opened));
    });
  }

  /* --- Rok v pätičke --------------------------------------------------- */

  function initYear() {
    var slot = document.querySelector("[data-year]");
    if (slot) slot.textContent = String(new Date().getFullYear());
  }

  /* --- Lightbox --------------------------------------------------------
     Nahrádza vue3-picture-swipe. Náhľady sa označia atribútom
     data-lightbox="<skupina>" a data-full="<cesta k veľkému obrázku>". */

  var dialog = null;
  var image = null;
  var prevBtn = null;
  var nextBtn = null;
  var group = [];
  var index = 0;

  function buildDialog() {
    dialog = document.createElement("dialog");
    dialog.className = "lightbox";

    var figure = document.createElement("figure");
    figure.className = "lightbox__figure";

    image = document.createElement("img");
    image.className = "lightbox__img";
    figure.appendChild(image);
    dialog.appendChild(figure);

    prevBtn = button("lightbox__btn lightbox__btn--prev", "‹", "Předchozí fotka");
    nextBtn = button("lightbox__btn lightbox__btn--next", "›", "Další fotka");
    var closeBtn = button("lightbox__btn lightbox__close", "×", "Zavřít");

    prevBtn.addEventListener("click", function () {
      show(index - 1);
    });
    nextBtn.addEventListener("click", function () {
      show(index + 1);
    });
    closeBtn.addEventListener("click", function () {
      dialog.close();
    });

    dialog.append(prevBtn, nextBtn, closeBtn);

    // Klik mimo obrázka zavrie.
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target === figure) dialog.close();
    });

    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });

    document.body.appendChild(dialog);
  }

  function button(className, label, title) {
    var b = document.createElement("button");
    b.className = className;
    b.type = "button";
    b.textContent = label;
    b.title = title;
    b.setAttribute("aria-label", title);
    return b;
  }

  function show(i) {
    if (!group.length) return;
    index = (i + group.length) % group.length;
    var thumb = group[index];
    image.src = thumb.dataset.full || thumb.querySelector("img").src;
    image.alt = thumb.querySelector("img").alt || "";

    var many = group.length > 1;
    prevBtn.hidden = !many;
    nextBtn.hidden = !many;
  }

  function initLightbox() {
    var thumbs = document.querySelectorAll("[data-lightbox]");
    if (!thumbs.length) return;
    if (!dialog) buildDialog();

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        var name = thumb.dataset.lightbox;
        group = Array.prototype.slice.call(
          document.querySelectorAll('[data-lightbox="' + name + '"]')
        );
        show(group.indexOf(thumb));
        dialog.showModal();
      });
    });
  }

  function init() {
    initNav();
    initYear();
    initLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
