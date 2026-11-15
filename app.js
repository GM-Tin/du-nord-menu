const budgetInput = document.querySelector("#budget");
const restaurantSelect = document.querySelector("#place");
const lunchOnlyCheckbox = document.querySelector("#lunchOnly");
const resultsGrid = document.querySelector("#results");
const interpretation = document.querySelector("#interpretation");
const menuItems = window.MENU ?? [];

const pageTabs = [...document.querySelectorAll('[role="tab"]')];
const tabPanels = [...document.querySelectorAll('[role="tabpanel"]')];

function activateTab(activeTab) {
  for (const tab of pageTabs) {
    const isActive = tab === activeTab;
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
    tab.classList.toggle("is-active", isActive);
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !isActive;
  }
}

for (const [index, tab] of pageTabs.entries()) {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % pageTabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + pageTabs.length) % pageTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = pageTabs.length - 1;
    else return;

    event.preventDefault();
    pageTabs[nextIndex].focus();
    activateTab(pageTabs[nextIndex]);
  });
}

const formatPrice = (amount) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);

const restaurants = [...new Set(menuItems.map((item) => item.restaurant))].sort(
  (first, second) => first.localeCompare(second, "es"),
);

for (const restaurant of restaurants) {
  const option = document.createElement("option");
  option.value = restaurant;
  option.textContent = restaurant;
  restaurantSelect.append(option);
}

function isLunchOption(item) {
  const lunchTerms = /almuerzo|menú|menu|arroz|carnes|aves|pescados|mariscos|pastas|platos|hamburguesas|parrillas|shawarma|tradicional árabe|mixto|vegetarianos|crepes salados/i;
  return lunchTerms.test(`${item.category} ${item.item}`);
}

function createMenuCard(item, budget) {
  const card = document.createElement("article");
  card.className = "card";

  const top = document.createElement("div");
  top.className = "cardtop";

  const restaurant = document.createElement("div");
  restaurant.className = "restaurant";
  restaurant.textContent = item.restaurant;

  const price = document.createElement("div");
  price.className = "price";
  price.textContent = formatPrice(item.price);
  top.append(restaurant, price);

  const name = document.createElement("div");
  name.className = "item";
  name.textContent = item.item;

  const category = document.createElement("div");
  category.className = "category";
  category.textContent = item.category;
  card.append(top, name, category);

  if (item.notes) {
    const note = document.createElement("div");
    note.className = "note";
    note.textContent = item.notes;
    card.append(note);
  }

  const bottom = document.createElement("div");
  bottom.className = "cardbottom";

  const badge = document.createElement("span");
  badge.className = "tag";
  badge.textContent = item.price <= budget ? "Dentro de tu presupuesto" : "—";
  bottom.append(badge);
  card.append(bottom);

  return card;
}

function showEmptyState() {
  const emptyMessage = document.createElement("div");
  emptyMessage.className = "empty";
  emptyMessage.innerHTML = "🥣<br><br>No encontramos opciones con estos filtros.<br><small>Prueba subir tu presupuesto o quitar algún filtro.</small>";
  resultsGrid.append(emptyMessage);
}

function renderMenu() {
  const budget = Math.max(0, Number(budgetInput.value) || 0);
  const matchingItems = menuItems
    .filter((item) => item.price <= budget)
    .filter((item) => !restaurantSelect.value || item.restaurant === restaurantSelect.value)
    .filter((item) => !lunchOnlyCheckbox.checked || isLunchOption(item))
    .sort((first, second) => first.price - second.price || first.item.localeCompare(second.item, "es"));

  document.querySelector("#heading").textContent = budget
    ? `Opciones hasta ${formatPrice(budget)}`
    : "Explora el menú";
  document.querySelector("#count").textContent =
    `${matchingItems.length} ${matchingItems.length === 1 ? "opción" : "opciones"}`;
  document.querySelector("#hint").textContent = lunchOnlyCheckbox.checked
    ? "Incluye categorías de platos fuertes, almuerzos y menús; revisa la categoría original de cada opción."
    : "Ordenadas de menor a mayor precio. Elige un plato dentro de tu presupuesto.";

  if (matchingItems.length === 0) {
    interpretation.textContent = `El conjunto de resultados está vacío: no hay productos que cumplan las condiciones con un presupuesto de ${formatPrice(budget)}.`;
  } else {
    const matchingRestaurants = new Set(matchingItems.map((item) => item.restaurant)).size;
    const cheapestItem = matchingItems[0];
    interpretation.textContent = `Hay ${matchingItems.length} ${matchingItems.length === 1 ? "opción disponible" : "opciones disponibles"} en ${matchingRestaurants} ${matchingRestaurants === 1 ? "restaurante" : "restaurantes"}. La opción más económica es ${cheapestItem.item} por ${formatPrice(cheapestItem.price)}.`;
  }

  resultsGrid.replaceChildren();
  if (matchingItems.length === 0) {
    showEmptyState();
    return;
  }

  for (const item of matchingItems) {
    resultsGrid.append(createMenuCard(item, budget));
  }
}

for (const quickBudgetButton of document.querySelectorAll(".chip")) {
  quickBudgetButton.addEventListener("click", () => {
    budgetInput.value = quickBudgetButton.dataset.amount;
    renderMenu();
  });
}

for (const control of [budgetInput, restaurantSelect, lunchOnlyCheckbox]) {
  control.addEventListener("input", renderMenu);
  control.addEventListener("change", renderMenu);
}

renderMenu();
