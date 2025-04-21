document.addEventListener('DOMContentLoaded', () => {
    const popup = document.querySelector('.popup');
    const cartCount = document.querySelector('.cart-count');
    const popupContent = popup.querySelector('.popup-content');
    let isFormValid = false;

    // Ініціалізація корзини в localStorage
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Оновлення лічильника корзини
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount.textContent = cart.length;
    }

    // Обчислення загальної суми
    function calculateTotal(cart) {
        return cart.reduce((sum, item) => sum + parseFloat(item.price.replace(/[^0-9.]/g, '') || 0) * (item.quantity || 1), 0);
    }

    // Об’єднання однакових товарів
    function consolidateCartItems(cart) {
        const consolidated = [];
        cart.forEach(item => {
            const existing = consolidated.find(i => i.id === item.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                consolidated.push({ ...item, quantity: 1 });
            }
        });
        return consolidated;
    }

    // Розгортання товарів для збереження в localStorage
    function flattenCartItems(uniqueItems) {
        const flatItems = [];
        uniqueItems.forEach(item => {
            for (let i = 0; i < item.quantity; i++) {
                flatItems.push({ id: item.id, name: item.name, price: item.price, image: item.image });
            }
        });
        return flatItems;
    }

    // Додавання товару до корзини
    function addToCart(product) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // Оновлення кількості товару
    function updateQuantity(index, change, inputValue = null) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const uniqueItems = consolidateCartItems(cart);
        if (inputValue !== null) {
            const newQuantity = parseInt(inputValue) || 1;
            uniqueItems[index].quantity = newQuantity < 1 ? 1 : newQuantity;
        } else {
            uniqueItems[index].quantity += change;
            if (uniqueItems[index].quantity < 1) uniqueItems[index].quantity = 1;
        }
        localStorage.setItem('cart', JSON.stringify(flattenCartItems(uniqueItems)));
        renderCartItems();
    }

    // Підтвердження видалення товару
    function confirmRemoveItem(index) {
        const modal = document.createElement('div');
        modal.className = 'modal-confirm';
        modal.innerHTML = `
            <div class="modal-content">
                <p>Ви дійсно бажаєте видалити товар?</p>
                <div class="modal-buttons">
                    <button class="btn modal-no">Ні</button>
                    <button class="btn modal-yes">Так</button>
                </div>
            </div>
        `;
        popupContent.appendChild(modal);

        modal.querySelector('.modal-no').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-yes').addEventListener('click', () => {
            removeItem(index);
            modal.remove();
        });
    }

    // Видалення товару
    function removeItem(index) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const uniqueItems = consolidateCartItems(cart);
        uniqueItems.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(flattenCartItems(uniqueItems)));
        renderCartItems();
    }

    // Рендеринг загальної суми над списком товарів
    function renderTotalAbove(cart) {
        let totalAbove = popupContent.querySelector('#total-above');
        if (!totalAbove) {
            totalAbove = document.createElement('div');
            totalAbove.id = 'total-above';
            totalAbove.className = 'total-amount mb-3';
            const cartItems = popupContent.querySelector('.cart-items');
            if (cartItems) {
                cartItems.parentNode.insertBefore(totalAbove, cartItems.nextSibling);
            }
        }
        totalAbove.innerHTML = `<strong>Загальна сума: ${calculateTotal(cart).toFixed(2)} грн</strong>`;
    }

    // Рендеринг вмісту попапу
    function renderCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const uniqueItems = consolidateCartItems(cart);
        popupContent.innerHTML = '';

        if (uniqueItems.length === 0) {
            popupContent.innerHTML = `
                <span class="close-popup">×</span>
                <h2>Ваша корзина порожня</h2>
                <div class="popup-buttons">
                    <button class="btn btn-secondary continue-shopping">Продовжити покупки</button>
                </div>
            `;
            updateCartCount();
            popupContent.querySelector('.continue-shopping')?.addEventListener('click', () => popup.style.display = 'none');
            return;
        }

        const itemsHTML = uniqueItems.map((item, index) => `
            <div class="cart-item d-flex align-items-center" style="margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">
                <img src="${item.image || 'placeholder.jpg'}" alt="${item.name}" style="width: 60px; height: 80px; object-fit: cover; margin-right: 15px;">
                <div class="flex-grow-1">
                    <strong>${item.name}</strong><br/>
                    <span>Ціна: ${parseFloat(item.price).toFixed(2)} грн</span>
                </div>
                <div class="d-flex align-items-center">
                    <div class="input-group input-group-sm" style="width: 80px;">
                        <button class="btn quantity-btn minus-btn" type="button" data-index="${index}">-</button>
                        <input type="text" class="form-control quantity-input" value="${item.quantity}" data-index="${index}">
                        <button class="btn quantity-btn plus-btn" type="button" data-index="${index}">+</button>
                    </div>
                    <button class="btn btn-danger remove-btn ms-2" data-index="${index}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Форма замовлення
        popupContent.innerHTML = `
            <span class="close-popup">×</span>
            <h2>Ваші товари (${uniqueItems.length})</h2>
            <div class="cart-items">${itemsHTML}</div>
            <div class="order-form">
                <div class="form-group">
                    <small class="text-muted-main">ПІБ одержувача</small>
                    <input type="text" class="form-control" id="fullName" placeholder="Шевченко Дмитро Ігорович">
                    <small class="text-muted">Обов’язково для заповнення*</small>
                </div>
                <div class="form-group">
                    <small class="text-muted-main">Контактний номер</small>
                    <input type="tel" class="form-control" id="phone" placeholder="+380 (XX) (XXXXXXX)">
                    <small class="text-muted">За цим номером ми зв’яжемось</small>
                </div>
                <div class="form-group">
                    <input type="email" class="form-control" id="email" placeholder="mail@post.com">
                    <small class="text-muted">Сюди ми відправимо копію твого замовлення та чек при онлайн-оплаті</small>
                </div>
                <div class="form-group">
                    <label>Спосіб доставки</label>
                    <div>
                        <label><input type="radio" name="delivery" value="nova-poshta-office" checked> Нова пошта (Відділення)</label>
                        <label><input type="radio" name="delivery" value="nova-poshta-address"> Нова пошта (Адресна доставка)</label><br/>
                        <label><input type="radio" name="delivery" value="self-pickup"> Самовивіз</label>
                    </div>
                    <div id="delivery-details" style="margin-top: 10px;">
                        <input type="text" class="form-control" id="city" placeholder="Харків" style="margin-bottom: 5px;">
                        <small class="text-muted">Обов’язково для заповнення*</small>
                        <input type="text" class="form-control" id="office" placeholder="28">
                    </div>
                </div>
                <div class="form-group">
                    <label>Як з вами зв’язатися?</label>
                    <div>
                        <label><input type="radio" name="contact" value="no-contact" checked> Не зв’язуватись</label><br/>
                        <label><input type="radio" name="contact" value="telegram-viber"> Telegram/Viber</label>
                    </div>
                    <input type="text" class="form-control" id="contact-username" placeholder="@" style="margin-top: 5px;" disabled>
                    <small class="text-muted">Обов’язково для заповнення при виборі Telegram/Viber</small>
                </div>
                <div class="form-group">
                    <label>Коментар</label>
                    <textarea class="form-control" id="comment" rows="3" placeholder="Введіть коментар"></textarea>
                </div>
                <div class="form-group">
                    <label>Промокод</label>
                    <input type="text" class="form-control" id="promo" placeholder="Введіть промокод">
                    <div class="form-check mt-2">
                        <input type="checkbox" class "form-check-input" id="terms">
                        <label class="form-check-label" for="terms">З умовами доставки та оплати ознайомлений(-а)</label>
                    </div>
                </div>
                <div class="form-group">
                    <label>Спосіб оплати</label>
                    <div>
                        <label><input type="radio" name="payment" value="online" checked> Онлайн оплата Visa, Mastercard, Apple Pay, Google Pay</label>
                        <label><input type="radio" name="payment" value="cashless"> Безготівкова оплата за реквізитами</label>
                        <label><input type="radio" name="payment" value="cod"> Післяплата (Нова пошта)</label>
                    </div>
                </div>
                <div class="total-amount text-right mt-3">
                    <strong>Загальна сума: ${calculateTotal(uniqueItems).toFixed(2)} грн</strong>
                </div>
                <div class="popup-buttons">
                    <button class="btn btn-primary" id="submit-order" disabled>Оформити замовлення</button>
                    <button class="btn btn-secondary continue-shopping">Продовжити покупки</button>
                </div>
            </div>
        `;

        // Додаємо обробники подій для кнопок кількості та видалення
        popupContent.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                updateQuantity(index, -1);
            });
        });

        popupContent.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                updateQuantity(index, 1);
            });
        });

        popupContent.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', () => {
                const index = parseInt(input.dataset.index);
                updateQuantity(index, 0, input.value);
            });
        });

        popupContent.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                confirmRemoveItem(index);
            });
        });

        renderTotalAbove(uniqueItems);

        // Динамічна зміна полів доставки
        const deliveryRadios = popupContent.querySelectorAll('input[name="delivery"]');
        const paymentRadios = popupContent.querySelectorAll('input[name="payment"]');
        const deliveryDetails = popupContent.querySelector('#delivery-details');
        const officeInput = popupContent.querySelector('#office');
        const contactRadios = popupContent.querySelectorAll('input[name="contact"]');
        const contactUsername = popupContent.querySelector('#contact-username');

        deliveryRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'nova-poshta-office') {
                    deliveryDetails.style.display = 'block';
                    officeInput.placeholder = '28';
                    officeInput.value = '';
                    officeInput.disabled = false;
                    paymentRadios.forEach(p => {
                        p.disabled = p.value === 'cod' && radio.value !== 'nova-poshta-office';
                    });
                } else if (radio.value === 'nova-poshta-address') {
                    deliveryDetails.style.display = 'block';
                    officeInput.placeholder = 'просп. Тракторобудівників, 89б';
                    officeInput.value = '';
                    officeInput.disabled = false;
                    paymentRadios.forEach(p => {
                        p.disabled = p.value === 'cod';
                    });
                } else {
                    deliveryDetails.style.display = 'none';
                    officeInput.disabled = true;
                    paymentRadios.forEach(p => {
                        p.disabled = false;
                    });
                }
            });
        });

        // Обробка поля Telegram/Viber
        contactRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                contactUsername.disabled = radio.value !== 'telegram-viber';
                contactUsername.value = radio.value === 'telegram-viber' ? contactUsername.value : '';
                if (radio.value === 'telegram-viber') {
                    contactUsername.focus();
                }
            });
        });

        // Валідатор форми
        function validateForm() {
            const fullName = popupContent.querySelector('#fullName').value.trim();
            const phone = popupContent.querySelector('#phone').value.trim();
            const terms = popupContent.querySelector('#terms').checked;
            const submitButton = popupContent.querySelector('#submit-order');
            isFormValid = fullName && phone && terms;
            submitButton.disabled = !isFormValid;
        }

        // Генерація PurchaseClient.json
        function generatePurchaseClientJson() {
            const fullName = popupContent.querySelector('#fullName').value.trim();
            const phone = popupContent.querySelector('#phone').value.trim();
            const email = popupContent.querySelector('#email').value.trim();
            const deliveryMethod = popupContent.querySelector('input[name="delivery"]:checked').value;
            const city = popupContent.querySelector('#city').value.trim();
            const office = popupContent.querySelector('#office').value.trim();
            const contactMethod = popupContent.querySelector('input[name="contact"]:checked').value;
            const contactUsername = popupContent.querySelector('#contact-username').value.trim();
            const comment = popupContent.querySelector('#comment').value.trim();
            const promo = popupContent.querySelector('#promo').value.trim();
            const paymentMethod = popupContent.querySelector('input[name="payment"]:checked').value;

            let deliveryAddress = '';
            if (deliveryMethod === 'nova-poshta-office') {
                deliveryAddress = city && office ? `${city}, Відділення №${office}` : '';
            } else if (deliveryMethod === 'nova-poshta-address') {
                deliveryAddress = office;
            } else if (deliveryMethod === 'self-pickup') {
                deliveryAddress = 'Самовивіз';
            }

            const orderData = {
                Client: {
                    Name: fullName,
                    MPhone: phone.replace(/[^0-9]/g, ''),
                    CPhone: '',
                    ZIP: '',
                    Country: 'Україна',
                    Region: city ? `${city}ська` : '',
                    Місто: city,
                    Address: deliveryMethod === 'nova-poshta-address' ? office : '',
                    EMail: email
                },
                Options: {
                    SaleType: '1',
                    Comment: comment || (contactMethod === 'telegram-viber' ? `Telegram/Viber: ${contactUsername}` : ''),
                    OrderNumber: `ORD-${Date.now()}`,
                    DeliveryCondition: deliveryMethod === 'nova-poshta-office' ? 'Нова Пошта (Відділення)' :
                                       deliveryMethod === 'nova-poshta-address' ? 'Нова Пошта (Адресна)' : 'Самовивіз',
                    DeliveryAddress: deliveryAddress,
                    ReserveDate: '',
                    BonusPay: promo ? '0' : '',
                    GiftCertificate: '',
                    OrderDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
                    CurrencyInternationalCode: 'UAH'
                },
                Goods: consolidateCartItems(JSON.parse(localStorage.getItem('cart')) || []).map(item => ({
                    GoodID: item.id || 'unknown',
                    Price: parseFloat(item.price.replace(/[^0-9.]/g, '')).toFixed(2),
                    Count: item.quantity.toString()
                }))
            };

            const blob = new Blob([JSON.stringify(orderData, null, 2)], { type: 'application/json;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'PurchaseClient.json';
            link.click();
            URL.revokeObjectURL(link.href);
        }

        // Ініціалізація обробників форми
        function initializeForm() {
            const formElements = ['fullName', 'phone', 'terms', 'delivery', 'contact', 'city', 'office', 'contact-username'];
            formElements.forEach(id => {
                const element = popupContent.querySelector(`#${id}`);
                if (element) {
                    element.addEventListener('input', validateForm);
                    element.addEventListener('change', validateForm);
                }
            });

            popupContent.querySelector('#submit-order').addEventListener('click', () => {
                if (isFormValid) {
                    generatePurchaseClientJson();
                    localStorage.setItem('cart', JSON.stringify([]));
                    renderCartItems();
                    popup.style.display = 'none';
                }
            });
            validateForm();
        }

        // Додаємо обробники подій
        popupContent.querySelector('.close-popup')?.addEventListener('click', () => popup.style.display = 'none');
        popupContent.querySelector('.continue-shopping')?.addEventListener('click', () => popup.style.display = 'none');
        initializeForm();
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
                price: e.target.dataset.price,
                image: e.target.dataset.image
            };
            addToCart(product);
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