// Cart System
let cart = [];

// Cart functionality
function initCart() {
  const addButtons = document.querySelectorAll(".add-to-cart-btn");
  const cartButton = document.getElementById("cart-button");
  const cartContainer = document.getElementById("cart-container");
  const cartToggle = document.getElementById("cart-toggle");
  const orderButton = document.getElementById("order-whatsapp");

  // Navbar cart elements
  const navCartButton = document.getElementById("nav-cart-button");
  const navOrderButton = document.getElementById("nav-order-whatsapp");

  // Add to cart
  addButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const name = this.dataset.name;
      const priceLocal = parseFloat(this.dataset.priceLocal);
      const priceDelivery = parseFloat(this.dataset.priceDelivery);
      const deliveryUnavailable = this.dataset.deliveryUnavailable === "true";

      // Show modal to select type
      showOrderModal(name, priceLocal, priceDelivery, deliveryUnavailable);
    });
  });

  // Cart toggle
  cartButton.addEventListener("click", () => {
    cartContainer.classList.remove("hidden");
  });

  cartToggle.addEventListener("click", () => {
    cartContainer.classList.add("hidden");
  });

  // Order via WhatsApp
  orderButton.addEventListener("click", sendWhatsAppOrder);
  if (navOrderButton)
    navOrderButton.addEventListener("click", sendWhatsAppOrder);
}

function showOrderModal(
  name,
  priceLocal,
  priceDelivery,
  deliveryUnavailable = false
) {
  const modal = document.createElement("div");
  modal.className = "order-modal";

  let deliveryButtonHTML = "";
  if (deliveryUnavailable) {
    deliveryButtonHTML = `
      <button class="option-btn" style="background: #dc3545; cursor: not-allowed;" disabled>
        ❌ Este producto solo está disponible en el local
      </button>
    `;
  } else {
    deliveryButtonHTML = `
      <button class="option-btn" onclick="orderViaRappi('${name}')">
        🚚 Pedir por Rappi - $${priceDelivery.toFixed(2)}
      </button>
    `;
  }

  modal.innerHTML = `
    <div class="modal-content">
      <h3>¿Cómo quieres pedir?</h3>
      <div class="order-options">
        <button class="option-btn" onclick="showQuantityModal('${name}', ${priceLocal}, 'local')">
          🏪 Comer en local - $${priceLocal.toFixed(2)}
          <small>Hacer pedido por WhatsApp</small>
        </button>
        ${deliveryButtonHTML}
      </div>
      <button class="close-modal" onclick="closeModal()">Cancelar</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function addToCart(name, price, type) {
  const existingItem = cart.find(
    (item) => item.name === name && item.type === type
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      type: type,
      quantity: 1,
    });
  }

  updateCartDisplay();
  closeModal();
  document.getElementById("cart-button").classList.remove("hidden");
}

function orderViaRappi(itemName) {
  closeModal();

  // Redirigir directamente a la página de Casa Sonora en Rappi
  const casaSonoraRappiURL =
    "https://www.rappi.com.mx/restaurantes/900002503-casa-sonora-restaurant";

  // Mostrar mensaje breve antes de redirigir
  const rappiModal = document.createElement("div");
  rappiModal.className = "order-modal";
  rappiModal.innerHTML = `
    <div class="modal-content">
      <h3>🚚 Redirigiendo a Rappi</h3>
      <p>Serás llevado a la página de <strong>Casa Sonora</strong> en Rappi</p>
      <p>Producto seleccionado: <strong>${itemName}</strong></p>
      <div class="order-options">
        <button class="option-btn" onclick="openCasaSonoraRappi()" style="background: #FF8000;">
          🌐 Ir a Casa Sonora en Rappi
        </button>
      </div>
      <button class="close-modal" onclick="closeModal()">Cancelar</button>
    </div>
  `;
  document.body.appendChild(rappiModal);
}

function showQuantityModal(itemName, price, type) {
  closeModal(); // Cerrar el modal anterior

  const modal = document.createElement("div");
  modal.className = "order-modal";
  modal.id = "quantityModal";

  modal.innerHTML = `
    <div class="modal-content">
      <h3>${itemName}</h3>
      <p>Precio: $${price.toFixed(2)}</p>
      <div class="quantity-selector">
        <label for="quantity">Cantidad:</label>
        <div class="quantity-controls">
          <button type="button" class="quantity-btn" onclick="decreaseQuantity()">-</button>
          <input type="number" id="quantity" value="1" min="1" max="20">
          <button type="button" class="quantity-btn" onclick="increaseQuantity()">+</button>
        </div>
      </div>
      <div class="total-price">
        <strong>Total: $<span id="totalPrice">${price.toFixed(
          2
        )}</span></strong>
      </div>
      <div class="modal-buttons">
        <button class="option-btn" onclick="addToCartWithQuantity('${itemName}', ${price}, '${type}')">
          Agregar al carrito
        </button>
        <button class="close-modal" onclick="closeModal()">Cancelar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function increaseQuantity() {
  const quantityInput = document.getElementById("quantity");
  const totalPriceSpan = document.getElementById("totalPrice");
  const currentQuantity = parseInt(quantityInput.value);
  const newQuantity = Math.min(currentQuantity + 1, 20);
  quantityInput.value = newQuantity;

  // Calcular nuevo total
  const pricePerUnit = parseFloat(totalPriceSpan.textContent) / currentQuantity;
  const newTotal = pricePerUnit * newQuantity;
  totalPriceSpan.textContent = newTotal.toFixed(2);
}

function decreaseQuantity() {
  const quantityInput = document.getElementById("quantity");
  const totalPriceSpan = document.getElementById("totalPrice");
  const currentQuantity = parseInt(quantityInput.value);
  const newQuantity = Math.max(currentQuantity - 1, 1);
  quantityInput.value = newQuantity;

  // Calcular nuevo total
  const pricePerUnit = parseFloat(totalPriceSpan.textContent) / currentQuantity;
  const newTotal = pricePerUnit * newQuantity;
  totalPriceSpan.textContent = newTotal.toFixed(2);
}

function addToCartWithQuantity(name, price, type) {
  const quantity = parseInt(document.getElementById("quantity").value);

  const existingItem = cart.find(
    (item) => item.name === name && item.type === type
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      name: name,
      price: price,
      type: type,
      quantity: quantity,
    });
  }

  updateCartDisplay();
  closeModal();
  document.getElementById("cart-button").classList.remove("hidden");
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
  if (cart.length === 0) {
    document.getElementById("cart-button").classList.add("hidden");
    document.getElementById("cart-container").classList.add("hidden");
  }
}

function updateQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    removeFromCart(index);
  } else {
    updateCartDisplay();
  }
}

function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartFloatCount = document.getElementById("cart-float-count");
  const cartTotal = document.getElementById("cart-total");

  // Navbar elements
  const navCartCount = document.getElementById("nav-cart-count");
  const navCartItems = document.getElementById("nav-cart-items");
  const navCartTotal = document.getElementById("nav-cart-total");

  // Clear current items
  cartItems.innerHTML = "";
  if (navCartItems) navCartItems.innerHTML = "";

  let total = 0;
  let totalItems = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    totalItems += item.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-type">${
          item.type === "local" ? "🏪 Local" : "🚚 Delivery"
        } - $${item.price.toFixed(2)}</div>
      </div>
      <div class="cart-item-controls">
        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
        <button class="quantity-btn" onclick="removeFromCart(${index})" style="background: #dc3545; margin-left: 0.5rem;">×</button>
      </div>
    `;
    cartItems.appendChild(cartItem);

    // Add to navbar dropdown if exists
    if (navCartItems) {
      const navCartItem = cartItem.cloneNode(true);
      navCartItems.appendChild(navCartItem);
    }
  });

  cartCount.textContent = totalItems;
  cartFloatCount.textContent = totalItems;
  cartTotal.textContent = total.toFixed(2);

  // Update navbar
  if (navCartCount) navCartCount.textContent = totalItems;
  if (navCartTotal) navCartTotal.textContent = total.toFixed(2);
}

function sendWhatsAppOrder() {
  if (cart.length === 0) return;

  let message = "*** PEDIDO CASA SONORA ***\n";
  message += "** PARA COMER EN EL LOCAL **\n\n";
  let total = 0;

  // Solo procesar items locales (los de Rappi van directo a la app)
  const localItems = cart.filter((item) => item.type === "local");

  if (localItems.length === 0) {
    alert("No hay productos en el carrito para pedido local");
    return;
  }

  localItems.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    message += `- ${item.name} x${item.quantity} - $${itemTotal.toFixed(2)}\n`;
    total += itemTotal;
  });

  message += `\nTOTAL: $${total.toFixed(2)}\n\n`;
  message += "Por favor confirma mi pedido";

  const phoneNumber = "5215637564800"; // Reemplaza con tu número
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  window.open(whatsappURL, "_blank");
}

function closeModal() {
  const modal = document.querySelector(".order-modal");
  if (modal) {
    modal.remove();
  }
}

function openCasaSonoraRappi() {
  // URL directa a Casa Sonora en Rappi (reemplaza con la URL real de tu restaurante)
  const casaSonoraRappiURL =
    "https://www.rappi.com.mx/restaurantes/900002503-casa-sonora-restaurant";

  // Abre la página de Casa Sonora en Rappi
  window.open(casaSonoraRappiURL, "_blank");
  closeModal();
}

// Initialize cart when page loads
document.addEventListener("DOMContentLoaded", initCart);
