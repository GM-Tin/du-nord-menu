const budgetInput = document.querySelector("#budget");
const restaurantSelect = document.querySelector("#place");
const lunchOnlyCheckbox = document.querySelector("#lunchOnly");
const resultsGrid = document.querySelector("#results");
const menuItems = window.MENU ?? [];

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
  return lunchTerms.test(item.category + " " + item.item);
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
  const hours = document.createElement("span");
  hours.className = "time";
  hours.textContent = "◷ Horario no informado";
  const badge = document.createElement("span");
  badge.className = "tag";
  badge.textContent = item.price <= budget ? "Dentro de tu presupuesto" : "—";
  bottom.append(hours, badge);
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
    ? "Opciones hasta " + formatPrice(budget)
    : "Explora el menú";
  document.querySelector("#count").textContent = matchingItems.length + " " +
    (matchingItems.length === 1 ? "opción" : "opciones");
  document.querySelector("#hint").textContent = lunchOnlyCheckbox.checked
    ? "Incluye categorías de platos fuertes, almuerzos y menús; revisa la categoría original de cada opción."
    : "Ordenadas de menor a mayor precio. Elige un plato dentro de tu presupuesto.";

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
