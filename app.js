/* ==========================================================================
0. UTILITIES & SEGURANÇA
========================================================================== */
function safeJSONParse(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (error) { return fallback; }
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ==========================================================================
1. MOCK DATA E GESTÃO DE ESTADO
========================================================================== */
const INITIAL_STORES = [
    { id: 1, name: "Padaria Ria Bakes", type: "bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=60", distance: 0.4, rating: 4.8, originalPrice: 2.50, salePrice: 1.00, pickupTime: "19:30 - 20:30", pickupPeriod: "evening", productName: "3 Pães de Água", isVegan: true, allergens: ["Glúten"], category: "pao", coords: [40.6415, -8.6536] },
    { id: 2, name: "Confeitaria da Praça", type: "bakery", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=60", distance: 1.2, rating: 4.6, originalPrice: 3.50, salePrice: 1.50, pickupTime: "18:00 - 19:00", pickupPeriod: "evening", productName: "1 Croissant Brioche", isVegan: false, allergens: ["Glúten", "Lactose", "Frutos secos"], category: "doce", coords: [40.6400, -8.6550] },
    { id: 3, name: "Massa Mãe - Padaria", type: "bakery", image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&auto=format&fit=crop&q=60", distance: 0.8, rating: 4.9, originalPrice: 4.00, salePrice: 2.00, pickupTime: "10:30 - 12:00", pickupPeriod: "morning", productName: "1 Pão de Centeio Rústico", isVegan: true, allergens: ["Glúten"], category: "pao", coords: [40.6435, -8.6510] },
    { id: 4, name: "O Forno Verde Vegano", type: "pastry", image: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&auto=format&fit=crop&q=60", distance: 2.5, rating: 4.7, originalPrice: 5.50, salePrice: 2.50, pickupTime: "16:00 - 17:30", pickupPeriod: "afternoon", productName: "2 Muffins de Banana", isVegan: true, allergens: ["Glúten", "Frutos secos"], category: "doce", coords: [40.6385, -8.6580] },
    { id: 5, name: "Ovos Moles Gourmet", type: "pastry", image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=60", distance: 1.9, rating: 4.5, originalPrice: 8.00, salePrice: 5.50, pickupTime: "20:00 - 21:00", pickupPeriod: "evening", productName: "4 Ovos Moles de Aveiro", isVegan: false, allergens: ["Lactose"], category: "doce", coords: [40.6405, -8.6530] },
    { id: 6, name: "Pão Quente do Campus", type: "bakery", image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&auto=format&fit=crop&q=60", distance: 0.3, rating: 4.4, originalPrice: 4.50, salePrice: 1.50, pickupTime: "18:30 - 19:30", pickupPeriod: "evening", productName: "Saco Misto (Pão e Lanches)", isVegan: false, allergens: ["Glúten", "Lactose"], category: "misto", coords: [40.6310, -8.6580] },
    { id: 7, name: "Pastelaria Beira-Ria", type: "pastry", image: "https://images.unsplash.com/photo-1514050682283-a41e9d80d293?w=400&auto=format&fit=crop&q=60", distance: 1.5, rating: 4.8, originalPrice: 6.00, salePrice: 2.50, pickupTime: "19:00 - 20:00", pickupPeriod: "evening", productName: "Pack 4 Pastéis de Nata", isVegan: false, allergens: ["Glúten", "Lactose", "Ovo"], category: "doce", coords: [40.6390, -8.6500] },
    { id: 8, name: "A Fornada Central", type: "bakery", image: "https://images.unsplash.com/photo-1534620808146-d33bb39128b2?w=400&auto=format&fit=crop&q=60", distance: 2.1, rating: 4.2, originalPrice: 5.00, salePrice: 2.00, pickupTime: "13:00 - 14:30", pickupPeriod: "afternoon", productName: "Metade de Broa de Milho", isVegan: true, allergens: ["Glúten"], category: "pao", coords: [40.6450, -8.6480] },
    { id: 9, name: "Doçaria de São Gonçalinho", type: "pastry", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop&q=60", distance: 0.9, rating: 4.6, originalPrice: 7.50, salePrice: 3.00, pickupTime: "20:30 - 21:30", pickupPeriod: "evening", productName: "2 Fatias de Bolo Variadas", isVegan: false, allergens: ["Glúten", "Lactose", "Frutos secos"], category: "doce", coords: [40.6440, -8.6540] },
    { id: 10, name: "Padaria da Estação", type: "bakery", image: "https://images.unsplash.com/photo-1574316071802-0d684efa7ab5?w=400&auto=format&fit=crop&q=60", distance: 1.1, rating: 4.9, originalPrice: 3.00, salePrice: 1.00, pickupTime: "08:30 - 09:30", pickupPeriod: "morning", productName: "Sortido de Pães de Trigo", isVegan: true, allergens: ["Glúten"], category: "pao", coords: [40.6430, -8.6400] }
];

const State = {
    stores: INITIAL_STORES,
    cart: safeJSONParse('bb_cart', []),
    orderHistory: safeJSONParse('bb_orders', []),
    isPremium: safeJSONParse('bb_premium', false),
    deliveryMethod: safeJSONParse('bb_delivery', 'pickup'),
    loggedUser: safeJSONParse('bb_user_session', null),
    accounts: safeJSONParse('bb_accounts', []),
    preferences: safeJSONParse('bb_prefs', { notifSurplus: true, notifOrders: true, radius: '5', theme: 'light' }), 
    homeFilters: { quick: 'all' },
    // NOVO: 'category' adicionado corretamente ao objeto inicial
    searchFilters: { query: '', pickupTime: 'any', type: 'any', maxPrice: 'any', category: 'any', vegan: false, glutenFree: false },
    currentView: 'home', 
    activeSubView: 'list', 
    mapInstance: null,
    mapMarkers: [],

    save() {
        localStorage.setItem('bb_cart', JSON.stringify(this.cart));
        localStorage.setItem('bb_orders', JSON.stringify(this.orderHistory));
        localStorage.setItem('bb_premium', JSON.stringify(this.isPremium));
        localStorage.setItem('bb_delivery', JSON.stringify(this.deliveryMethod));
        localStorage.setItem('bb_prefs', JSON.stringify(this.preferences));
        this.renderAll();
    },

    renderAll() {
        renderStoresList();
        renderSearchResults();
        renderCartView();
        renderCartBadge();
        renderHistoryView(); 
        renderSettingsView();
        
        if (this.currentView === 'home' && this.activeSubView === 'map') {
            initOrUpdateMap();
        }
    }
};

/* ==========================================================================
2. SISTEMA DE AUTENTICAÇÃO E REGISTO REAL
========================================================================== */
document.getElementById('go-to-register').addEventListener('click', () => {
    document.getElementById('form-login').classList.add('hidden');
    document.getElementById('form-register').classList.remove('hidden');
});
document.getElementById('go-to-login').addEventListener('click', () => {
    document.getElementById('form-register').classList.add('hidden');
    document.getElementById('form-login').classList.remove('hidden');
});

function performLoginTransition(userObj) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app-container').classList.remove('hidden');
    document.getElementById('user-email-display').innerText = userObj.email;
    document.getElementById('user-name-display').innerText = userObj.name;
    initApp();
}

document.getElementById('btn-register').addEventListener('click', () => {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-pass').value;

    if (name.length < 2 || !email.includes('@') || pass.length < 4) {
        showToast('Por favor, preenche todos os campos corretamente (a password requer mín. 4 caracteres).'); 
        return;
    }

    if (State.accounts.some(a => a.email === email)) {
        showToast('Este email já está associado a uma conta.'); 
        return;
    }

    const newUser = { name, email, pass };
    State.accounts.push(newUser);
    localStorage.setItem('bb_accounts', JSON.stringify(State.accounts));
    
    showToast('Conta criada com sucesso! Bem-vindo(a).');
    localStorage.setItem('bb_user_session', JSON.stringify(newUser));
    State.loggedUser = newUser;
    performLoginTransition(newUser);
});

document.getElementById('btn-login').addEventListener('click', () => {
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value;
    
    const matchedUser = State.accounts.find(a => a.email === email && a.pass === pass);
    
    if (matchedUser) {
        localStorage.setItem('bb_user_session', JSON.stringify(matchedUser));
        State.loggedUser = matchedUser;
        performLoginTransition(matchedUser);
    } else {
        showToast('Credenciais inválidas. Verifica o email e a palavra-passe, ou cria uma conta nova.');
    }
});

document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('bb_user_session');
    location.reload();
});

/* ==========================================================================
3. NAVEGAÇÃO
========================================================================== */
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
        switchView(e.currentTarget.getAttribute('data-target'));
    });
});

