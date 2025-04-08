// Змінна для зберігання продуктів
let parsedProducts = [];

// Завантаження продуктів з JSON
async function loadProducts() {
  try {
    const response = await fetch('./parser/products.json');
    parsedProducts = await response.json(); // Зберігаємо продукти в змінну

    displayFeaturedProducts(parsedProducts, 'Новеньке', 'featured-new');
    displayFeaturedProducts(parsedProducts, 'Цікавеньке', 'featured-interesting');
    displayFeaturedProducts(parsedProducts, 'all', 'main-product-list');
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
            <img src="${product.image || 'placeholder.jpg'}" class="card-img-top" alt="${product.name}">
            <div class="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.price} грн</p>
                <div class="tags mb-2">
                  ${product.tags?.map(tag => `<span class="badge bg-info text-dark me-1">${tag}</span>`).join('')}
                </div>
              </div>
            </div>
            <div class="card-footer bg-transparent border-0">
              <button class="btn btn-outline-primary btn-sm add-to-cart" 
                      data-id="${product.id || product.sku}" 
                      data-name="${product.name}" 
                      data-price="${product.price}">
                У кошик
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Додаємо логування HTML-вмісту
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

// Експортуємо parsedProducts
export { parsedProducts };