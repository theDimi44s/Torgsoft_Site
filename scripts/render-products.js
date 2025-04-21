// Змінна для зберігання продуктів
let parsedProducts = [];

// Завантаження продуктів з JSON
async function loadProducts() {
  try {
    const response = await fetch('../parser/parse_output/products.json');
    parsedProducts = await response.json();

    // Рендеримо лише для секцій "Новеньке" і "Цікавеньке"
    displayFeaturedProducts(parsedProducts, 'new', 'featured-new');
    displayFeaturedProducts(parsedProducts, 'int', 'featured-interesting');
    // Прибрали рендеринг для 'main-product-list', це робитиме budget-filter.js
  } catch (error) {
    console.error('Помилка при завантаженні JSON:', error);
  }
}

// Рендер продуктів з кнопкою "У кошик"
function displayFeaturedProducts(products, targetTag, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Контейнер ${containerId} не знайдено.`);
    return;
  }

  let filtered = products;
  if (targetTag !== 'all') {
    filtered = products.filter(product =>
      product.tags && product.tags.includes(targetTag)
    );
  } else {
    filtered = products.filter(product =>
      product.tags && product.tags.includes('all')
    );
  }

  console.log(`Рендеринг для ${containerId}, товари:`, filtered);

  if (filtered.length === 0) {
    container.innerHTML = '<p>Товарів не знайдено.</p>';
    return;
  }

  container.innerHTML = `
    <div class="row row-cols-1 row-cols-md-3 g-4">
      ${filtered.map(product => `
        <div class="col">
          <div class="card h-100">
            <img src="${product.image || 'placeholder.jpg'}" class="card-img-top" alt="${product.short_name}">
            <div class="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 class="card-title">${product.short_name}</h5>
                ${product.discount_price && product.discount_price !== product.price ? `
                  <p class="card-text">
                    <span style="text-decoration: line-through; color: grey;">${product.price} грн</span>
                    <span style="color: red;">${product.display_price} грн</span>
                  </p>
                ` : `
                  <p class="card-text">${product.display_price} грн</p>
                `}
                <p class="card-text stock-status">
                <span style="font-weight: bolder;">${product.stock_status}</span></p>
              </div>
            </div>
            <div class="card-footer bg-transparent border-0">
              <button class="btn btn-outline-primary btn-sm add-to-cart" 
                      data-id="${product.id || product.sku}" 
                      data-name="${product.short_name}" 
                      data-price="${product.display_price}">
                У кошик
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  console.log(`HTML-вміст ${containerId}:`, container.innerHTML);
}

// Кнопки фільтрації
function setupFilterButtons() {
  const buttons = document.querySelectorAll('.btn-filter');
  const sections = {
    new: document.getElementById('featured-new'),
    interesting: document.getElementById('featured-interesting')
  };

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      for (const key in sections) {
        sections[key].style.display = (key === category) ? 'block' : 'none';
      }

      buttons.forEach(btn => btn.classList.remove('btn-primary'));
      buttons.forEach(btn => btn.classList.add('btn-secondary'));
      button.classList.remove('btn-secondary');
      button.classList.add('btn-primary');
    });
  });

  document.querySelector('.btn-filter[data-category="new"]').click();
}

// Ініціалізація при завантаженні
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  setupFilterButtons();
});

// Експортуємо функції та змінні
export { parsedProducts, displayFeaturedProducts };