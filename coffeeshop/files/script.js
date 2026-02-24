/* ═══════════════════════════════════
   CART SYSTEM
═══════════════════════════════════ */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('bc_cart')) || []; } catch(e) {}

function saveCart() {
  try { localStorage.setItem('bc_cart', JSON.stringify(cart)); } catch(e) {}
}

function totalItems() {
  return cart.reduce((n, i) => n + i.qty, 0);
}

function updateCartUI() {
  const n = totalItems();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = n;
    el.style.display = n > 0 ? 'flex' : 'none';
  });
}

function addToCart(id, name, price, img) {
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, name, price, img, qty: 1 });
  saveCart();
  updateCartUI();
  showToast(`"${name}" added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
  if (typeof renderCartPage === 'function') renderCartPage();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(0, item.qty + delta);
  if (item.qty === 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
  if (typeof renderCartPage === 'function') renderCartPage();
}

/* ═══════════════════════════════════
   TOAST
═══════════════════════════════════ */
let toastTimer;
function showToast(msg) {
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id='toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

/* ═══════════════════════════════════
   NAVBAR SCROLL EFFECT
═══════════════════════════════════ */
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ═══════════════════════════════════
   SCROLL ANIMATIONS
═══════════════════════════════════ */
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.anim').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════
   CONTACT FORM
═══════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message sent! We\'ll reply within 24 hours.');
    form.reset();
  });
}

/* ═══════════════════════════════════
   INIT
═══════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  initNavbar();
  initAnimations();
  initContactForm();
});
