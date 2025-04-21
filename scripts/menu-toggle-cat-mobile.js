document.addEventListener('DOMContentLoaded', () => {
    const categoryToggle = document.querySelector('.category-toggle');
    const categoryDropdown = document.querySelector('.category-dropdown');
    const categoryMenu = document.querySelector('.category-menu');
  
    // Перевіряємо ширину екрана
    const isMobile = () => window.innerWidth <= 768;
  
    // Логування для діагностики
    console.log('Script loaded. isMobile:', isMobile());
    console.log('Elements found:', { categoryToggle, categoryDropdown, categoryMenu });
  
    // Додаємо обробник кліку для мобільних
    categoryToggle.addEventListener('click', (e) => {
      if (isMobile()) {
        e.preventDefault();
        categoryMenu.classList.toggle('active');
        console.log('Mobile click: Toggled active class. Menu state:', categoryMenu.classList.contains('active'));
      }
    });
  
    // Додаємо обробник наведення для десктопу
    const addDesktopHandlers = () => {
      categoryDropdown.addEventListener('mouseenter', () => {
        console.log('Mouseenter: Adding active class');
        categoryMenu.classList.add('active');
      });
  
      categoryDropdown.addEventListener('mouseleave', () => {
        console.log('Mouseleave: Removing active class');
        categoryMenu.classList.remove('active');
      });
    };
  
    // Ініціалізація обробників для десктопу
    if (!isMobile()) {
      console.log('Desktop mode: Adding mouse event handlers');
      addDesktopHandlers();
    }
  
    // Закриття меню при кліку поза ним (тільки для мобільних)
    document.addEventListener('click', (e) => {
      if (isMobile() && !categoryToggle.contains(e.target) && !categoryMenu.contains(e.target)) {
        categoryMenu.classList.remove('active');
        console.log('Mobile click outside: Removed active class');
      }
    });
  
    // Оновлення поведінки при зміні розміру вікна
    window.addEventListener('resize', () => {
      console.log('Window resized. isMobile:', isMobile());
      if (!isMobile()) {
        categoryMenu.classList.remove('active'); // Скидаємо .active на десктопах
        console.log('Desktop mode: Adding mouse event handlers on resize');
        addDesktopHandlers();
      } else {
        console.log('Mobile mode: Removing active class');
        categoryMenu.classList.remove('active');
      }
    });
  });