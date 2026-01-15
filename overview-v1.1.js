function initOverview() {
  const home = document.querySelector('[data-page="overview"]');
  if (!home) return;
  /* -----------------------------------------------------
       OVERVIEW GRID — HOVER TITLES
    ----------------------------------------------------- */

  const items = document.querySelectorAll(".overview-item");
  let activeClone = null;

  items.forEach((item) => {
    const sourceEl = item.querySelector(".overview-hover-titles-inner");
    if (!sourceEl) return;

    item.addEventListener("mouseenter", () => {
      // Nettoyage sécurité
      if (activeClone) {
        activeClone.remove();
        activeClone = null;
      }

      // Position Y réelle dans le document
      const rect = item.getBoundingClientRect();
      const topInDocument = rect.top + window.scrollY;

      // Clone
      const clone = sourceEl.cloneNode(true);

      // Styles overlay document
      clone.style.position = "absolute";
      clone.style.top = `${topInDocument}px`;
      clone.style.left = "0";
      clone.style.width = "100vw";
      clone.style.opacity = "1";
      clone.style.pointerEvents = "none";
      clone.style.zIndex = "999";
      clone.style.boxSizing = "border-box";

      // Injection dans le body
      document.body.appendChild(clone);

      activeClone = clone;
    });

    item.addEventListener("mouseleave", () => {
      if (!activeClone) return;

      activeClone.remove();
      activeClone = null;
    });
  });

  /* -----------------------------------------------------
     NUMÉROTATION DES THUMBS
 ----------------------------------------------------- */

  document
    .querySelectorAll(".overview-list .overview-item")
    .forEach((slide, index) => {
      const counter = slide.querySelector("[item-counter]");
      if (!counter) return;

      counter.textContent = String(index + 1).padStart(2, "0") + ".";
    });

  /* -----------------------------------------------------
   OVERVIEW MEDIA — FULLSCREEN CLONE + CONTROLLERS
----------------------------------------------------- */

  const overviewItems = Array.from(document.querySelectorAll(".overview-item"));

  let activeMediaClone = null;
  let activeIndex = -1;

  function openMediaAtIndex(index) {
    const item = overviewItems[index];
    if (!item) return;

    const media = item.querySelector(
      ".overview-img-inner:not(.w-condition-invisible) .overview-img, " +
        ".overview-video-inner:not(.w-condition-invisible) .overview-video"
    );
    if (!media) return;

    /* ---------- NETTOYAGE ---------- */
    if (activeMediaClone) {
      const oldVideo = activeMediaClone.querySelector("video");
      if (oldVideo) oldVideo.pause();
      activeMediaClone.remove();
    }

    activeIndex = index;

    /* ---------- CLONE MEDIA ---------- */
    const clone = media.cloneNode(true);
    const cloneVideo = clone.querySelector("video");
    const originalVideo = media.querySelector("video");

    if (cloneVideo) {
      cloneVideo.muted = true;
      cloneVideo.playsInline = true;

      if (originalVideo && !isNaN(originalVideo.currentTime)) {
        cloneVideo.currentTime = originalVideo.currentTime;
      }
    }

    /* ---------- WRAPPER ---------- */
    const wrapper = document.createElement("div");

    Object.assign(wrapper.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100dvh",
      background: "rgba(255,255,255,0.8)",
      zIndex: "10000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });

    Object.assign(clone.style, {
      opacity: 1,
      maxWidth: "100%",
      maxHeight: "100%",
      pointerEvents: "none",
      aspectRatio: "4 / 3",
    });

    wrapper.appendChild(clone);

    /* ---------- CLONE DES CONTROLLERS EXISTANTS ---------- */
    const closeBtn = document.querySelector(".clone-close")?.cloneNode(true);
    const nextBtn = document.querySelector(".clone-next")?.cloneNode(true);
    const prevBtn = document.querySelector(".clone-prev")?.cloneNode(true);

    [closeBtn, nextBtn, prevBtn].forEach((btn) => {
      if (!btn) return;
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
      wrapper.appendChild(btn);
    });

    document.body.appendChild(wrapper);
    document.body.style.overflow = "hidden";

    /* ---------- VISIBILITÉ VIDÉO ---------- */
    if (cloneVideo) {
      cloneVideo.style.opacity = "0";

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            cloneVideo.style.opacity = "1";
            observer.disconnect();
          }
        },
        {
          threshold: 0.5,
        }
      );

      observer.observe(cloneVideo);
    }

    /* ---------- LECTURE VIDEO ---------- */
    if (cloneVideo) {
      requestAnimationFrame(() => {
        cloneVideo.play().catch(() => {});
      });
    }

    /* ---------- ACTIONS ---------- */
    closeBtn?.addEventListener("click", () => {
      if (cloneVideo) cloneVideo.pause();
      wrapper.remove();
      activeMediaClone = null;
      activeIndex = -1;
      document.body.style.overflow = "";
    });

    nextBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      openMediaAtIndex((activeIndex + 1) % overviewItems.length);
    });

    prevBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      openMediaAtIndex(
        (activeIndex - 1 + overviewItems.length) % overviewItems.length
      );
    });

    activeMediaClone = wrapper;
  }

  /* ---------- OUVERTURE AU CLIC ---------- */
  overviewItems.forEach((item, index) => {
    const media = item.querySelector(
      ".overview-img-inner:not(.w-condition-invisible) .overview-img, " +
        ".overview-video-inner:not(.w-condition-invisible) .overview-video"
    );
    if (!media) return;

    media.addEventListener("click", (e) => {
      e.stopPropagation();
      openMediaAtIndex(index);
    });
  });

  /* ---------- CLAVIER ---------- */
  document.addEventListener("keydown", (e) => {
    if (!activeMediaClone) return;

    if (e.key === "Escape") {
      const video = activeMediaClone.querySelector("video");
      if (video) video.pause();
      activeMediaClone.remove();
      activeMediaClone = null;
      activeIndex = -1;
      document.body.style.overflow = "";
    }

    if (e.key === "ArrowRight") {
      openMediaAtIndex((activeIndex + 1) % overviewItems.length);
    }

    if (e.key === "ArrowLeft") {
      openMediaAtIndex(
        (activeIndex - 1 + overviewItems.length) % overviewItems.length
      );
    }
  });
}
