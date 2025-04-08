document.addEventListener('DOMContentLoaded', () => {
    const popup = document.querySelector('.popup');
    const cartCount = document.querySelector('.cart-count');
    const popupContent = popup.querySelector('.popup-content');

    // Ініціалізація корзини в localStorage
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Оновлення лічильника корзини
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount.textContent = cart.length;
    }

    // Додавання товару до корзини
    function addToCart(product) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // Рендеринг вмісту попапу
    function renderCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        popupContent.innerHTML = '';

        if (cart.length === 0) {
            popupContent.innerHTML = `
                <span class="close-popup">×</span>
                <h2>Ваша корзина пуста</h2>
                <div class="popup-buttons">
                    <button class="btn btn-secondary continue-shopping">Продовжити покупки</button>
                </div>
            `;
        } else {
            const itemsHTML = cart.map((item, index) => `
                <div class="cart-item" style="margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">
                    <strong>${item.name}</strong><br/>
                    <span>Ціна: ${item.price} грн</span><br/>
                    <button class="btn btn-sm btn-danger remove-item" data-index="${index}">Видалити</button>
                </div>
            `).join('');

            popupContent.innerHTML = `
                <span class="close-popup">×</span>
                <h2>Ваші товари (${cart.length})</h2>
                <div class="cart-items">${itemsHTML}</div>
                <div class="popup-buttons">
                    <a href="order.html" class="btn btn-primary">Оформити замовлення</a>
                    <button class="btn btn-secondary continue-shopping">Продовжити покупки</button>
                </div>
            `;
        }

        // Додаємо обробники подій
        popupContent.querySelector('.close-popup')?.addEventListener('click', () => popup.style.display = 'none');
        popupContent.querySelector('.continue-shopping')?.addEventListener('click', () => popup.style.display = 'none');

        popupContent.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                renderCartItems();
            });
        });
    }

    // Показ попапу
    function showPopup() {
        renderCartItems();
        popup.style.display = 'flex';
    }

    // Обробник для іконки корзини
    document.querySelector('.fa-shopping-cart')?.addEventListener('click', (e) => {
        e.preventDefault();
        showPopup();
    });

    // Обробник для кнопок "У кошик"
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const product = {
                id: e.target.dataset.id,
                name: e.target.dataset.name,
                price: e.target.dataset.price
            };
            addToCart(product);
            // Можна додати сповіщення чи показати попап після додавання
            alert(`${product.name} додано до корзини!`);
        }
    });

    // Закриття попапу при кліку поза ним
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
        }
    });

    // Початкове оновлення лічильника
    updateCartCount();
});