function initIndex() {
  const home = document.querySelector('[data-page="index"]');
  if (!home) return;

  /* -----------------------------------------------------
     NUMÉROTATION
  ----------------------------------------------------- */

  document
    .querySelectorAll(".index-list .index-item")
    .forEach((item, index) => {
      const counter = item.querySelector("[item-counter]");
      if (!counter) return;
      counter.textContent = String(index + 1).padStart(2, "0") + ".";
    });

  /* -----------------------------------------------------
   INDEX MEDIA — FULLSCREEN CLONE + CONTROLLERS
----------------------------------------------------- */

  const indexItems = Array.from(document.querySelectorAll(".index-item"));

  let activeMediaClone = null;
  let activeIndex = -1;

  function getMediaFromItem(item) {
    return item.querySelector(
      ".index-media-inner .index-img-inner:not(.w-condition-invisible) .index-img, " +
        ".index-media-inner .index-video-inner:not(.w-condition-invisible) .index-video"
    );
  }

  function openMediaAtIndex(index) {
    const item = indexItems[index];
    if (!item) return;

    const media = getMediaFromItem(item);
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

    /* ---------- CLONE DES CONTROLLERS ---------- */
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
        { threshold: 0.5 }
      );

      observer.observe(cloneVideo);

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
      openMediaAtIndex((activeIndex + 1) % indexItems.length);
    });

    prevBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      openMediaAtIndex(
        (activeIndex - 1 + indexItems.length) % indexItems.length
      );
    });

    activeMediaClone = wrapper;
  }

  /* -----------------------------------------------------
   OUVERTURE AU CLIC (SUR INDEX-ITEM)
----------------------------------------------------- */

  indexItems.forEach((item, index) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      openMediaAtIndex(index);
    });
  });

  /* -----------------------------------------------------
   CLAVIER
----------------------------------------------------- */

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
      openMediaAtIndex((activeIndex + 1) % indexItems.length);
    }

    if (e.key === "ArrowLeft") {
      openMediaAtIndex(
        (activeIndex - 1 + indexItems.length) % indexItems.length
      );
    }
  });
}
