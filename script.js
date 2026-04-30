// PRODUCT DATABASE
const productsDB = [
    { id: 1, name: "Tecno Spark 10C", category: "smartphones", price: 12999, oldPrice: 15999, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop", rating: 4.5, stock: 12, description: "6.6” HD+, 50MP camera, 5000mAh battery. The perfect budget smartphone for everyday use." },
    { id: 2, name: "Oraimo FreePods", category: "audio", price: 2499, oldPrice: 3999, image: "https://images.unsplash.com/photo-1606220588913-b3aac6d096f1?w=300&h=300&fit=crop", rating: 4.7, stock: 35, description: "Wireless earbuds with 20h playtime, deep bass, and crystal clear calls." },
    { id: 3, name: "Xiaomi Band 7", category: "wearables", price: 3999, oldPrice: 5999, image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop", rating: 4.3, stock: 8, description: "AMOLED display, heart rate monitor, SpO2 tracking, 14-day battery life." },
    { id: 4, name: "Anker Power Bank", category: "gadgets", price: 3499, oldPrice: 4999, image: "https://images.unsplash.com/photo-1609092567355-3e0d7fef8c3c?w=300&h=300&fit=crop", rating: 4.8, stock: 20, description: "20000mAh, dual USB fast charging, compact and travel friendly." },
    { id: 5, name: "Itel A60", category: "smartphones", price: 8999, oldPrice: 11999, image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300&h=300&fit=crop", rating: 4.2, stock: 5, description: "6.6” display, 5000mAh battery, dual camera - unbeatable budget king." },
    { id: 6, name: "Bentre Buds Pro", category: "audio", price: 1899, oldPrice: 2999, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a877?w=300&h=300&fit=crop", rating: 4.0, stock: 40, description: "Deep bass, IPX5 waterproof, 24h battery with charging case." },
    { id: 7, name: "Smart Watch Ultra", category: "wearables", price: 5499, oldPrice: 7999, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop", rating: 4.4, stock: 15, description: "1.9" display, Bluetooth calling, fitness tracker, IP68 waterproof." },
    { id: 8, name: "USB Fast Charger", category: "gadgets", price: 999, oldPrice: 1499, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&h=300&fit=crop", rating: 4.6, stock: 50, description: "20W fast charger, compatible with all devices, safety certified." }
];

// CART MANAGEMENT
let cart = JSON.parse(localStorage.getItem('bentreCart')) || [];

function saveCart() {
    localStorage.setItem('bentreCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountSpans = document.querySelectorAll('#cartCount');
    cartCountSpans.forEach(span => { if(span) span.innerText = count; });
}

function addToCart(productId, quantity = 1) {
    const product = productsDB.find(p => p.id == productId);
    if(!product) return;
    const existing = cart.find(item => item.id == productId);
    if(existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: quantity, image: product.image });
    }
    saveCart();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    saveCart();
    if(window.location.pathname.includes('cart.html')) renderCartPage();
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id == productId);
    if(item) {
        item.quantity += delta;
        if(item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            if(window.location.pathname.includes('cart.html')) renderCartPage();
        }
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// RENDER FUNCTIONS
function renderProducts(containerId, products = productsDB) {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/300x300?text=Product'">
            <div class="product-title">${p.name}</div>
            <div class="price">Ksh ${p.price.toLocaleString()} <span class="old-price">Ksh ${p.oldPrice.toLocaleString()}</span></div>
            <div class="rating"><i class="fas fa-star"></i> ${p.rating}</div>
            <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(parseInt(btn.dataset.id));
        });
    });
}

function renderCartPage() {
    const container = document.getElementById('cartItemsContainer');
    const summary = document.getElementById('cartSummary');
    const emptyMsg = document.getElementById('emptyCartMsg');
    
    if(!container) return;
    
    if(cart.length === 0) {
        if(emptyMsg) emptyMsg.style.display = 'block';
        if(summary) summary.style.display = 'none';
        if(container) container.innerHTML = '';
        return;
    }
    
    if(emptyMsg) emptyMsg.style.display = 'none';
    if(summary) summary.style.display = 'block';
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div><strong>${item.name}</strong><br>Ksh ${item.price.toLocaleString()}</div>
            <div>
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span style="margin:0 10px;">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})" style="background:#e63946; margin-left:10px;">Remove</button>
            </div>
            <div><strong>Ksh ${(item.price * item.quantity).toLocaleString()}</strong></div>
        </div>
    `).join('');
    
    const subtotal = getCartTotal();
    const delivery = subtotal > 2000 ? 0 : 150;
    const total = subtotal + delivery;
    
    document.getElementById('cartSubtotal').innerText = `Ksh ${subtotal.toLocaleString()}`;
    document.getElementById('deliveryFee').innerText = delivery === 0 ? 'Free' : `Ksh ${delivery}`;
    document.getElementById('cartTotal').innerText = `Ksh ${total.toLocaleString()}`;
}

function renderCheckoutSummary() {
    const itemsContainer = document.getElementById('checkoutItems');
    const subtotalSpan = document.getElementById('checkoutSubtotal');
    const deliverySpan = document.getElementById('checkoutDelivery');
    const totalSpan = document.getElementById('checkoutTotal');
    
    if(!itemsContainer) return;
    
    const subtotal = getCartTotal();
    const delivery = subtotal > 2000 ? 0 : 150;
    const total = subtotal + delivery;
    
    itemsContainer.innerHTML = cart.map(item => `
        <div style="display:flex; justify-content:space-between; padding:5px 0;">
            <span>${item.name} x${item.quantity}</span>
            <span>Ksh ${(item.price * item.quantity).toLocaleString()}</span>
        </div>
    `).join('');
    
    if(subtotalSpan) subtotalSpan.innerText = `Ksh ${subtotal.toLocaleString()}`;
    if(deliverySpan) deliverySpan.innerText = delivery === 0 ? 'Free' : `Ksh ${delivery}`;
    if(totalSpan) totalSpan.innerText = `Ksh ${total.toLocaleString()}`;
}

// PAGE SPECIFIC INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Homepage featured products
    if(document.getElementById('featuredGrid')) {
        renderProducts('featuredGrid', productsDB.slice(0,4));
    }
    
    // Products page
    if(document.getElementById('allProductsGrid')) {
        renderProducts('allProductsGrid', productsDB);
        
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');
        const searchInput = document.getElementById('searchInput');
        
        function filterAndSort() {
            let filtered = [...productsDB];
            const category = categoryFilter?.value;
            const search = searchInput?.value.toLowerCase();
            const sort = sortFilter?.value;
            
            if(category && category !== 'all') {
                filtered = filtered.filter(p => p.category === category);
            }
            if(search) {
                filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
            }
            if(sort === 'priceLow') filtered.sort((a,b) => a.price - b.price);
            if(sort === 'priceHigh') filtered.sort((a,b) => b.price - a.price);
            if(sort === 'rating') filtered.sort((a,b) => b.rating - a.rating);
            
            renderProducts('allProductsGrid', filtered);
            const noResults = document.getElementById('noResults');
            if(noResults) noResults.style.display = filtered.length === 0 ? 'block' : 'none';
        }
        
        categoryFilter?.addEventListener('change', filterAndSort);
        sortFilter?.addEventListener('change', filterAndSort);
        searchInput?.addEventListener('input', filterAndSort);
        
        // URL params from category clicks
        const urlParams = new URLSearchParams(window.location.search);
        const catParam = urlParams.get('category');
        if(catParam && categoryFilter) categoryFilter.value = catParam;
        filterAndSort();
    }
    
    // Cart page
    if(document.getElementById('cartItemsContainer')) {
        renderCartPage();
        const checkoutBtn = document.getElementById('checkoutBtn');
        if(checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if(cart.length > 0) window.location.href = 'checkout.html';
                else alert('Your cart is empty');
            });
        }
    }
    
    // Product detail page
    if(document.getElementById('productDetailContainer')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = productsDB.find(p => p.id === productId) || productsDB[0];
        
        document.getElementById('productImage').src = product.image;
        document.getElementById('productName').innerText = product.name;
        document.getElementById('productRating').innerHTML = `<i class="fas fa-star"></i> ${product.rating} (${Math.floor(product.rating * 20)} reviews)`;
        document.getElementById('productPrice').innerHTML = `Ksh ${product.price.toLocaleString()}`;
        document.getElementById('productOldPrice').innerHTML = `Ksh ${product.oldPrice.toLocaleString()}`;
        document.getElementById('productStock').innerHTML = product.stock > 0 ? `✓ In Stock (${product.stock} left)` : `✗ Out of Stock`;
        document.getElementById('productDescription').innerText = product.description;
        
        let quantity = 1;
        document.getElementById('qtyMinus').onclick = () => { if(quantity > 1) quantity--; document.getElementById('qtyValue').innerText = quantity; };
        document.getElementById('qtyPlus').onclick = () => { if(quantity < product.stock) quantity++; document.getElementById('qtyValue').innerText = quantity; };
        document.getElementById('productAddToCart').onclick = () => { addToCart(product.id, quantity); };
        document.getElementById('buyNowBtn').onclick = () => { addToCart(product.id, quantity); window.location.href = 'checkout.html'; };
        
        // Tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`${tab.dataset.tab}Content`).classList.add('active');
            });
        });
    }
    
    // Checkout page
    if(document.getElementById('checkoutForm')) {
        if(cart.length === 0) window.location.href = 'cart.html';
        renderCheckoutSummary();
        
        document.getElementById('area').addEventListener('change', renderCheckoutSummary);
        
        document.getElementById('checkoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const payment = document.querySelector('input[name="payment"]:checked').value;
            const total = getCartTotal() + (getCartTotal() > 2000 ? 0 : 150);
            
            let paymentMsg = '';
            if(payment === 'mpesa') paymentMsg = `STK Push sent to ${phone}. Complete payment on your phone.`;
            else if(payment === 'card') paymentMsg = 'Redirecting to secure payment gateway...';
            else paymentMsg = 'Order placed! Pay cash on delivery.';
            
            alert(`✅ Order confirmed!\n\nCustomer: ${name}\nAddress: ${address}\nTotal: Ksh ${total.toLocaleString()}\nPayment: ${paymentMsg}\n\nWe'll deliver within 24h in Nairobi.`);
            
            // Clear cart and redirect
            cart = [];
            saveCart();
            window.location.href = 'account.html';
        });
    }
    
    // Account page tabs
    if(document.querySelectorAll('.account-menu li').length) {
        document.querySelectorAll('.account-menu li').forEach(li => {
            li.addEventListener('click', () => {
                document.querySelectorAll('.account-menu li').forEach(l => l.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                li.classList.add('active');
                const tabName = li.dataset.tab;
                document.getElementById(`${tabName}Tab`).classList.add('active');
            });
        });
        
        // Wishlist sample
        if(document.getElementById('wishlistGrid')) {
            document.getElementById('wishlistGrid').innerHTML = `
                <div class="product-card"><img src="${productsDB[0].image}"><div class="product-title">${productsDB[0].name}</div><div class="price">Ksh ${productsDB[0].price}</div><button class="add-to-cart" data-id="${productsDB[0].id}">Move to Cart</button></div>
                <div class="product-card"><img src="${productsDB[2].image}"><div class="product-title">${productsDB[2].name}</div><div class="price">Ksh ${productsDB[2].price}</div><button class="add-to-cart" data-id="${productsDB[2].id}">Move to Cart</button></div>
            `;
            document.querySelectorAll('#wishlistGrid .add-to-cart').forEach(btn => {
                btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
            });
        }
    }
    
    // Category cards navigation
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.dataset.cat;
            window.location.href = `products.html?category=${cat}`;
        });
    });
    
    // Search icon
    const searchIcon = document.getElementById('searchIcon');
    if(searchIcon) {
        searchIcon.addEventListener('click', () => {
            const query = prompt('Search products:', '');
            if(query) window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        });
    }
    
    // Cart icon navigation
    const cartIcon = document.getElementById('cartIcon');
    if(cartIcon) cartIcon.addEventListener('click', () => window.location.href = 'cart.html');
});

function showNotification(msg) {
    const notif = document.createElement('div');
    notif.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#d4af37;color:#000;padding:12px 24px;border-radius:8px;z-index:1000;animation:fadeOut 3s forwards';
    notif.innerText = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// Expose functions for inline onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;