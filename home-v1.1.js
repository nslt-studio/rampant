function initHome() {
  const home = document.querySelector('[data-page="home"]');
  if (!home) return;

  const items = document.querySelectorAll(".selected-list .selected-item");
  if (!items.length) return;

  let activeItem = items[0];

  // Active le premier item au chargement
  activeItem.classList.add("active");

  // Gestion du hover
  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      if (item === activeItem) return;

      activeItem.classList.remove("active");
      item.classList.add("active");
      activeItem = item;
    });
  });
}
