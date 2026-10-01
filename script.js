// ===== Config =====
const WHATSAPP_NUMBER = '+212 649062690';      // format local ou international, normalisé plus bas
const PRODUCT = { name: 'IMUSA Denim Jorts', price: '215 DH' };

const $ = (id) => document.getElementById(id);
const waNumber = (n) => { const d = n.replace(/\D/g, ''); return d.startsWith('0') ? '212' + d.slice(1) : d; };

// ===== Hero slider =====
const track = $('slider-track');
const slider = $('product-slider');
const dots = document.querySelectorAll('.indicator-dot');
const totalSlides = track ? track.children.length : 0;
let current = 0, timer = null;

function updateSlider() {
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => {
    const on = i === current;
    d.classList.toggle('bg-black', on); d.classList.toggle('w-6', on);
    d.classList.toggle('bg-white/50', !on); d.classList.toggle('w-2', !on);
  });
}
const goToSlide = (i) => { current = (i + totalSlides) % totalSlides; updateSlider(); };
const nextSlide = () => goToSlide(current + 1);
const prevSlide = () => goToSlide(current - 1);
const startAuto = () => { stopAuto(); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(nextSlide, 4000); };
const stopAuto = () => { clearInterval(timer); timer = null; };

if (track && slider) {
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);
  let x0 = null;                                   // swipe mobile
  slider.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; stopAuto(); }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    if (x0 !== null) { const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) (dx < 0 ? nextSlide : prevSlide)(); }
    x0 = null; startAuto();
  });
  updateSlider(); startAuto();
}

// ===== UI =====
const closeBanner = () => { $('promo-banner').style.display = 'none'; };
const toggleMobileMenu = () => $('mobile-menu').classList.toggle('hidden');

function selectSize(size) {
  $('selected-size').value = size;
  document.querySelectorAll('.size-btn').forEach((b) => {
    const on = b.textContent.trim() === size;
    b.classList.toggle('bg-black', on);
    b.classList.toggle('text-white', on);
  });
}

// ===== Commande WhatsApp =====
function submitToWhatsApp() {
  const name = document.getElementById('input-name').value.trim();
  const phone = document.getElementById('input-phone').value.trim();
  const place = document.getElementById('input-location').value.trim();
  const size = document.getElementById('selected-size').value;
  const err = document.getElementById('form-error');

  if (!name || phone.replace(/\D/g, '').length < 9 || !place || !size) { 
      if (err) err.classList.remove('hidden'); 
      return; 
  }
  
  if (err) err.classList.add('hidden');

  const msg = `Bonjour IMUSA,\n\nJe souhaite commander :\n\n- Produit : ${PRODUCT.name}\n- Prix : ${PRODUCT.price}\n- Taille : ${size}\n- Nom & Prénom : ${name}\n- Téléphone : ${phone}\n- Localisation / Adresse : ${place}\n\nMerci de confirmer ma commande.`;
  
  const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  
  const cartCount = document.getElementById('cart-count');
  if (cartCount) cartCount.textContent = '1';

  window.location.href = url;
}