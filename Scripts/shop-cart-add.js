// Простий кошик з localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(productId, productName) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, name: productName, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`Товар "${productName}" додано до кошика!`);
}

// Приклад додавання до кнопок: <button onclick="addToCart('hp123', 'Гаррі Поттер бокс')">У кошик</button>
