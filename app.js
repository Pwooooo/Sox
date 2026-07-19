// Mock Data
const ITEMS = [
    { id: 1, name: 'Crown of Novelo', type: 'hat', price: 250, sales: 15320, creator: 'PixelMaster', rating: 4.9, desc: 'A majestic crown fit for royalty. Stand out from the crowd with golden trim and embedded gems.' },
    { id: 2, name: 'Dragon Wings', type: 'accessory', price: 450, sales: 8940, creator: 'FantasyForge', rating: 4.8, desc: 'Soar through the skies with these magnificent dragon wings. Animated with realistic feather physics.' },
    { id: 3, name: 'Neon Shades', type: 'face', price: 35, sales: 44200, creator: 'CyberStyle', rating: 4.5, desc: 'LED-lit sunglasses with customizable colors. Sync with your outfit for the perfect look.' },
    { id: 4, name: 'Samurai Armor', type: 'clothing', price: 180, sales: 6750, creator: 'LunarDesigns', rating: 4.7, desc: 'Full samurai armor set with intricate patterns. Lightweight and battle-ready.' },
    { id: 5, name: 'Pink Bomber', type: 'hat', price: 0, sales: 28100, creator: 'UrbanWear', rating: 4.2, desc: 'A stylish pink bomber hat. Free for everyone!' },
    { id: 6, name: 'Starfall Staff', type: 'tool', price: 320, sales: 5600, creator: 'MagicWorks', rating: 4.9, desc: 'Channel cosmic energy with this enchanted staff. Includes particle effects and custom animations.' },
    { id: 7, name: 'Cat Ears', type: 'hair', price: 60, sales: 38900, creator: 'KawaiiClub', rating: 4.6, desc: 'Adorable cat ears with 12 color options. Meow!' },
    { id: 8, name: 'Cyberpunk Jacket', type: 'clothing', price: 150, sales: 12400, creator: 'NeonNation', rating: 4.7, desc: 'A futuristic jacket with LED trim and holographic patches.' },
    { id: 9, name: 'Ghostly Aura', type: 'accessory', price: 200, sales: 7200, creator: 'SpookyStudio', rating: 4.4, desc: 'An ethereal ghost effect that follows your movements.' },
    { id: 10, name: 'Golden Watch', type: 'accessory', price: 500, sales: 3400, creator: 'LuxuryLabs', rating: 4.8, desc: 'A premium golden wristwatch with working clock face.' },
    { id: 11, name: 'Flame Skull', type: 'face', price: 120, sales: 8900, creator: 'HellfireHUD', rating: 4.3, desc: 'A blazing skull face with animated fire effects.' },
    { id: 12, name: 'Jetpack', type: 'tool', price: 380, sales: 4500, creator: 'TechTitan', rating: 4.6, desc: 'Rocket-powered jetpack with flight mechanics and trail effects.' },
    { id: 13, name: 'Angel Halo', type: 'hat', price: 175, sales: 11200, creator: 'DivineDesigns', rating: 4.7, desc: 'A radiant halo that gently rotates above your head.' },
    { id: 14, name: 'Ripped Jeans', type: 'clothing', price: 45, sales: 21500, creator: 'UrbanWear', rating: 4.1, desc: 'Classic ripped jeans with distressed detailing.' },
    { id: 15, name: 'Wizard Beard', type: 'hair', price: 85, sales: 6800, creator: 'FantasyForge', rating: 4.5, desc: 'A long flowing wizard beard. Comes in 8 colors.' },
    { id: 16, name: 'Pixel Sword', type: 'tool', price: 90, sales: 31200, creator: 'RetroRealm', rating: 4.4, desc: 'An 8-bit inspired pixel sword with retro sound effects.' },
    { id: 17, name: 'Top Hat', type: 'hat', price: 70, sales: 18900, creator: 'ClassicCuts', rating: 4.3, desc: 'A classic black top hat. Timeless elegance.' },
    { id: 18, name: 'Diamond Necklace', type: 'accessory', price: 600, sales: 2100, creator: 'LuxuryLabs', rating: 4.9, desc: 'A stunning diamond necklace with real-time reflections.' },
    { id: 19, name: 'Alien Antenna', type: 'hair', price: 40, sales: 15600, creator: 'SpaceStyle', rating: 4.0, desc: 'Extraterrestrial antenna headband with blinking lights.' },
    { id: 20, name: 'Viking Helmet', type: 'hat', price: 130, sales: 5400, creator: 'NordicNorse', rating: 4.6, desc: 'A fearsome Viking helmet with authentic horn details.' },
    { id: 21, name: 'Tuxedo Suit', type: 'clothing', price: 200, sales: 9800, creator: 'ClassicCuts', rating: 4.7, desc: 'A sharp tuxedo for formal occasions.' },
    { id: 22, name: 'Laser Gun', type: 'tool', price: 280, sales: 8300, creator: 'TechTitan', rating: 4.5, desc: 'A high-powered laser gun with customizable beam colors.' },
    { id: 23, name: 'Butterfly Wings', type: 'accessory', price: 300, sales: 6700, creator: 'FantasyForge', rating: 4.7, desc: 'Delicate butterfly wings with iridescent shimmer.' },
    { id: 24, name: 'Monocle', type: 'face', price: 55, sales: 12400, creator: 'ClassicCuts', rating: 4.2, desc: 'A sophisticated monocle with gold chain.' },
];

