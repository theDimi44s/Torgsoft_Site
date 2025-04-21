document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const images = document.querySelectorAll('.slider-img');
    let currentIndex = 0;
    let autoSlideInterval;
  
    // Функція для показу зображення за індексом
    const showImage = (index) => {
      images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
      });
      currentIndex = index;
    };
  
    // Функція для автоматичного перемикання
    const startAutoSlide = () => {
      autoSlideInterval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % images.length;
        showImage(nextIndex);
      }, 6000); // 6 секунд інтервал між слайдами
    };
  
    // Зупинка автоперемикання
    const stopAutoSlide = () => {
      clearInterval(autoSlideInterval);
    };
  
    // Перемикання вручну при кліку
    slider.addEventListener('click', (e) => {
      const rect = slider.getBoundingClientRect();
      const clickX = e.clientX - rect.left; // Позиція кліку відносно лівого краю слайдера
      const sliderWidth = rect.width;
  
      if (clickX < sliderWidth / 2) {
        // Клік на лівій половині — попереднє зображення
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(prevIndex);
      } else {
        // Клік на правій половині — наступне зображення
        const nextIndex = (currentIndex + 1) % images.length;
        showImage(nextIndex);
      }
  
      // Зупиняємо автоперемикання після ручного перемикання
      stopAutoSlide();
      startAutoSlide(); // Перезапускаємо автоперемикання
    });
  
    // Зупиняємо автоперемикання при наведенні
    slider.addEventListener('mouseenter', stopAutoSlide);
  
    // Відновлюємо автоперемикання після відведення курсору
    slider.addEventListener('mouseleave', startAutoSlide);
  
    // Показуємо перше зображення і запускаємо автоперемикання
    showImage(0);
    startAutoSlide();
  });