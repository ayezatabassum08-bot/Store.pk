const PRODUCTS = [
  // Mobile Accessories
  {id:'m1', cat:'mobile', name:'Braided USB-C Cable, 2m', spec:'100W PD · Nylon jacket', price:14.99, icon:'⚡', stock:'in'},
  {id:'m2', cat:'mobile', name:'MagSafe-Compatible Wallet', spec:'3-card · Vegan leather', price:24.00, icon:'💳', stock:'in'},
  {id:'m3', cat:'mobile', name:'20W Wall Charger, Dual Port', spec:'USB-C + USB-A', price:19.50, icon:'🔌', stock:'in'},
  {id:'m4', cat:'mobile', name:'Clear Impact Case', spec:'Drop-tested 8ft · iPhone/Galaxy', price:16.00, icon:'📱', stock:'low'},
  {id:'m5', cat:'mobile', name:'Tempered Glass Screen Protector', spec:'2-pack · 9H hardness', price:9.99, icon:'🛡️', stock:'in'},
  {id:'m6', cat:'mobile', name:'Pop-Grip Phone Stand', spec:'Collapsible · Universal mount', price:11.00, icon:'⭕', stock:'in'},
  {id:'m7', cat:'mobile', name:'10,000mAh Power Bank', spec:'22.5W fast charge', price:29.99, icon:'🔋', stock:'in'},
  // Laptop Accessories
  {id:'l1', cat:'laptop', name:'7-in-1 USB-C Hub', spec:'HDMI · SD · 3x USB-A · PD', price:39.00, icon:'🔗', stock:'in'},
  {id:'l2', cat:'laptop', name:'Aluminum Laptop Stand', spec:'Adjustable · Fits 11–17"', price:34.50, icon:'💻', stock:'in'},
  {id:'l3', cat:'laptop', name:'65W GaN Charger', spec:'Compact · USB-C PD', price:32.00, icon:'🔌', stock:'low'},
  {id:'l4', cat:'laptop', name:'Sleeve, 14-inch', spec:'Water-resistant · Felt lining', price:22.00, icon:'💼', stock:'in'},
  {id:'l5', cat:'laptop', name:'Wireless Mouse, Silent Click', spec:'2.4GHz + BT · 1600 DPI', price:18.99, icon:'🖱️', stock:'in'},
  {id:'l6', cat:'laptop', name:'Compact Mechanical Keyboard', spec:'75% layout · Hot-swap', price:64.00, icon:'⌨️', stock:'in'},
  {id:'l7', cat:'laptop', name:'Webcam Privacy Cover', spec:'3-pack · Ultra-slim', price:6.50, icon:'🎥', stock:'in'},
  // Earbuds & Headphones
  {id:'a1', cat:'audio', name:'True Wireless Earbuds', spec:'ANC · 30hr case battery', price:59.00, icon:'🎧', stock:'in'},
  {id:'a2', cat:'audio', name:'Wired Earbuds, USB-C', spec:'In-line mic · Flat cable', price:12.99, icon:'🎵', stock:'in'},
  {id:'a3', cat:'audio', name:'Over-Ear Headphones', spec:'40mm drivers · Foldable', price:49.00, icon:'🎧', stock:'in'},
  {id:'a4', cat:'audio', name:'Bluetooth ANC Headphones', spec:'35hr battery · Multipoint', price:89.00, icon:'🎧', stock:'low'},
  {id:'a5', cat:'audio', name:'Sport Earbuds, Ear Hooks', spec:'IPX7 · Wireless', price:34.99, icon:'🏃', stock:'in'},
  {id:'a6', cat:'audio', name:'Wired Earbuds, 3.5mm', spec:'Classic jack · In-line remote', price:8.99, icon:'🎵', stock:'in'},
  {id:'a7', cat:'audio', name:'Earbud Silicone Tips Set', spec:'S/M/L · 3 pairs', price:5.99, icon:'⚪', stock:'in'},
  // More
  {id:'x1', cat:'more', name:'Desk Cable Organizer', spec:'Clips + sleeve combo', price:9.50, icon:'🧵', stock:'in'},
  {id:'x2', cat:'more', name:'Wireless Charging Pad', spec:'15W · Qi-certified', price:21.00, icon:'🔵', stock:'in'},
  {id:'x3', cat:'more', name:'Portable Bluetooth Speaker', spec:'IPX6 · 12hr playtime', price:44.00, icon:'🔊', stock:'in'},
  {id:'x4', cat:'more', name:'Laptop-to-Phone Stand, Dual', spec:'Foldable aluminum', price:15.00, icon:'📐', stock:'in'}
];

