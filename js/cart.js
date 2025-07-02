document.addEventListener("DOMContentLoaded", function () {
  // Получаем все кнопки 'В корзину' в каталоге
  const addToCartButtons = document.querySelectorAll(
    ".product-card button:not(.buy-now-btn)"
  );

  // Блокируем кнопки для уже добавленных товаров и заменяем на счетчик
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!Array.isArray(cart)) cart = [];
  } catch (e) {
    cart = [];
  }
  addToCartButtons.forEach((btn) => {
    const card = btn.closest(".product-card");
    const title = card.querySelector("h3").textContent.trim();
    const id = title.replace(/\s+/g, "_").toLowerCase();
    const cartItem = cart.find((item) => item.id === id);
    if (cartItem) {
      // Заменяем кнопку на счетчик
      const counter = createCounter(cartItem.quantity, id, btn, card);
      btn.replaceWith(counter);
    }
  });

  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = btn.closest(".product-card");
      const title = card.querySelector("h3").textContent.trim();
      const price = card.querySelector("p").textContent.trim();
      const img = card.querySelector("img").getAttribute("src");
      const id = title.replace(/\s+/g, "_").toLowerCase();
      addToCart({ id, title, price, img, quantity: 1 });
      // Заменяем кнопку на счетчик
      const counter = createCounter(1, id, btn, card);
      btn.replaceWith(counter);
    });
  });

  function createCounter(quantity, id, btn, card) {
    const wrapper = document.createElement("div");
    wrapper.className = "cart-counter";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "8px";
    const minus = document.createElement("button");
    minus.textContent = "-";
    minus.className = "cart-counter-btn";
    minus.style.width = "32px";
    minus.style.height = "32px";
    minus.style.borderRadius = "8px";
    minus.style.background = "#232323";
    minus.style.color = "#b08a5a";
    minus.style.fontSize = "1.2rem";
    minus.style.border = "none";
    minus.style.cursor = "pointer";
    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.className = "cart-counter-btn";
    plus.style.width = "32px";
    plus.style.height = "32px";
    plus.style.borderRadius = "8px";
    plus.style.background = "#b08a5a";
    plus.style.color = "#232323";
    plus.style.fontSize = "1.2rem";
    plus.style.border = "none";
    plus.style.cursor = "pointer";
    const count = document.createElement("span");
    count.textContent = quantity;
    count.className = "cart-counter-value";
    count.style.minWidth = "24px";
    count.style.textAlign = "center";
    count.style.fontWeight = "600";
    count.style.color = "#b08a5a";
    wrapper.appendChild(minus);
    wrapper.appendChild(count);
    wrapper.appendChild(plus);
    // Обработчики
    plus.onclick = function () {
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const idx = cart.findIndex((item) => item.id === id);
      if (idx > -1) {
        cart[idx].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        count.textContent = cart[idx].quantity;
      }
    };
    minus.onclick = function () {
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const idx = cart.findIndex((item) => item.id === id);
      if (idx > -1) {
        cart[idx].quantity -= 1;
        if (cart[idx].quantity <= 0) {
          cart.splice(idx, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          // Возвращаем кнопку 'В корзину'
          const newBtn = btn.cloneNode(true);
          newBtn.disabled = false;
          newBtn.textContent = "В корзину";
          newBtn.addEventListener("click", btn.onclick);
          wrapper.replaceWith(newBtn);
        } else {
          localStorage.setItem("cart", JSON.stringify(cart));
          count.textContent = cart[idx].quantity;
        }
      }
    };
    return wrapper;
  }

  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart = cart.filter(
      (item) => item && item.id && item.title && item.price && item.img
    );
    const idx = cart.findIndex((item) => item.id === product.id);
    if (idx > -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push(product);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Корзина: отображение товаров
  if (document.querySelector(".cart-table")) {
    renderCart();
    document
      .querySelector(".cart-table tbody")
      .addEventListener("click", function (e) {
        if (e.target.classList.contains("cart-remove-btn")) {
          const row = e.target.closest("tr");
          const id = row.dataset.id;
          removeFromCart(id);
          renderCart();
        }
      });
    document
      .querySelector(".cart-table tbody")
      .addEventListener("change", function (e) {
        if (e.target.classList.contains("cart-qty-input")) {
          const row = e.target.closest("tr");
          const id = row.dataset.id;
          updateQuantity(id, parseInt(e.target.value, 10));
          renderCart();
        }
      });
  }

  function renderCart() {
    let cart;
    try {
      cart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (!Array.isArray(cart)) cart = [];
    } catch (e) {
      cart = [];
    }
    const tbody = document.querySelector(".cart-table tbody");
    tbody.innerHTML = "";
    let sum = 0;
    if (cart.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#b08a5a;padding:32px 0;">Корзина пуста</td></tr>`;
      document.querySelector(".cart-summary-row span:last-child").textContent =
        "0 ₽";
      document.querySelectorAll(
        ".cart-summary-row span:last-child"
      )[1].textContent = "0 ₽";
      document.querySelector(
        ".cart-summary-total span:last-child"
      ).textContent = "0 ₽";
      return;
    }
    cart.forEach((item) => {
      let priceNum = 0;
      if (typeof item.price === "string") {
        priceNum = parseInt(item.price.replace(/\D/g, "")) || 0;
      }
      sum += priceNum * (item.quantity || 1);
      tbody.innerHTML += `
        <tr data-id="${item.id}">
          <td><img src="${item.img}" alt="${
        item.title
      }" class="cart-img" /></td>
          <td>${item.title}</td>
          <td>${item.price}</td>
          <td><input type="number" min="1" value="${
            item.quantity || 1
          }" class="cart-qty-input" /></td>
          <td><button class="cart-remove-btn">×</button></td>
        </tr>
      `;
    });
    // Итоговая стоимость
    document.querySelector(".cart-summary-row span:last-child").textContent =
      sum.toLocaleString("ru-RU") + " ₽";
    // Скидка и доставка (пример)
    let discount = cart.length > 0 ? 10000 : 0;
    document.querySelectorAll(
      ".cart-summary-row span:last-child"
    )[1].textContent = discount.toLocaleString("ru-RU") + " ₽";
    document.querySelector(".cart-summary-total span:last-child").textContent =
      (sum - discount).toLocaleString("ru-RU") + " ₽";
  }

  function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart = cart.filter((item) => item && item.id && item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateQuantity(id, qty) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart = cart.map((item) =>
      item.id === id ? { ...item, quantity: qty } : item
    );
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Переход на оформление заказа из корзины
  if (document.querySelector(".cart-btn-primary")) {
    document
      .querySelector(".cart-btn-primary")
      .addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "order.html";
      });
  }
});
