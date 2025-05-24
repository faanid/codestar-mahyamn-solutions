import { getProduct } from "./api/getProduct.js";

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 3000);
}

function renderProduct(product) {
  const card = document.getElementById("product-card");

  const badgeClass = product.inStock ? "show" : "hidden";
  const badgeText = product.inStock ? "موجود" : "ناموجود";
  const badgeStatusClass = product.inStock ? "available" : "unavailable";

  card.innerHTML = `
    <div class="card-header">
      <img class="product-image" src="${product.imgUrl}" alt="${product.title}" />
      <div class="badge ${badgeStatusClass}">${badgeText}</div>
    </div>
    <div class="card-body">
      <h2 class="product-title">${product.title}</h2>
      <p class="product-brand">برند: ${product.brand}</p>
      <p class="product-category">دسته‌بندی: ${product.category}</p>
      <p class="product-price">${product.price}</p>
      <p class="product-description">${product.description}</p>
      <div class="product-rating">
        <span>⭐ ${product.rating}</span>
        |
        <span>فروش: ${product.sold} عدد</span>
      </div>
    </div>
  `;
  card.classList.add("show");
}

function renderError() {
  const card = document.getElementById("product-card");

  card.innerHTML = `
    <p style="color: var(--error-color); font-weight: bold;">خطا در بارگذاری اطلاعات</p>
    <button id="retry-btn" class="retry-btn">تلاش مجدد</button>
  `;

  const retryBtn = document.getElementById("retry-btn");
  retryBtn.addEventListener("click", loadProduct);
}

function loadProduct() {
  const card = document.getElementById("product-card");
  card.innerHTML = `
    <img src="assets/spinner.svg" alt="در حال بارگذاری..." class="spinner">
  `;

  getProduct()
    .then((product) => {
      renderProduct(product);
    })
    .catch((err) => {
      showToast(err);
      renderError();
    });
}

loadProduct();