function switchView(viewName) {
    State.currentView = viewName;
    document.querySelectorAll('.nav-item').forEach(btn => { btn.classList.toggle('active', btn.getAttribute('data-target') === viewName); });
    document.getElementById('view-home').classList.remove('active');
    document.getElementById('map-view').style.display = 'none';
    document.getElementById('view-search').classList.remove('active');
    document.getElementById('view-cart').classList.remove('active');
    document.getElementById('view-settings').classList.remove('active');
    document.getElementById('view-history').classList.remove('active');

    const headerControls = document.getElementById('header-controls');
    headerControls.style.display = (viewName === 'home') ? 'flex' : 'none';

    if (viewName === 'home') {
        if (State.activeSubView === 'list') {
            document.getElementById('view-home').classList.add('active');
        } else {
            document.getElementById('map-view').style.display = 'block';
            initOrUpdateMap();
        }
    } else {
        document.getElementById(`view-${viewName}`).classList.add('active');
    }
    State.renderAll();
}

document.getElementById('btn-list-view').addEventListener('click', () => toggleMainSubView('list'));
document.getElementById('btn-map-view').addEventListener('click', () => toggleMainSubView('map'));

function toggleMainSubView(subView) {
    State.activeSubView = subView;
    document.getElementById('btn-list-view').classList.toggle('active', subView === 'list');
    document.getElementById('btn-map-view').classList.toggle('active', subView === 'map');
    switchView('home');
}

