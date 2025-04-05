// Функція для перемикання між вкладками товарів
// Отримати всі вкладки та блоки товарів

const tabs = document.querySelectorAll(".product-tabs button");
const cardsBlocks = document.querySelectorAll(".cards-block");

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    // Зняти клас "active" з усіх вкладок
    tabs.forEach(t => t.classList.remove("active"));
    // Додати активну вкладку
    tab.classList.add("active");

    // Приховати всі блоки товарів
    cardsBlocks.forEach(block => block.style.display = "none");
    // Показати блок товарів, що відповідає вибраній вкладці
    cardsBlocks[index].style.display = "flex";
  });
});