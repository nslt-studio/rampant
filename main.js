(function () {
  "use strict";

  /* ============================================================
     SWUP — PAGE ROUTER
  ============================================================ */

  window.swup = new Swup({ containers: ["#swup"] });

  /* ============================================================
     ACTIVE LINKS (w--current)
  ============================================================ */

  function normalizePath(path) {
    return path.replace(window.location.origin, "").replace(/\/$/, "");
  }

  function setCurrentLinksByPath(path) {
    const norm = normalizePath(path);
    document
      .querySelectorAll("a.w--current")
      .forEach((el) => el.classList.remove("w--current"));
    document.querySelectorAll("a[href]").forEach((link) => {
      if (normalizePath(link.getAttribute("href") || "") === norm) {
        link.classList.add("w--current");
      }
    });
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (
      href.startsWith("#") ||
      link.target === "_blank" ||
      link.host !== window.location.host
    )
      return;
    setCurrentLinksByPath(href);
  });

  function syncCurrentLinks() {
    setCurrentLinksByPath(window.location.pathname);
  }

  document.addEventListener("DOMContentLoaded", syncCurrentLinks);
  window.swup.hooks.on("page:view", syncCurrentLinks);

  /* ============================================================
     LOADER — ONCE PER SESSION
  ============================================================ */

  function initLoaderOnce() {
    var loader = document.querySelector(".loader");
    var logo = document.querySelector("#logoLoader");
    if (!loader || !logo) return;

    if (sessionStorage.getItem("loaderPlayed")) {
      loader.remove();
      return;
    }

    var text = logo.textContent.trim();
    var words = text.split(" ");
    logo.textContent = "";

    var START_DELAY = 900;
    var LETTER_DELAY = 60;
    var END_DELAY = 900;
    var LOGO_OUT_DELAY = 300;
    var LOADER_OUT_DELAY = 600;

    var wordWrappers = [];

    words.forEach(function (word, i) {
      var wrap = document.createElement("span");
      [].slice.call(word).forEach(function (ch) {
        var span = document.createElement("span");
        span.textContent = ch;
        wrap.appendChild(span);
      });
      logo.appendChild(wrap);
      wordWrappers.push(wrap);
      if (i < words.length - 1) logo.appendChild(document.createTextNode(" "));
    });

    requestAnimationFrame(function () {
      logo.style.opacity = "1";
    });

    var leftLetters = [].slice.call(wordWrappers[0].children);
    var rightLetters = [].slice.call(wordWrappers[1].children).reverse();
    var maxLen = Math.max(leftLetters.length, rightLetters.length);

    for (var i = 0; i < maxLen; i++) {
      (function (idx) {
        var delay = START_DELAY + idx * LETTER_DELAY;
        if (leftLetters[idx]) {
          setTimeout(function () {
            leftLetters[idx].offsetHeight;
            leftLetters[idx].style.opacity = "1";
          }, delay);
        }
        if (rightLetters[idx]) {
          setTimeout(function () {
            rightLetters[idx].offsetHeight;
            rightLetters[idx].style.opacity = "1";
          }, delay);
        }
      })(i);
    }

    var animEnd = START_DELAY + maxLen * LETTER_DELAY + END_DELAY;

    setTimeout(function () {
      logo.style.transition = "opacity 300ms ease";
      logo.style.opacity = "0";
      setTimeout(function () {
        loader.style.transition = "opacity 300ms ease";
        loader.style.opacity = "0";
        setTimeout(function () {
          loader.remove();
          sessionStorage.setItem("loaderPlayed", "true");
        }, 300);
      }, LOADER_OUT_DELAY);
    }, animEnd + LOGO_OUT_DELAY);
  }

  document.addEventListener("DOMContentLoaded", initLoaderOnce);

  /* ============================================================
     FULLSCREEN GALLERY (shared by index & overview)
  ============================================================ */

  var activeGallery = null;

  function openFullscreen(items, index, getMedia) {
    var item = items[index];
    if (!item) return;

    var media = getMedia(item);
    if (!media) return;

    if (activeGallery) {
      var oldVid = activeGallery.wrapper.querySelector("video");
      if (oldVid) oldVid.pause();
      activeGallery.wrapper.remove();
    }

    var clone = media.cloneNode(true);
    var cloneVideo =
      clone.tagName === "VIDEO" ? clone : clone.querySelector("video");
    var originalVideo =
      media.tagName === "VIDEO" ? media : media.querySelector("video");

    if (cloneVideo) {
      cloneVideo.muted = true;
      cloneVideo.playsInline = true;
      if (originalVideo && !isNaN(originalVideo.currentTime)) {
        cloneVideo.currentTime = originalVideo.currentTime;
      }
    }

    var wrapper = document.createElement("div");
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
      opacity: "1",
      maxWidth: "100%",
      maxHeight: "100%",
      pointerEvents: "none",
      aspectRatio: "4 / 3",
    });

    wrapper.appendChild(clone);

    var closeBtn = document.querySelector(".clone-close");
    var nextBtn = document.querySelector(".clone-next");
    var prevBtn = document.querySelector(".clone-prev");
    closeBtn = closeBtn ? closeBtn.cloneNode(true) : null;
    nextBtn = nextBtn ? nextBtn.cloneNode(true) : null;
    prevBtn = prevBtn ? prevBtn.cloneNode(true) : null;

    [closeBtn, nextBtn, prevBtn].forEach(function (btn) {
      if (!btn) return;
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
      wrapper.appendChild(btn);
    });

    document.body.appendChild(wrapper);
    document.body.style.overflow = "hidden";

    if (cloneVideo) {
      cloneVideo.style.opacity = "0";
      var obs = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            cloneVideo.style.opacity = "1";
            obs.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      obs.observe(cloneVideo);
      requestAnimationFrame(function () {
        cloneVideo.play().catch(function () {});
      });
    }

    activeGallery = { wrapper: wrapper, items: items, index: index, getMedia: getMedia };

    function closeGallery() {
      var vid = wrapper.querySelector("video");
      if (vid) vid.pause();
      wrapper.remove();
      activeGallery = null;
      document.body.style.overflow = "";
    }

    if (closeBtn) closeBtn.addEventListener("click", closeGallery);
    if (nextBtn)
      nextBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        openFullscreen(items, (index + 1) % items.length, getMedia);
      });
    if (prevBtn)
      prevBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        openFullscreen(
          items,
          (index - 1 + items.length) % items.length,
          getMedia
        );
      });
  }

  document.addEventListener("keydown", function (e) {
    if (!activeGallery) return;
    var g = activeGallery;

    if (e.key === "Escape") {
      var vid = g.wrapper.querySelector("video");
      if (vid) vid.pause();
      g.wrapper.remove();
      activeGallery = null;
      document.body.style.overflow = "";
    } else if (e.key === "ArrowRight") {
      openFullscreen(g.items, (g.index + 1) % g.items.length, g.getMedia);
    } else if (e.key === "ArrowLeft") {
      openFullscreen(
        g.items,
        (g.index - 1 + g.items.length) % g.items.length,
        g.getMedia
      );
    }
  });

  /* ============================================================
     GLOBAL — CLOCK, FADE-IN, MEDIA OBSERVER
  ============================================================ */

  var clockInterval = null;
  var timeFormatter = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });

  function initGlobal() {
    var timeEl = document.getElementById("currentTime");
    if (timeEl) {
      if (clockInterval) clearInterval(clockInterval);
      var update = function () {
        timeEl.textContent = timeFormatter.format(new Date());
      };
      update();
      clockInterval = setInterval(update, 1000);
    }

    var FADE_MS = 300;

    function prepare(el) {
      el.style.opacity = "0";
      el.style.willChange = "opacity";
    }

    function fadeIn(el) {
      el.style.transition = "opacity " + FADE_MS + "ms ease";
      requestAnimationFrame(function () {
        el.style.opacity = "1";
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var el = entry.target;

          if (el.tagName === "IMG") {
            if (entry.isIntersecting && el.dataset.loaded === "true") {
              fadeIn(el);
              observer.unobserve(el);
            }
          }

          if (el.tagName === "VIDEO") {
            if (entry.isIntersecting) {
              if (!el.dataset.faded) {
                fadeIn(el);
                el.dataset.faded = "true";
              }
              var tryPlay = function () {
                el.play().catch(function () {});
              };
              if (el.readyState >= 1) tryPlay();
              else el.addEventListener("canplay", tryPlay, { once: true });
            } else {
              el.pause();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("img").forEach(function (img) {
      prepare(img);
      if (img.complete && img.naturalWidth !== 0) {
        img.dataset.loaded = "true";
        observer.observe(img);
      } else {
        img.addEventListener(
          "load",
          function () {
            img.dataset.loaded = "true";
            observer.observe(img);
          },
          { once: true }
        );
      }
    });

    document.querySelectorAll("video").forEach(function (vid) {
      prepare(vid);
      vid.muted = true;
      vid.playsInline = true;
      vid.setAttribute("muted", "");
      vid.setAttribute("playsinline", "");
      var ready = function () {
        observer.observe(vid);
      };
      if (vid.readyState >= 1) ready();
      else vid.addEventListener("loadedmetadata", ready, { once: true });
    });
  }

  /* ============================================================
     HOME PAGE
  ============================================================ */

  function initHome() {
    if (!document.querySelector('[data-page="home"]')) return;

    var items = document.querySelectorAll(".selected-list .selected-item");
    if (!items.length) return;

    var active = items[0];
    active.classList.add("active");

    items.forEach(function (item) {
      item.addEventListener("mouseenter", function () {
        if (item === active) return;
        active.classList.remove("active");
        item.classList.add("active");
        active = item;
      });
    });
  }

  /* ============================================================
     INDEX PAGE
  ============================================================ */

  function initIndex() {
    if (!document.querySelector('[data-page="index"]')) return;

    document
      .querySelectorAll(".index-list .index-item")
      .forEach(function (item, i) {
        var counter = item.querySelector("[item-counter]");
        if (counter) counter.textContent = String(i + 1).padStart(2, "0") + ".";
      });

    var items = Array.from(document.querySelectorAll(".index-item"));

    var getMedia = function (item) {
      return item.querySelector(
        ".index-media-inner .index-img-inner:not(.w-condition-invisible) .index-img, " +
          ".index-media-inner .index-video-inner:not(.w-condition-invisible) .index-video"
      );
    };

    items.forEach(function (item, i) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openFullscreen(items, i, getMedia);
      });
    });
  }

  /* ============================================================
     OVERVIEW PAGE
  ============================================================ */

  function initOverview() {
    if (!document.querySelector('[data-page="overview"]')) return;

    var items = document.querySelectorAll(".overview-item");
    var activeClone = null;

    items.forEach(function (item) {
      var src = item.querySelector(".overview-hover-titles-inner");
      if (!src) return;

      item.addEventListener("mouseenter", function () {
        if (activeClone) {
          activeClone.remove();
          activeClone = null;
        }
        var rect = item.getBoundingClientRect();
        var clone = src.cloneNode(true);
        Object.assign(clone.style, {
          position: "absolute",
          top: rect.top + window.scrollY + "px",
          left: "0",
          width: "100vw",
          opacity: "1",
          pointerEvents: "none",
          zIndex: "999",
          boxSizing: "border-box",
        });
        document.body.appendChild(clone);
        activeClone = clone;
      });

      item.addEventListener("mouseleave", function () {
        if (activeClone) {
          activeClone.remove();
          activeClone = null;
        }
      });
    });

    document
      .querySelectorAll(".overview-list .overview-item")
      .forEach(function (item, i) {
        var counter = item.querySelector("[item-counter]");
        if (counter)
          counter.textContent = String(i + 1).padStart(2, "0") + ".";
      });

    var overviewItems = Array.from(document.querySelectorAll(".overview-item"));

    var getMedia = function (item) {
      return item.querySelector(
        ".overview-img-inner:not(.w-condition-invisible) .overview-img, " +
          ".overview-video-inner:not(.w-condition-invisible) .overview-video"
      );
    };

    overviewItems.forEach(function (item, i) {
      var media = getMedia(item);
      if (!media) return;
      media.addEventListener("click", function (e) {
        e.stopPropagation();
        openFullscreen(overviewItems, i, getMedia);
      });
    });
  }

  /* ============================================================
     PAGE ROUTING
  ============================================================ */

  function initPage() {
    initGlobal();
    initHome();
    initOverview();
    initIndex();
  }

  document.addEventListener("DOMContentLoaded", initPage);
  window.swup.hooks.on("page:view", initPage);
})();
