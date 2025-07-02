document.addEventListener("DOMContentLoaded", function () {
  // --- Конфиг ---
  const ADMIN_LOGIN = "admin";
  const ADMIN_PASSWORD = "admin123";

  // --- Авторизация ---
  const adminAuth = document.getElementById("adminAuth");
  const adminPanel = document.getElementById("adminPanel");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const adminAuthError = document.getElementById("adminAuthError");
  const adminLogout = document.getElementById("adminLogout");

  // --- CRUD ТОВАРОВ ---
  const productsTableBody = document.getElementById("productsTableBody");
  const addProductBtn = document.getElementById("addProductBtn");
  const productModal = document.getElementById("productModal");

  // --- ЗАКАЗЫ ---
  const ordersTableBody = document.getElementById("ordersTableBody");
  const orderDetailsModal = document.getElementById("orderDetailsModal");

  // --- Вкладки ---
  const tabs = document.querySelectorAll(".admin-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      document
        .querySelectorAll(".admin-tab-content")
        .forEach((c) => (c.style.display = "none"));
      if (this.dataset.tab === "products") {
        document.getElementById("productsTab").style.display = "";
      } else {
        document.getElementById("ordersTab").style.display = "";
      }
    });
  });

  // --- Авторизация ---
  if (localStorage.getItem("adminAuth") === "true") {
    showPanel();
  }
  adminLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const login = document.getElementById("adminLogin").value.trim();
    const pass = document.getElementById("adminPassword").value.trim();
    if (login === ADMIN_LOGIN && pass === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true");
      showPanel();
    } else {
      adminAuthError.textContent = "Неверный логин или пароль";
    }
  });
  adminLogout.addEventListener("click", function () {
    localStorage.removeItem("adminAuth");
    location.reload();
  });

  function showPanel() {
    adminAuth.style.display = "none";
    adminPanel.style.display = "block";
    renderProducts();
    renderOrders();
    initProductTableEvents();
    initOrderTableEvents();
  }

  // --- CRUD ТОВАРОВ ---
  function getProducts() {
    return JSON.parse(localStorage.getItem("adminProducts") || "[]");
  }
  function setProducts(arr) {
    localStorage.setItem("adminProducts", JSON.stringify(arr));
  }
  function renderProducts() {
    const products = getProducts();
    productsTableBody.innerHTML = "";
    products.forEach((p, i) => {
      productsTableBody.innerHTML += `
      <tr data-idx="${i}">
        <td><img src="${p.img || ""}" alt="${p.title}" /></td>
        <td>${p.title}</td>
        <td>${p.price}</td>
        <td>
          <button class="admin-action-btn edit-btn">Редактировать</button>
          <button class="admin-action-btn delete-btn">Удалить</button>
        </td>
      </tr>
    `;
    });
  }
  function initProductTableEvents() {
    productsTableBody.onclick = function (e) {
      const row = e.target.closest("tr");
      if (!row) return;
      const idx = +row.dataset.idx;
      if (e.target.classList.contains("edit-btn")) {
        const products = getProducts();
        showProductModal(products[idx], idx);
      }
      if (e.target.classList.contains("delete-btn")) {
        if (confirm("Удалить товар?")) {
          const products = getProducts();
          products.splice(idx, 1);
          setProducts(products);
          renderProducts();
          initProductTableEvents();
        }
      }
    };
  }
  addProductBtn.addEventListener("click", () => showProductModal());
  function showProductModal(product = {}, idx = null) {
    productModal.innerHTML = `
    <div class="admin-modal-content">
      <div class="admin-modal-title">${
        idx === null ? "Добавить" : "Редактировать"
      } товар</div>
      <label>Название</label>
      <input type="text" id="modalProductTitle" value="${
        product.title || ""
      }" required />
      <label>Цена</label>
      <input type="text" id="modalProductPrice" value="${
        product.price || ""
      }" required />
      <label>URL изображения</label>
      <input type="text" id="modalProductImg" value="${product.img || ""}" />
      <div class="admin-modal-btns">
        <button class="admin-modal-btn" id="saveProductBtn">Сохранить</button>
        <button class="admin-modal-btn" id="cancelProductBtn">Отмена</button>
      </div>
    </div>
  `;
    productModal.style.display = "flex";
    document.getElementById("cancelProductBtn").onclick = () =>
      (productModal.style.display = "none");
    document.getElementById("saveProductBtn").onclick = () => {
      const title = document.getElementById("modalProductTitle").value.trim();
      const price = document.getElementById("modalProductPrice").value.trim();
      const img = document.getElementById("modalProductImg").value.trim();
      if (!title || !price) return alert("Заполните все поля!");
      const products = getProducts();
      if (idx === null) {
        products.push({ title, price, img });
      } else {
        products[idx] = { title, price, img };
      }
      setProducts(products);
      productModal.style.display = "none";
      renderProducts();
      initProductTableEvents();
    };
  }

  // --- ЗАКАЗЫ ---
  function getOrders() {
    return JSON.parse(localStorage.getItem("adminOrders") || "[]");
  }
  function setOrders(arr) {
    localStorage.setItem("adminOrders", JSON.stringify(arr));
  }
  function renderOrders() {
    const orders = getOrders();
    ordersTableBody.innerHTML = "";
    orders.forEach((o, i) => {
      ordersTableBody.innerHTML += `
      <tr data-idx="${i}">
        <td>${i + 1}</td>
        <td>${o.fio}</td>
        <td>${o.phone}</td>
        <td>${o.email}</td>
        <td><button class="admin-action-btn details-btn">Подробнее</button></td>
        <td>${o.status || "Новый"}</td>
        <td>
          <button class="admin-action-btn status-btn">Сменить статус</button>
        </td>
      </tr>
    `;
    });
  }
  function initOrderTableEvents() {
    ordersTableBody.onclick = function (e) {
      const row = e.target.closest("tr");
      if (!row) return;
      const idx = +row.dataset.idx;
      if (e.target.classList.contains("details-btn")) {
        const orders = getOrders();
        const o = orders[idx];
        orderDetailsModal.innerHTML = `
    <div class="admin-modal-content">
      <div class="admin-modal-title">Детали заказа</div>
      <div><b>Покупатель:</b> ${o.fio}</div>
      <div><b>Телефон:</b> ${o.phone}</div>
      <div><b>Email:</b> ${o.email}</div>
      <div><b>Доставка:</b> ${o.delivery}</div>
      <div><b>Оплата:</b> ${o.payment}</div>
      <div><b>Комментарий:</b> ${o.comment || "-"}</div>
      <div><b>Товары:</b><br>${(o.cart || [])
        .map((t) => `<div>- ${t.title} (${t.quantity || 1} шт.)</div>`)
        .join("")}</div>
      <div class="admin-modal-btns"><button class="admin-modal-btn" id="closeOrderModal">Закрыть</button></div>
    </div>
  `;
        orderDetailsModal.style.display = "flex";
        document.getElementById("closeOrderModal").onclick = () =>
          (orderDetailsModal.style.display = "none");
      }
      if (e.target.classList.contains("status-btn")) {
        const orders = getOrders();
        const statuses = ["Новый", "В работе", "Выполнен", "Отменён"];
        let statusIdx = statuses.indexOf(orders[idx].status || "Новый");
        statusIdx = (statusIdx + 1) % statuses.length;
        orders[idx].status = statuses[statusIdx];
        setOrders(orders);
        renderOrders();
        initOrderTableEvents();
      }
    };
  }

  // --- Сохранение заказов из формы заказа (order.html) ---
  (function syncOrderForm() {
    if (window.location.pathname.includes("order.html")) {
      const form = document.getElementById("orderForm");
      if (form) {
        form.addEventListener("submit", function (e) {
          const fio = form.fio.value;
          const phone = form.phone.value;
          const email = form.email.value;
          const delivery = form.delivery.value;
          const payment = form.payment.value;
          const comment = form.comment.value;
          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          const orders = JSON.parse(
            localStorage.getItem("adminOrders") || "[]"
          );
          orders.push({
            fio,
            phone,
            email,
            delivery,
            payment,
            comment,
            cart,
            status: "Новый",
          });
          localStorage.setItem("adminOrders", JSON.stringify(orders));
        });
      }
    }
  })();
});
