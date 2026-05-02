const STORAGE_KEY = "tee_trolley_products";

const demoProducts = [
  {
    id: crypto.randomUUID(),
    name: "Chocolate Chip Cookies",
    price: "$18 / dozen",
    quantity: 8,
    category: "Cookies",
    description: "Classic soft cookies with gooey chocolate chips."
  },
  {
    id: crypto.randomUUID(),
    name: "Red Velvet Cupcakes",
    price: "$24 / 6 pack",
    quantity: 4,
    category: "Cupcakes",
    description: "Cream cheese frosting and sprinkle finish."
  },
  {
    id: crypto.randomUUID(),
    name: "Mini Treat Box",
    price: "$30 each",
    quantity: 2,
    category: "Treat Boxes",
    description: "Mix of cookies, bars, and cupcake minis."
  }
];

const grid = document.querySelector("#productGrid");
const form = document.querySelector("#productForm");
const clearSoldOutBtn = document.querySelector("#clearSoldOut");
const resetDemoBtn = document.querySelector("#resetDemo");

function loadProducts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [...demoProducts];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...demoProducts];
  } catch {
    return [...demoProducts];
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function stockLabel(quantity) {
  if (quantity <= 0) return "Sold out";
  if (quantity <= 2) return `Only ${quantity} left`;
  return `${quantity} available`;
}

function render(products) {
  if (products.length === 0) {
    grid.innerHTML = '<p>No products listed yet. Add one in Admin Controls.</p>';
    return;
  }

  grid.innerHTML = products
    .map(
      (item) => `
      <article class="card">
        <span class="card__category">${item.category}</span>
        <h3>${item.name}</h3>
        <p>${item.description || "Fresh baked item."}</p>
        <div class="meta">
          <span>${item.price}</span>
          <span>${item.quantity}</span>
        </div>
        <div class="stock">${stockLabel(Number(item.quantity))}</div>
      </article>
    `
    )
    .join("");
}

let products = loadProducts();
render(products);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const newProduct = {
    id: crypto.randomUUID(),
    name: form.name.value.trim(),
    price: form.price.value.trim(),
    quantity: Number(form.quantity.value),
    category: form.category.value,
    description: form.description.value.trim()
  };

  products = [newProduct, ...products.filter((item) => item.name !== newProduct.name)];
  saveProducts(products);
  render(products);
  form.reset();
});

clearSoldOutBtn.addEventListener("click", () => {
  products = products.filter((item) => Number(item.quantity) > 0);
  saveProducts(products);
  render(products);
});

resetDemoBtn.addEventListener("click", () => {
  products = [...demoProducts];
  saveProducts(products);
  render(products);
});