const CATEGORIES = [
    { key: '', name: 'All Items', icon: '📦', count: 50 },
    { key: 'hat', name: 'Hats', icon: '🎩', count: 8 },
    { key: 'hair', name: 'Hair', icon: '💇', count: 4 },
    { key: 'face', name: 'Faces', icon: '😊', count: 3 },
    { key: 'clothing', name: 'Clothing', icon: '👕', count: 4 },
    { key: 'accessory', name: 'Accessories', icon: '💎', count: 5 },
    { key: 'tool', name: 'Tools', icon: '🔧', count: 4 },
];

const CREATORS = [
    { name: 'PixelMaster', sales: 45200, items: 28 },
    { name: 'FantasyForge', sales: 38100, items: 22 },
    { name: 'TechTitan', sales: 29400, items: 18 },
    { name: 'UrbanWear', sales: 26700, items: 15 },
    { name: 'LuxuryLabs', sales: 23100, items: 12 },
    { name: 'ClassicCuts', sales: 19800, items: 14 },
];

const INVENTORY_ITEMS = [1, 5, 7, 10, 13, 16, 17, 19, 24];

// State
let currentPage = 'home';
let currentCategory = '';
let currentSort = 'popular';
let currentSearch = '';
let selectedItemId = null;

// Navigation
function navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) {
        target.classList.add('active');
        currentPage = page;
        window.scrollTo(0, 0);
    }
    if (page === 'marketplace') renderMarketplace();
    if (page === 'home') renderHome();
    if (page === 'create') renderMyCreations();
    if (page === 'avatar') renderInventory();
    if (page === 'profile') renderProfile();
}

// Helpers
function getItem(id) { return ITEMS.find(i => i.id === id); }

function getItemsByCategory(cat) {
    if (!cat) return ITEMS;
    return ITEMS.filter(i => i.type === cat);
}

function sortItems(items, sort) {
    const sorted = [...items];
    switch (sort) {
        case 'popular': return sorted.sort((a, b) => b.sales - a.sales);
        case 'newest': return sorted.sort((a, b) => b.id - a.id);
        case 'price-low': return sorted.sort((a, b) => a.price - b.price);
        case 'price-high': return sorted.sort((a, b) => b.price - a.price);
        case 'sales': return sorted.sort((a, b) => b.sales - a.sales);
        default: return sorted;
    }
}

