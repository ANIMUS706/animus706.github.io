const products = [
  { id: 1, name: "مداد ۲B", price: 5000, image: "https://via.placeholder.com/200x150" },
  { id: 2, name: "دفتر ۱۰۰ برگ", price: 20000, image: "https://via.placeholder.com/200x150" },
  { id: 3, name: "پاک‌کن نرم", price: 3000, image: "https://via.placeholder.com/200x150" },
  { id: 4, name: "مداد رنگی ۱۲ رنگ", price: 45000, image: "https://via.placeholder.com/200x150" },
];

let cartCount = 0;
const productsContainer = document.getElementById("products");
const cartCountEl = document.getElementById("cart-count");

products.forEach(product => {
  const productDiv = document.createElement("div");
  productDiv.classList.add("product");
  productDiv.innerHTML = 
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>قیمت: ${product.price.toLocaleString()} تومان</p>
    <button data-id="${product.id}">افزودن به سبد خرید</button>
  ;
  productsContainer.appendChild(productDiv);
});

productsContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    cartCount++;
    cartCountEl.textContent = cartCount;
    alert("محصول به سبد خرید اضافه شد!");
  }
});
