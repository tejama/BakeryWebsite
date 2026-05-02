const STORAGE_KEY = "tee_trolley_products_v3";
const demoProducts = [
  {
    id: crypto.randomUUID(),
    name: "Brown Butter Sea Salt Cookies",
    category: "Cookies",
    price: "$20 / dozen",
    quantity: 7,
    description: "Rich caramel notes, crisp edge, chewy center.",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: crypto.randomUUID(),
    name: "Strawberry Shortcake Cupcakes",
    category: "Cupcakes",
    price: "$28 / 6 pack",
    quantity: 4,
    description: "Vanilla sponge, whipped frosting, strawberry compote.",
    image:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: crypto.randomUUID(),
    name: "Blueberry Crumble Muffins",
    category: "Muffins",
    price: "$16 / 6 pack",
    quantity: 5,
    description: "Moist blueberry muffins with cinnamon crumble tops.",
    image:
      "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=1000&q=80"
  }
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
              <img class="card__image" src="${p.image || "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1000&q=80"}" alt="${p.name}" />
              <div class="card__body">
                <div class="card__top"><span class="card__category">${p.category}</span><strong>${p.price}</strong></div>
                <h3>${p.name}</h3>
                <p>${p.description || "Freshly baked."}</p>
                <div class="stock">${stockStatus(Number(p.quantity))}</div>
              </div>
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
    description: form.description.value.trim(),
    image: form.image.value.trim()
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