function searchItems(items, query) {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(i => i.name.toLowerCase().includes(q) || i.creator.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
}

// Render helpers
function renderItemCard(item) {
    const typeIcons = { hat: '🎩', hair: '💇', face: '😊', clothing: '👕', accessory: '💎', tool: '🔧' };
    return `
        <div class="item-card" onclick="showItemDetail(${item.id})">
            <div class="item-thumb">
                <span class="item-type-badge">${item.type}</span>
                ${typeIcons[item.type] || '📦'}
            </div>
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-creator">by ${item.creator}</div>
                <div class="item-footer">
                    <div class="item-price ${item.price === 0 ? 'free' : ''}">${item.price === 0 ? 'FREE' : item.price.toLocaleString() + ' B'}</div>
                    <div class="item-sales">${item.sales.toLocaleString()} sold</div>
                </div>
            </div>
        </div>
    `;
}

// Home Page
function renderHome() {
    // Featured items
    const featured = sortItems(ITEMS, 'popular').slice(0, 8);
    document.getElementById('featured-grid').innerHTML = featured.map(renderItemCard).join('');

    // Categories
    document.getElementById('categories-grid').innerHTML = CATEGORIES.filter(c => c.key).map(c => `
        <div class="category-card" onclick="navigate('marketplace'); setTimeout(() => selectCategory('${c.key}'), 100)">
            <div class="category-icon">${c.icon}</div>
            <div class="category-name">${c.name}</div>
            <div class="category-count">${c.count} items</div>
        </div>
    `).join('');

    // Creators
    document.getElementById('creators-grid').innerHTML = CREATORS.map(c => `
        <div class="creator-card">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=${c.name}" alt="${c.name}">
            <div class="creator-name">${c.name}</div>
            <div class="creator-sales">${c.sales.toLocaleString()} total sales</div>
        </div>
    `).join('');
}

// Marketplace
function renderMarketplace() {
    // Category tabs
    const tabsHtml = CATEGORIES.map(c => `
        <button class="filter-tab ${c.key === currentCategory ? 'active' : ''}" onclick="selectCategory('${c.key}')">${c.icon} ${c.name}</button>
    `).join('');
    document.getElementById('category-tabs').innerHTML = tabsHtml;

    // Set sort
    document.getElementById('sort-select').value = currentSort;

    // Render items
    refreshCatalog();
}

function selectCategory(cat) {
    currentCategory = cat;
    renderMarketplace();
}

function catalogSearch() {
    currentSearch = document.getElementById('nav-search').value;
}

function refreshCatalog() {
    currentSort = document.getElementById('sort-select')?.value || 'popular';
    let items = getItemsByCategory(currentCategory);
    items = searchItems(items, currentSearch);
    items = sortItems(items, currentSort);

    const grid = document.getElementById('marketplace-grid');
    const loading = document.getElementById('marketplace-loading');
    const pagination = document.getElementById('pagination');

    if (items.length === 0) {
        grid.innerHTML = '<div class="empty-state">No items found. Try a different search or category.</div>';
        pagination.innerHTML = '';
        loading.style.display = 'none';
        return;
    }

    // Simple pagination - show first 24
    const pageSize = 24;
    const totalPages = Math.ceil(items.length / pageSize);
    const page = 1;
    const pageItems = items.slice(0, pageSize);

    grid.innerHTML = pageItems.map(renderItemCard).join('');
    loading.style.display = 'none';

    if (totalPages > 1) {
        pagination.innerHTML = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => `
            <button class="page-btn ${i + 1 === page ? 'active' : ''}">${i + 1}</button>
        `).join('');
    } else {
        pagination.innerHTML = '';
    }
}

// Item Detail
function showItemDetail(id) {
    selectedItemId = id;
    navigate('item');
    const item = getItem(id);
    if (!item) return;

    const typeIcons = { hat: '🎩', hair: '💇', face: '😊', clothing: '👕', accessory: '💎', tool: '🔧' };

    document.getElementById('item-detail').innerHTML = `
        <div class="item-detail-layout">
            <div class="item-detail-thumb">${typeIcons[item.type] || '📦'}</div>
            <div class="item-detail-info">
                <h1>${item.name}</h1>
                <div class="item-detail-creator">by ${item.creator}</div>
                <p class="item-detail-desc">${item.desc}</p>
                <div class="item-detail-price ${item.price === 0 ? 'free' : ''}">${item.price === 0 ? 'FREE' : item.price.toLocaleString() + ' Bricks'}</div>
                <button class="btn-primary" onclick="handlePurchase(${item.id})" style="width:100%;margin-bottom:24px">${item.price === 0 ? 'Get Free' : 'Buy Now'}</button>
                <div class="item-detail-meta">
                    <div class="meta-item">
                        <div class="meta-item-label">Type</div>
                        <div class="meta-item-value">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-item-label">Sales</div>
                        <div class="meta-item-value">${item.sales.toLocaleString()}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-item-label">Rating</div>
                        <div class="meta-item-value">${'⭐'.repeat(Math.round(item.rating))} ${item.rating}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-item-label">Creator ID</div>
                        <div class="meta-item-value">@${item.creator.toLowerCase().replace(/\s/g, '')}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function handlePurchase(id) {
    const item = getItem(id);
    if (!item) return;
    const balance = parseInt(document.getElementById('nav-balance').textContent.replace(/,/g, ''));
    if (item.price > 0 && balance < item.price) {
        alert('Insufficient Bricks balance! You need ' + (item.price - balance).toLocaleString() + ' more Bricks.');
        return;
    }
    if (confirm(`Purchase ${item.name} for ${item.price === 0 ? 'FREE' : item.price.toLocaleString() + ' Bricks'}?`)) {
        if (item.price > 0) {
            const newBalance = balance - item.price;
            document.getElementById('nav-balance').textContent = newBalance.toLocaleString();
        }
        INVENTORY_ITEMS.push(id);
        alert('Purchase successful! The item has been added to your inventory.');
    }
}

// Create Page
function openUpload(type) {
    document.getElementById('upload-title').textContent = `Upload ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    document.getElementById('upload-modal').classList.add('show');
}

