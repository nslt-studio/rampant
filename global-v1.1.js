function initGlobal() {
  /* -----------------------------------------------------
       1. HEURE ACTUELLE – BUENOS AIRES
    ----------------------------------------------------- */

  const timeEl = document.getElementById("currentTime");

  function updateBuenosAiresTime() {
    if (!timeEl) return;

    const now = new Date();
    const formatter = new Intl.DateTimeFormat("fr-FR", {
      timeZone: "America/Argentina/Buenos_Aires",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    });

    timeEl.textContent = formatter.format(now);
  }

  updateBuenosAiresTime();
  setInterval(updateBuenosAiresTime, 1000);

  /* -----------------------------------------------------
       2. FADE IN FLUIDE (IMAGES & VIDÉOS)
       - déclenché quand visible
       - déclenché UNE SEULE FOIS
    ----------------------------------------------------- */

  const FADE_DURATION = 300;

  function prepareForFade(el) {
    el.style.opacity = "0";
    el.style.willChange = "opacity";
  }

  function fadeIn(el) {
    el.style.transition = `opacity ${FADE_DURATION}ms ease`;
    requestAnimationFrame(() => {
      el.style.opacity = "1";
    });
  }

  /* -----------------------------------------------------
       INTERSECTION OBSERVER (UNIFIÉ)
    ----------------------------------------------------- */

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        /* ---------- IMAGES ---------- */
        if (el.tagName === "IMG") {
          if (entry.isIntersecting && el.dataset.loaded === "true") {
            fadeIn(el);
            observer.unobserve(el);
          }
        }

        /* ---------- VIDÉOS ---------- */
        if (el.tagName === "VIDEO") {
          if (entry.isIntersecting) {
            if (!el.dataset.faded) {
              fadeIn(el);
              el.dataset.faded = "true";
            }

            const tryPlay = () => {
              el.play().catch(() => {});
            };

            if (el.readyState >= 1) {
              tryPlay();
            } else {
              el.addEventListener("canplay", tryPlay, { once: true });
            }
          } else {
            el.pause();
          }
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  /* -----------------------------------------------------
       3. IMAGES – LOAD + OBSERVER
    ----------------------------------------------------- */

  document.querySelectorAll("img").forEach((img) => {
    prepareForFade(img);

    if (img.complete && img.naturalWidth !== 0) {
      img.dataset.loaded = "true";
      observer.observe(img);
    } else {
      img.addEventListener(
        "load",
        () => {
          img.dataset.loaded = "true";
          observer.observe(img);
        },
        { once: true }
      );
    }
  });

  /* -----------------------------------------------------
       4. VIDÉOS – METADATA + OBSERVER
    ----------------------------------------------------- */

  document.querySelectorAll("video").forEach((video) => {
    prepareForFade(video);

    // 🔑 SAFARI / iOS AUTOPLAY SETUP
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const onReady = () => {
      observer.observe(video);
    };

    if (video.readyState >= 1) {
      onReady();
    } else {
      video.addEventListener("loadedmetadata", onReady, { once: true });
    }
  });
}

function initPage() {
  initGlobal();
  initHome();
  initOverview();
  initIndex();
}

document.addEventListener("DOMContentLoaded", initPage);
if (window.swup) {
  window.swup.hooks.on("page:view", () => {
    initPage();
  });
}