const CATS = [
  {key:'mobile', title:'Mobile Accessories'},
  {key:'laptop', title:'Laptop Accessories'},
  {key:'audio', title:'Earbuds & Headphones'},
  {key:'more', title:'More'}
];

let cart = {}; // id -> qty
let activeFilter = 'all';

function renderCatalog(){
  const el = document.getElementById('catalog');
  el.innerHTML = '';
  const cats = activeFilter === 'all' ? CATS : CATS.filter(c => c.key === activeFilter);
  cats.forEach(cat => {
    const items = PRODUCTS.filter(p => p.cat === cat.key);
    const group = document.createElement('div');
    group.className = 'cat-group';
    group.id = cat.key;
    group.innerHTML = `
      <div class="cat-header">
        <h2>${cat.title}</h2>
        <span class="count mono">${items.length} items</span>
      </div>
      <div class="grid">
        ${items.map(p => `
          <div class="card">
            <div class="card-visual">
              ${p.stock === 'low' ? '<span class="stock-tag low">Low stock</span>' : '<span class="stock-tag">In stock</span>'}
              <span style="font-size:36px;">${p.icon}</span>
            </div>
            <div class="card-name">${p.name}</div>
            <div class="card-spec">${p.spec}</div>
            <div class="card-bottom">
              <span class="price">$${p.price.toFixed(2)}</span>
              <button class="add-btn" data-id="${p.id}">Add</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    el.appendChild(group);
  });

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(btn.dataset.id);
      btn.textContent = 'Added ✓';
      btn.classList.add('added');
      setTimeout(() => { btn.textContent = 'Add'; btn.classList.remove('added'); }, 900);
    });
  });
}

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  updateCartUI();
}
function changeQty(id, delta){
  if(!cart[id]) return;
  cart[id] += delta;
  if(cart[id] <= 0) delete cart[id];
  updateCartUI();
}
function removeFromCart(id){
  delete cart[id];
  updateCartUI();
}

function cartCount(){
  return Object.values(cart).reduce((a,b) => a+b, 0);
}
function cartSubtotal(){
  return Object.entries(cart).reduce((sum,[id,qty]) => {
    const p = PRODUCTS.find(p => p.id === id);
    return sum + p.price * qty;
  }, 0);
}