function closeUpload() {
    document.getElementById('upload-modal').classList.remove('show');
}

function handleFileDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) handleFile(file);
}

function handleFile(file) {
    document.querySelector('.file-drop p').textContent = `Selected: ${file.name}`;
    document.querySelector('.file-drop').classList.add('has-file');
}

function publishCreation() {
    const name = document.getElementById('upload-name').value.trim();
    if (!name) { alert('Please enter an item name.'); return; }
    const price = parseInt(document.getElementById('upload-price').value) || 0;

    const newItem = {
        id: ITEMS.length + 1,
        name: name,
        type: document.getElementById('upload-title').textContent.replace('Upload ', '').toLowerCase(),
        price: price,
        sales: 0,
        creator: 'NoveloUser',
        rating: 0,
        desc: document.getElementById('upload-desc').value || 'No description provided.'
    };
    ITEMS.unshift(newItem);
    closeUpload();
    alert('Published successfully! Your item is now live on the marketplace.');
    renderMyCreations();
}

function renderMyCreations() {
    const myItems = ITEMS.filter(i => i.creator === 'NoveloUser');
    const grid = document.getElementById('my-creations-grid');
    if (myItems.length === 0) {
        grid.innerHTML = '<div class="empty-state">You haven\'t created any items yet. Use the cards above to publish your first creation!</div>';
    } else {
        grid.innerHTML = myItems.map(renderItemCard).join('');
    }
}

// Avatar Page
function renderInventory() {
    const tabs = ['hat', 'hair', 'face', 'clothing', 'accessory', 'tool'];
    const tabNames = ['Hats', 'Hair', 'Faces', 'Clothing', 'Accessories', 'Tools'];

    // Build inventory tabs
    document.getElementById('inventory-tabs').innerHTML = tabs.map((t, i) => `
        <button class="filter-tab ${i === 0 ? 'active' : ''}" onclick="selectInventoryTab('${t}', this)">${tabNames[i]}</button>
    `).join('');

    // Show first tab items
    showInventoryTab(tabs[0]);
}

function selectInventoryTab(type, btn) {
    document.querySelectorAll('#inventory-tabs .filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    showInventoryTab(type);
}

function showInventoryTab(type) {
    const owned = ITEMS.filter(i => INVENTORY_ITEMS.includes(i.id) && i.type === type);
    const grid = document.getElementById('inventory-grid');
    if (owned.length === 0) {
        grid.innerHTML = '<div class="empty-state">No items in this category yet. Visit the marketplace to buy some!</div>';
    } else {
        grid.innerHTML = owned.map(renderItemCard).join('');
    }
}

function updateAvatarColor(part, color) {
    const preview = document.getElementById('avatar-preview');
    const map = {
        head: '.avatar-head',
        torso: '.avatar-torso',
        arms: ['.avatar-left-arm', '.avatar-right-arm'],
        legs: ['.avatar-left-leg', '.avatar-right-leg']
    };
    const selector = map[part];
    if (typeof selector === 'string') {
        preview.querySelector(selector).style.background = color;
    } else {
        selector.forEach(s => preview.querySelector(s).style.background = color);
    }
}

// Profile Page
function renderProfile() {
    const myItems = ITEMS.filter(i => i.creator === 'NoveloUser');
    document.getElementById('profile-creations-grid').innerHTML = myItems.length > 0
        ? myItems.map(renderItemCard).join('')
        : '<div class="empty-state">No creations yet.</div>';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Default to home
    renderHome();

    // Click file drop to trigger file input
    document.addEventListener('click', (e) => {
        if (e.target.closest('.file-drop') && !e.target.closest('.browse-link')) {
            document.getElementById('file-input').click();
        }
        if (e.target.closest('.browse-link')) {
            document.getElementById('file-input').click();
        }
    });

    // Close modal on overlay click
    document.getElementById('upload-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('upload-modal')) closeUpload();
    });
});