/* ==========================================================================
4. FILTRAGEM E RENDERIZAÇÃO
========================================================================== */
function getFilteredStores() {
    let list = State.stores.filter(store => {
        if (State.currentView === 'home' || State.activeSubView === 'map') {
            if (State.homeFilters.quick === 'price' && store.salePrice >= 5.00) return false;
            if (State.homeFilters.quick === 'vegan' && !store.isVegan) return false;
            if (State.homeFilters.quick === 'bakery' && store.type !== 'bakery') return false;
            if (State.homeFilters.quick === 'pastry' && store.type !== 'pastry') return false;
            if (State.homeFilters.quick === 'topRated' && store.rating < 4.7) return false;
            if (State.homeFilters.quick === 'glutenFree' && store.allergens && store.allergens.includes("Glúten")) return false;
        }
        if (State.currentView === 'search') {
            if (State.searchFilters.query) {
                const query = State.searchFilters.query.toLowerCase();
                const matchesName = store.name.toLowerCase().includes(query);
                const matchesProduct = store.productName.toLowerCase().includes(query);
                if (!matchesName && !matchesProduct) return false;
            }
            if (State.searchFilters.pickupTime !== 'any' && store.pickupPeriod !== State.searchFilters.pickupTime) return false;
            if (State.searchFilters.type !== 'any' && store.type !== State.searchFilters.type) return false;
            if (State.searchFilters.maxPrice !== 'any' && store.salePrice > parseFloat(State.searchFilters.maxPrice)) return false;
            
            // Lógica para filtrar corretamente a Categoria
            if (State.searchFilters.category && State.searchFilters.category !== 'any' && store.category !== State.searchFilters.category) return false;

            if (State.searchFilters.vegan && !store.isVegan) return false;
            if (State.searchFilters.glutenFree && store.allergens && store.allergens.includes("Glúten")) return false;
        }
        return true;
    });
    
    if (State.currentView === 'home' && State.homeFilters.quick === 'near') {
        list.sort((a, b) => a.distance - b.distance);
    }
    if (State.currentView === 'home' && State.homeFilters.quick === 'topRated') {
        list.sort((a, b) => b.rating - a.rating);
    }
    return list;
}

