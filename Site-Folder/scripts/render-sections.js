// Імпорт даних з render-products.js
import { parsedProducts } from './render-products.js';

// Подія на "В кошик" (залишаємо для модального вікна, якщо воно потрібне)
document.addEventListener('click', function (e) {
  if (e.target && e.target.classList.contains('add-to-cart')) {
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    if (cartModal) cartModal.show();
  }
});