const STORAGE_KEY = "tee_trolley_products_v2";
const demoProducts = [
  { id: crypto.randomUUID(), name: "Brown Butter Sea Salt Cookies", category: "Cookies", price: "$20 / dozen", quantity: 7, description: "Rich caramel notes, crisp edge, chewy center." },
  { id: crypto.randomUUID(), name: "Strawberry Shortcake Cupcakes", category: "Cupcakes", price: "$28 / 6 pack", quantity: 4, description: "Vanilla sponge, whipped frosting, strawberry compote." },
  { id: crypto.randomUUID(), name: "Spring Party Treat Box", category: "Boxes", price: "$36 each", quantity: 3, description: "Assorted bars, minis, and signature cookies." }
];

const grid = document.getElementById("productGrid");
const count = document.getElementById("inventoryCount");
const form = document.getElementById("productForm");
const clearSoldOut = document.getElementById("clearSoldOut");
const resetDemo = document.getElementById("resetDemo");
document.getElementById("year").textContent = new Date().getFullYear();

const read = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return Array.isArray(parsed) ? parsed : [...demoProducts];
  } catch {
    return [...demoProducts];
  }
};
const write = (products) => localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
const stockStatus = (q) => (q <= 0 ? "Sold Out" : q <= 3 ? `Only ${q} left` : `${q} available`);

let products = read();

function render() {
  count.textContent = `${products.filter((p) => p.quantity > 0).length} products in stock`;
  grid.innerHTML = products.length
    ? products
        .map(
          (p) => `<article class="card">
              <div class="card__top"><span class="card__category">${p.category}</span><strong>${p.price}</strong></div>
              <h3>${p.name}</h3>
              <p>${p.description || "Freshly baked."}</p>
              <div class="stock">${stockStatus(Number(p.quantity))}</div>
          </article>`
        )
        .join("")
    : "<p>No menu items yet. Add one below.</p>";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const entry = {
    id: crypto.randomUUID(),
    name: form.name.value.trim(),
    category: form.category.value,
    price: form.price.value.trim(),
    quantity: Number(form.quantity.value),
    description: form.description.value.trim()
  };
  products = [entry, ...products.filter((p) => p.name.toLowerCase() !== entry.name.toLowerCase())];
  write(products);
  render();
  form.reset();
});

clearSoldOut.addEventListener("click", () => {
  products = products.filter((p) => p.quantity > 0);
  write(products);
  render();
});

resetDemo.addEventListener("click", () => {
  products = [...demoProducts];
  write(products);
  render();
});

render();