function buildStoreCardHTML(store) {
    const safeName = escapeHTML(store.name);
    const safeProduct = escapeHTML(store.productName);

    const allergensTags = store.allergens && store.allergens.length > 0 
        ? `<div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px;">
            ${store.allergens.map(a => `<span style="background: #F0EDE6; color: var(--text-muted); padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: 700;">${escapeHTML(a)}</span>`).join('')}
            </div>`
        : '';

    return `
        <div class="store-card" data-id="${store.id}">
            <div class="card-image-wrapper">
                <img src="${store.image}" alt="${safeName}" class="card-img" loading="lazy" onerror="this.src='https://via.placeholder.com/400x200?text=Imagem+Indisponível'">
                <span class="time-badge">${store.pickupTime}</span>
                <span class="distance-badge">${store.distance} km</span>
            </div>
            <div class="card-content">
                <div class="card-header-info">
                    <h3 class="store-title">${safeName}</h3>
                    <div class="rating"><i data-lucide="star"></i><span>${store.rating}</span></div>
                </div>
                <p class="product-preview">${safeProduct}</p>
                ${allergensTags}
                <div class="card-footer">
                    <div class="price-box">
                        <span class="original-price">${store.originalPrice.toFixed(2)}€</span>
                        <span class="bag-price">${store.salePrice.toFixed(2)}€</span>
                    </div>
                    <button class="btn-add-bag" onclick="addToCart(${store.id})" aria-label="Adicionar ${safeName} à sacola">
                        <i data-lucide="shopping-bag" style="width:14px; height:14px;"></i><span>Sacola</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderStoresList() {
    const container = document.getElementById('stores-list-container');
    const list = getFilteredStores();
    if (list.length === 0) {
        container.innerHTML = `<div class="empty-state"><i data-lucide="cookie"></i><p>Não há sacolas disponíveis com estes filtros.</p></div>`;
    } else {
        container.innerHTML = list.map(store => buildStoreCardHTML(store)).join('');
    }
    lucide.createIcons({ root: container });
}

document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
        State.homeFilters.quick = e.currentTarget.getAttribute('data-filter');
        State.renderAll();
    });
});

/* ==========================================================================
5. MAP INTEGRATION 
========================================================================== */
function initOrUpdateMap() {
    const list = getFilteredStores();
    
    if (!State.mapInstance) {
        State.mapInstance = L.map('map', { zoomControl: false }).setView([40.6405, -8.6538], 14);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '©OpenStreetMap'
        }).addTo(State.mapInstance);
    }

    State.mapMarkers.forEach(marker => State.mapInstance.removeLayer(marker));
    State.mapMarkers = [];

    list.forEach(store => {
        const customIcon = L.divIcon({
            className: 'custom-pin',
            html: `<div style="background-color: #3E5A44; color: white; width: 60px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 20px; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 0.85rem; box-sizing: border-box;">${store.salePrice.toFixed(2)}€</div>`,
            iconSize: [60, 30],
            iconAnchor: [30, 15]
        });

        const safeName = escapeHTML(store.name);
        const safeProduct = escapeHTML(store.productName);

        const allergensTags = store.allergens && store.allergens.length > 0 
            ? `<div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px;">
                ${store.allergens.map(a => `<span style="background: #F0EDE6; color: var(--text-muted); padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: 700;">${escapeHTML(a)}</span>`).join('')}
                </div>`
            : '';

        const popupContent = `
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; width: 210px; padding: 2px 0;">
                <img src="${store.image}" alt="${safeName}" style="width: 100%; height: 95px; object-fit: cover; border-radius: var(--radius-sm); margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                    <strong style="color: var(--text-main); font-size: 0.95rem; line-height: 1.2;">${safeName}</strong>
                    <span style="color: #FFB703; font-size: 0.8rem; font-weight: 600;">★ ${store.rating}</span>
                </div>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px;">${safeProduct}</p>
                ${allergensTags}
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 8px;">
                    <span style="font-size: 1.1rem; font-weight: 700; color: var(--accent);">${store.salePrice.toFixed(2)}€</span>
                    <button onclick="addToCart(${store.id})" style="background: var(--primary); color: white; border: none; padding: 6px 12px; border-radius: var(--radius-sm); font-weight: 600; font-size: 0.8rem; cursor: pointer;">
                        + Sacola
                    </button>
                </div>
            </div>
        `;

        const marker = L.marker(store.coords, { icon: customIcon }).addTo(State.mapInstance);
        marker.bindPopup(popupContent);
        State.mapMarkers.push(marker);
    });
    requestAnimationFrame(() => { if (State.mapInstance) State.mapInstance.invalidateSize(); });
}

/* ==========================================================================
6. PESQUISA AVANÇADA
========================================================================== */
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', (e) => { State.searchFilters.query = e.target.value; renderSearchResults(); });
document.getElementById('adv-filter-trigger').addEventListener('click', () => { document.getElementById('adv-filters-box').classList.toggle('open'); });

// NOVO: 'category' inserido no array e mapeado no mapKey para os Listeners funcionarem
['time', 'type', 'price', 'category'].forEach(filter => {
    const el = document.getElementById(`filter-${filter}`);
    if (el) {
        el.addEventListener('change', (e) => {
            const mapKey = { time: 'pickupTime', type: 'type', price: 'maxPrice', category: 'category' };
            State.searchFilters[mapKey[filter]] = e.target.value;
            renderSearchResults();
        });
    }
});

['vegan', 'gluten'].forEach(filter => {
    const el = document.getElementById(`filter-${filter}`);
    if (el) {
        el.addEventListener('change', (e) => {
            const mapKey = { vegan: 'vegan', gluten: 'glutenFree' };
            State.searchFilters[mapKey[filter]] = e.target.checked;
            renderSearchResults();
        });
    }
});

function renderSearchResults() {
    const container = document.getElementById('search-results-container');
    const results = getFilteredStores();
    if (State.searchFilters.query === '' && State.searchFilters.pickupTime === 'any' && State.searchFilters.type === 'any' && State.searchFilters.category === 'any') {
        container.innerHTML = `<div class="empty-state"><i data-lucide="search"></i><p>Procura petiscos ou padarias perto de ti.</p></div>`;
    } else if (results.length === 0) {
        container.innerHTML = `<div class="empty-state"><i data-lucide="frown"></i><p>Sem correspondências para a tua pesquisa.</p></div>`;
    } else { container.innerHTML = results.map(store => buildStoreCardHTML(store)).join(''); }
    lucide.createIcons({ root: container });
}

/* ==========================================================================
7. GESTÃO DE SACOLA E CHECKOUT
========================================================================== */
window.addToCart = function(storeId) {
    const store = State.stores.find(s => s.id === storeId);
    const cartItem = State.cart.find(item => item.id === storeId);
    if (cartItem) cartItem.quantity += 1;
    else State.cart.push({ id: store.id, name: store.name, productName: store.productName, price: store.salePrice, image: store.image, quantity: 1 });
    showToast(`Adicionado à sacola: ${store.name}`);
    const navBag = document.querySelector('[data-target="cart"]');
    navBag.style.transform = 'scale(1.15)';
    setTimeout(() => navBag.style.transform = 'scale(1)', 150);
    State.save();
};

window.updateQty = function(id, delta) {
    const item = State.cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) State.cart = State.cart.filter(i => i.id !== id);
    State.save();
};

function renderCartBadge() {
    const badge = document.getElementById('cart-count');
    const totalItems = State.cart.reduce((acc, curr) => acc + curr.quantity, 0);
    if (totalItems > 0) { badge.innerText = totalItems; badge.style.display = 'block'; } else { badge.style.display = 'none'; }
}

function calculateCartTotals() {
    let subtotal = State.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let deliveryFee = State.deliveryMethod === 'bike' ? 2.00 : 0.00;
    let premiumExtraDiscount = 0.00;

    if (State.isPremium) {
        if (State.deliveryMethod === 'bike') deliveryFee = 0.00;
        premiumExtraDiscount = subtotal * 0.10;
    }

    let totalFinal = (subtotal + deliveryFee) - premiumExtraDiscount;
    if(totalFinal < 0) totalFinal = 0; 

    return { subtotal, deliveryFee, premiumExtraDiscount, totalFinal };
}

function renderCartView() {
    const container = document.getElementById('cart-items-container');
    const totalsBox = document.getElementById('cart-totals-box');
    const deliveryBox = document.getElementById('delivery-options');

    if (State.cart.length === 0) {
        container.innerHTML = `<div class="empty-state"><i data-lucide="shopping-bag"></i><p>A tua sacola está vazia.</p><small style="display:block; margin-top:8px; color:var(--text-muted)">Salva excedentes para evitares o desperdício!</small></div>`;
        totalsBox.style.display = 'none'; deliveryBox.style.display = 'none';
        return;
    }

    totalsBox.style.display = 'block'; deliveryBox.style.display = 'block';
    if (State.deliveryMethod === 'bike') document.getElementById('radio-bike').checked = true;
    else document.getElementById('radio-pickup').checked = true;

    container.innerHTML = State.cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${escapeHTML(item.name)}" class="cart-item-img">
            <div class="cart-item-details">
                <strong style="font-size:0.95rem; color:var(--text-main); display:block;">${escapeHTML(item.name)}</strong>
                <span style="font-size:0.8rem; color:var(--text-muted); display:block; margin-bottom:4px;">${escapeHTML(item.productName)}</span>
                <strong style="color:var(--accent); font-size:0.95rem;">${(item.price * item.quantity).toFixed(2)}€</strong>
            </div>
            <div class="cart-qty-control">
                <button class="btn-qty" onclick="updateQty(${item.id}, -1)">-</button>
                <span style="font-weight:600; font-size:0.9rem; min-width:14px; text-align:center;">${item.quantity}</span>
                <button class="btn-qty" onclick="updateQty(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');

    const totals = calculateCartTotals();
    document.getElementById('subtotal-val').innerText = `${totals.subtotal.toFixed(2)}€`;
    document.getElementById('delivery-val').innerText = `${State.deliveryMethod === 'bike' ? '2.00' : '0.00'}€`;
    document.getElementById('total-val').innerText = `${totals.totalFinal.toFixed(2)}€`;

    if (State.isPremium) {
        if (State.deliveryMethod === 'bike') {
            document.getElementById('premium-delivery-row').style.display = 'flex';
        } else {
            document.getElementById('premium-delivery-row').style.display = 'none';
        }
        document.getElementById('premium-extra-row').style.display = 'flex';
        document.getElementById('premium-discount-val').innerText = `-${totals.premiumExtraDiscount.toFixed(2)}€`;
    } else {
        document.getElementById('premium-delivery-row').style.display = 'none';
        document.getElementById('premium-extra-row').style.display = 'none';
    }
    lucide.createIcons({ root: container });
}

document.getElementById('btn-checkout').addEventListener('click', () => {
    const totals = calculateCartTotals();
    
    const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...State.cart],
        total: totals.totalFinal,
        method: State.deliveryMethod,
        review: null 
    };
    State.orderHistory.push(newOrder);

    showToast(State.deliveryMethod === 'bike' ? "🎉 Pedido efetuado! O estafeta de bicicleta vai realizar a entrega." : "🎉 Pedido efetuado! Já te podes deslocar para a recolha.");
    
    State.cart = []; 
    State.save(); 
    switchView('history');
});

/* ==========================================================================
8. SISTEMA DE HISTÓRICO E REVIEWS
========================================================================== */
let currentReviewOrderId = null;
let currentReviewStars = 0;

function renderHistoryView() {
    const container = document.getElementById('history-list-container');
    if (State.orderHistory.length === 0) {
        container.innerHTML = `<div class="empty-state"><i data-lucide="clock"></i><p>Ainda não tens pedidos anteriores.</p></div>`;
        lucide.createIcons({ root: container });
        return;
    }

    container.innerHTML = State.orderHistory.slice().reverse().map(order => {
        const dateStr = new Date(order.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        let itemsHtml = order.items.map(i => `
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-top:4px;">
                <span style="color:var(--text-muted);">${i.quantity}x ${escapeHTML(i.name)}</span>
                <span style="font-weight:600;">${(i.price * i.quantity).toFixed(2)}€</span>
            </div>
        `).join('');

        let reviewHtml = '';
        if (order.review) {
            let stars = '';
            for(let i=1; i<=5; i++) {
                stars += `<i data-lucide="star" style="width:14px; height:14px; color:#FFB703; fill:${i<=order.review.rating ? '#FFB703' : 'transparent'}; margin-right:2px;"></i>`;
            }
            reviewHtml = `
                <div class="review-box">
                    <div style="display:flex; margin-bottom:4px;">${stars}</div>
                    <p style="color:var(--text-main); font-style:italic;">"${escapeHTML(order.review.comment)}"</p>
                </div>
            `;
        } else {
            reviewHtml = `<button class="btn-outline" style="width:100%; margin-top:12px; padding:8px; font-size:0.85rem;" onclick="openReviewModal(${order.id})">Deixar Avaliação</button>`;
        }

        return `
            <div class="history-card">
                <div class="history-header">
                    <span style="font-size:0.85rem; font-weight:600; color:var(--text-main);">${dateStr}</span>
                    <strong style="color:var(--primary); font-size:1.1rem;">${order.total.toFixed(2)}€</strong>
                </div>
                ${itemsHtml}
                <div style="font-size:0.8rem; color:var(--text-muted); margin-top:12px; border-top:1px solid var(--border); padding-top:8px;">
                    Entrega: <strong>${order.method === 'bike' ? 'Por Bicicleta' : 'Recolha no Local'}</strong>
                </div>
                ${reviewHtml}
            </div>
        `;
    }).join('');
    lucide.createIcons({ root: container });
}

window.openReviewModal = function(orderId) {
    currentReviewOrderId = orderId;
    currentReviewStars = 0;
    document.getElementById('review-text').value = '';
    updateStarUI();
    document.getElementById('review-modal').classList.add('active');
};

function updateStarUI() {
    document.querySelectorAll('#review-stars span').forEach(span => {
        const val = parseInt(span.getAttribute('data-val'));
        const svg = span.querySelector('svg');
        
        if (svg) {
            if (val <= currentReviewStars) {
                svg.style.color = '#FFB703'; 
                svg.style.fill = '#FFB703';
            } else {
                svg.style.color = '#ccc'; 
                svg.style.fill = 'transparent';
            }
        }
    });
}

document.querySelectorAll('#review-stars span').forEach(span => {
    span.addEventListener('click', (e) => {
        currentReviewStars = parseInt(e.currentTarget.getAttribute('data-val'));
        updateStarUI();
    });
});

document.getElementById('btn-cancel-review').addEventListener('click', () => {
    document.getElementById('review-modal').classList.remove('active');
});

document.getElementById('btn-submit-review').addEventListener('click', () => {
    if(currentReviewStars === 0) {
        showToast('Por favor, seleciona pelo menos uma estrela para avaliar.');
        return;
    }
    const comment = document.getElementById('review-text').value.trim();
    const orderIndex = State.orderHistory.findIndex(o => o.id === currentReviewOrderId);
    if(orderIndex !== -1) {
        State.orderHistory[orderIndex].review = {
            rating: currentReviewStars,
            comment: comment || 'Avaliado sem comentário escrito.'
        };
        State.save();
        showToast('Obrigado pela tua avaliação!');
        document.getElementById('review-modal').classList.remove('active');
    }
});

/* ==========================================================================
9. DEFINIÇÕES, ALERGIAS E SUBSCRIÇÃO PREMIUM
========================================================================== */
function initSettingsListeners() {
    const premiumToggle = document.getElementById('premium-toggle');
    premiumToggle.checked = State.isPremium;

    premiumToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            e.target.checked = false; 
            document.getElementById('premium-modal').classList.add('active');
        } else {
            if (confirm('Tens a certeza que queres cancelar a tua subscrição Premium? Vais perder acesso aos descontos.')) {
                State.isPremium = false;
                State.save();
                showToast('Subscrição cancelada.');
            } else { e.target.checked = true; }
        }
    });

    document.getElementById('btn-cancel-premium').addEventListener('click', () => { document.getElementById('premium-modal').classList.remove('active'); });
    document.getElementById('btn-confirm-premium').addEventListener('click', () => {
        State.isPremium = true;
        document.getElementById('premium-toggle').checked = true;
        State.save();
        document.getElementById('premium-modal').classList.remove('active');
        showToast('Bem-vindo ao Premium! 🎉');
    });

    document.querySelectorAll('input[name="deliveryMethod"]').forEach(radio => {
        radio.addEventListener('change', (e) => { State.deliveryMethod = e.target.value; State.save(); });
    });

    document.getElementById('notif-surplus').checked = State.preferences.notifSurplus;
    document.getElementById('notif-orders').checked = State.preferences.notifOrders;
    document.getElementById('setting-radius').value = State.preferences.radius;
    document.getElementById('setting-theme').value = State.preferences.theme;

    document.getElementById('notif-surplus').addEventListener('change', (e) => { State.preferences.notifSurplus = e.target.checked; State.save(); });
    document.getElementById('notif-orders').addEventListener('change', (e) => { State.preferences.notifOrders = e.target.checked; State.save(); });
    document.getElementById('setting-radius').addEventListener('change', (e) => { State.preferences.radius = e.target.value; State.save(); });
    document.getElementById('setting-theme').addEventListener('change', (e) => { State.preferences.theme = e.target.value; State.save(); });
}

function renderSettingsView() { document.getElementById('premium-toggle').checked = State.isPremium; }

/* ==========================================================================
10. INICIALIZAÇÃO E BOOTSTRAP
========================================================================== */
function initApp() {
    initSettingsListeners();
    State.renderAll();
    lucide.createIcons();
    requestAnimationFrame(() => { if (State.mapInstance) State.mapInstance.invalidateSize(); });
}

window.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons(); 
    if (State.loggedUser) { performLoginTransition(State.loggedUser); }
});