function updateCartUI(){
  document.getElementById('cartCount').textContent = cartCount();
  const itemsEl = document.getElementById('drawerItems');
  const footEl = document.getElementById('drawerFoot');
  const entries = Object.entries(cart);

  if(entries.length === 0){
    itemsEl.innerHTML = '<div class="empty-cart">Your cart is empty.<br>Add something from the catalog.</div>';
    footEl.style.display = 'none';
    return;
  }

  footEl.style.display = 'block';
  itemsEl.innerHTML = entries.map(([id, qty]) => {
    const p = PRODUCTS.find(p => p.id === id);
    return `
      <div class="drawer-item">
        <div class="thumb">${p.icon}</div>
        <div class="drawer-item-info">
          <div class="name">${p.name}</div>
          <div class="price mono">$${p.price.toFixed(2)}</div>
          <div class="qty-row">
            <button class="qty-btn" data-action="dec" data-id="${id}">−</button>
            <span class="qty-val">${qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${id}">+</button>
            <span class="remove-link" data-action="remove" data-id="${id}">Remove</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  itemsEl.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const action = el.dataset.action;
      if(action === 'inc') changeQty(id, 1);
      if(action === 'dec') changeQty(id, -1);
      if(action === 'remove') removeFromCart(id);
    });
  });

  const subtotal = cartSubtotal();
  const shipping = subtotal > 0 ? (subtotal >= 50 ? 0 : 5.99) : 0;
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  document.getElementById('grandTotal').textContent = `$${(subtotal + shipping).toFixed(2)}`;
}

// filter chips
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    renderCatalog();
  });
});

// cart drawer open/close
const overlay = document.getElementById('overlay');
const drawer = document.getElementById('drawer');
function openDrawer(){ overlay.classList.add('open'); drawer.classList.add('open'); }
function closeDrawer(){ overlay.classList.remove('open'); drawer.classList.remove('open'); }
document.getElementById('cartToggle').addEventListener('click', openDrawer);
document.getElementById('drawerClose').addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);

// checkout modal
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const modalTitle = document.getElementById('modalTitle');

function openCheckout(){
  modalTitle.textContent = 'Checkout';
  const subtotal = cartSubtotal();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  modalBody.innerHTML = `
    <div class="modal-summary">
      <div class="modal-summary-row"><span>Items (${cartCount()})</span><span>$${subtotal.toFixed(2)}</span></div>
      <div class="modal-summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '$'+shipping.toFixed(2)}</span></div>
      <div class="modal-summary-row grand"><span>Total</span><span>$${total.toFixed(2)}</span></div>
    </div>
    <div class="field-row">
      <div class="field"><label>First name</label><input type="text" id="fname" required></div>
      <div class="field"><label>Last name</label><input type="text" id="lname" required></div>
    </div>
    <div class="field"><label>Email</label><input type="email" id="email" required></div>
    <div class="field"><label>Shipping address</label><input type="text" id="address" required></div>
    <div class="field-row">
      <div class="field"><label>City</label><input type="text" id="city" required></div>
      <div class="field"><label>ZIP / Postal</label><input type="text" id="zip" required></div>
    </div>
    <div class="field"><label>Card number</label><input type="text" id="card" placeholder="•••• •••• •••• ••••" required></div>
    <div class="field-row">
      <div class="field"><label>Expiry</label><input type="text" id="exp" placeholder="MM/YY" required></div>
      <div class="field"><label>CVC</label><input type="text" id="cvc" placeholder="•••" required></div>
    </div>
    <button class="place-order-btn" id="placeOrderBtn">Place Order — $${total.toFixed(2)}</button>
  `;

  document.getElementById('placeOrderBtn').addEventListener('click', () => {
    const required = ['fname','lname','email','address','city','zip','card','exp','cvc'];
    const missing = required.some(id => !document.getElementById(id).value.trim());
    if(missing){
      alert('Please fill in all fields to place your order.');
      return;
    }
    showSuccess(total);
  });

  modalOverlay.classList.add('open');
}

function showSuccess(total){
  const orderId = 'ND-' + Math.floor(100000 + Math.random()*900000);
  modalTitle.textContent = 'Order Placed';
  modalBody.innerHTML = `
    <div class="success-view">
      <div class="success-icon">✓</div>
      <h3>Thanks — you're all set.</h3>
      <p>A confirmation has been sent to your email. Your order is being prepared for shipment.</p>
      <div class="order-id">Order ID: ${orderId}</div>
      <button class="continue-btn" id="continueBtn">Continue Browsing</button>
    </div>
  `;
  document.getElementById('continueBtn').addEventListener('click', () => {
    cart = {};
    updateCartUI();
    modalOverlay.classList.remove('open');
    closeDrawer();
  });
}

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if(cartCount() === 0) return;
  openCheckout();
});
document.getElementById('modalClose').addEventListener('click', () => modalOverlay.classList.remove('open'));
modalOverlay.addEventListener('click', (e) => { if(e.target === modalOverlay) modalOverlay.classList.remove('open'); });

renderCatalog();
updateCartUI();
