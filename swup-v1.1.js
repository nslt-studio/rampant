window.swup = new Swup({
  containers: ["#swup"],
});

/* --------------------------------------------
   w--current IMMÉDIAT (multi-liens)
-------------------------------------------- */

function normalizePath(path) {
  return path.replace(window.location.origin, "").replace(/\/$/, "");
}

function setCurrentLinksByPath(path) {
  const normalizedPath = normalizePath(path);

  document
    .querySelectorAll("a.w--current")
    .forEach((el) => el.classList.remove("w--current"));

  document.querySelectorAll("a[href]").forEach((link) => {
    const linkPath = normalizePath(link.getAttribute("href") || "");
    if (linkPath === normalizedPath) {
      link.classList.add("w--current");
    }
  });
}

/* Click immédiat */
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[href]");
  if (!link) return;

  const href = link.getAttribute("href");

  // ignorer ancres, liens externes, new tab
  if (
    href.startsWith("#") ||
    link.target === "_blank" ||
    link.host !== window.location.host
  ) {
    return;
  }

  setCurrentLinksByPath(href);
});

/* --------------------------------------------
   Synchronisation après navigation
-------------------------------------------- */

function syncCurrentLinkWithURL() {
  setCurrentLinksByPath(window.location.pathname);
}

/* Premier load */
document.addEventListener("DOMContentLoaded", syncCurrentLinkWithURL);

/* Navigations Swup */
window.swup.hooks.on("page:view", syncCurrentLinkWithURL);

/* --------------------------------------------
   LOADER — UNE FOIS PAR SESSION
-------------------------------------------- */

function initLoaderOnce() {
  const loader = document.querySelector(".loader");
  const logo = document.querySelector("#logoLoader");
  if (!loader || !logo) return;

  /* Déjà joué → suppression immédiate */
  if (sessionStorage.getItem("loaderPlayed")) {
    loader.remove();
    return;
  }

  const text = logo.textContent.trim();
  const words = text.split(" ");

  logo.textContent = "";

  const START_DELAY = 900; // délai avant animation
  const LETTER_DELAY = 60; // délai entre lettres
  const END_DELAY = 900; // pause après animation
  const LOGO_OUT_DELAY = 300; // délai avant logo out
  const LOADER_OUT_DELAY = 600; // délai avant loader out

  /* ------------------------------------------------
     CONSTRUCTION DOM
  ------------------------------------------------ */

  const wordWrappers = [];

  words.forEach((word, index) => {
    const wordWrapper = document.createElement("span");

    [...word].forEach((char) => {
      const letter = document.createElement("span");
      letter.textContent = char;
      wordWrapper.appendChild(letter);
    });

    logo.appendChild(wordWrapper);
    wordWrappers.push(wordWrapper);

    if (index < words.length - 1) {
      logo.appendChild(document.createTextNode(" "));
    }
  });

  /* ------------------------------------------------
     REND LE LOGO VISIBLE
  ------------------------------------------------ */

  requestAnimationFrame(() => {
    logo.style.opacity = "1";
  });

  /* ------------------------------------------------
     ANIMATION LETTRES
  ------------------------------------------------ */

  const leftLetters = [...wordWrappers[0].children];
  const rightLetters = [...wordWrappers[1].children].reverse();

  const maxLength = Math.max(leftLetters.length, rightLetters.length);

  for (let i = 0; i < maxLength; i++) {
    const delay = START_DELAY + i * LETTER_DELAY;

    if (leftLetters[i]) {
      setTimeout(() => {
        leftLetters[i].offsetHeight; // Safari / iOS FIX
        leftLetters[i].style.opacity = "1";
      }, delay);
    }

    if (rightLetters[i]) {
      setTimeout(() => {
        rightLetters[i].offsetHeight; // Safari / iOS FIX
        rightLetters[i].style.opacity = "1";
      }, delay);
    }
  }

  /* ------------------------------------------------
     SORTIE LOGO PUIS LOADER
  ------------------------------------------------ */

  const animationEndTime = START_DELAY + maxLength * LETTER_DELAY + END_DELAY;

  setTimeout(() => {
    /* Fade out logo */
    logo.style.transition = "opacity 300ms ease";
    logo.style.opacity = "0";

    setTimeout(() => {
      /* Fade out loader */
      loader.style.transition = "opacity 300ms ease";
      loader.style.opacity = "0";

      setTimeout(() => {
        loader.remove();
        sessionStorage.setItem("loaderPlayed", "true");
      }, 300);
    }, LOADER_OUT_DELAY);
  }, animationEndTime + LOGO_OUT_DELAY);
}

/* Init */
document.addEventListener("DOMContentLoaded", initLoaderOnce);
