import { displayFeaturedProducts, parsedProducts } from './render-products.js';

document.addEventListener('DOMContentLoaded', () => {
  const budgetOptions = document.querySelectorAll('.budget-option input[name="budget"]');

  // Функція для фільтрації товарів
  const filterProductsByBudget = async (budgetRange) => {
    try {
      // Використовуємо parsedProducts із render-products.js
      let products = parsedProducts;

      // Якщо parsedProducts ще не завантажено, завантажуємо вручну
      if (!products || products.length === 0) {
        console.log('parsedProducts порожній, завантажуємо products.json');
        const response = await fetch('../parser/parse_output/products.json');
        if (!response.ok) {
          throw new Error(`Не вдалося завантажити products.json: ${response.statusText}`);
        }
        products = await response.json();
        console.log('Продукти завантажено вручну:', products);
      } else {
        console.log('Використовуємо parsedProducts:', products);
      }

      // Фільтруємо товари, які є в наявності
      const availableProducts = products.filter(product => product.stock_status === 'Є в наявності');
      console.log('Товари в наявності:', availableProducts);

      let filteredProducts = [];

      if (budgetRange === 'all') {
        // Показуємо всі товари в наявності, незалежно від тегу
        filteredProducts = availableProducts;
      } else if (budgetRange === 'top-10') {
        // Тимчасово сортуємо за ціною (найдорожчі), доки немає sales_count
        filteredProducts = availableProducts
          .sort((a, b) => {
            const priceA = parseFloat(a.price.toString().replace(/[^0-9.]/g, '')) || 0;
            const priceB = parseFloat(b.price.toString().replace(/[^0-9.]/g, '')) || 0;
            return priceB - priceA;
          })
          .slice(0, 10); // Беремо перші 10 найдорожчих
      } else {
        const [min, max] = budgetRange.split('-').map(val => parseInt(val) || Infinity);
        filteredProducts = availableProducts.filter(product => {
          // Очищаємо ціну від усього, крім цифр і крапки
          const price = parseFloat(product.price.toString().replace(/[^0-9.]/g, ''));
          if (isNaN(price)) {
            console.warn(`Некоректна ціна для товару ${product.name}: ${product.price}`);
            return false;
          }
          const result = price >= min && (max ? price <= max : true);
          console.log(`Товар: ${product.name}, Ціна: ${price}, Діапазон: ${min}-${max}, Результат: ${result}`);
          return result;
        });
      }

      // Обмежуємо кількість товарів до 27 (3×9)
      filteredProducts = filteredProducts.slice(0, 27);

      console.log(`Відфільтровані товари для діапазону ${budgetRange}:`, filteredProducts);

      // Рендеримо відфільтровані товари
      displayFeaturedProducts(filteredProducts, 'all', 'main-product-list');
    } catch (error) {
      console.error('Помилка завантаження продуктів:', error);
    }
  };

  // Додаємо обробник подій для кожної радіокнопки
  budgetOptions.forEach(option => {
    option.addEventListener('change', (e) => {
      const selectedBudget = e.target.value;
      console.log('Обраний діапазон:', selectedBudget);
      filterProductsByBudget(selectedBudget);
    });
  });

  // Ініціалізація: фільтруємо за замовчуванням ("Всі товари")
  filterProductsByBudget('all');
});