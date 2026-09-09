/**
 * EXPLORZI.PK - CORE EXECUTIVE SCRIPT
 * Ultra-Luxury 3D Parallax, Theme Toggle, Trip Calculator & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  init3DParallaxCards();
  initMobileMenu();
  initTourFilters();
  initTripCalculator();
  initFaqAccordion();
  initModal();
  initContactForm();
});

/* ==========================================================================
   1. Theme Management (Light & Dark Mode)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('explorzi-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Default to dark theme for maximum luxury aesthetic
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark');
  setTheme(initialTheme);

  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      showToast(`Switched to ${next.toUpperCase()} mode`);
    });
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('explorzi-theme', theme);
  updateThemeIcons(theme);
}

function updateThemeIcons(theme) {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    if (theme === 'dark') {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      btn.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      btn.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  });
}

/* ==========================================================================
   2. Navbar Scroll Behavior
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   3. Ultra-Smooth 3D Parallax & Tilt Cards
   ========================================================================== */
function init3DParallaxCards() {
  const cards = document.querySelectorAll('.card-3d, .hero-showcase-card');
  
  cards.forEach(card => {
    if (!card.querySelector('.card-glare')) {
      const glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation (-8deg to +8deg)
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${percentX}%`);
      card.style.setProperty('--mouse-y', `${percentY}%`);
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.setProperty('--mouse-x', `50%`);
      card.style.setProperty('--mouse-y', `50%`);
    });
  });
}

/* ==========================================================================
   4. Mobile Menu Drawer
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const closeBtn = document.querySelector('.mobile-menu-close');

  if (!toggleBtn || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);
}

/* ==========================================================================
   5. Tour Filter Tabs (Catalogue Filtering)
   ========================================================================== */
function initTourFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.tour-card-item');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category') || '';
        if (category === 'all' || cardCat.includes(category)) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. Interactive Custom Trip Price Calculator
   ========================================================================== */
function initTripCalculator() {
  const form = document.getElementById('custom-trip-form');
  if (!form) return;

  const destinationSelect = document.getElementById('calc-destination');
  const daysInput = document.getElementById('calc-days');
  const personsInput = document.getElementById('calc-persons');
  const vehicleSelect = document.getElementById('calc-vehicle');
  const hotelSelect = document.getElementById('calc-hotel');
  const addonCheckboxes = document.querySelectorAll('.calc-addon-check');

  const totalPriceEl = document.getElementById('calc-total-price');
  const perPersonPriceEl = document.getElementById('calc-per-person');
  const whatsappBookBtn = document.getElementById('calc-whatsapp-btn');

  const destinationBaseRates = {
    'skardu': 14000,
    'hunza': 12000,
    'kashmir': 9000,
    'swat': 8500,
    'fairy-meadows': 13000,
    'naran': 8000
  };

  const vehicleRates = {
    'prado': 18000,
    'hiace': 14000,
    'coaster': 22000,
    'by-air': 38000
  };

  const hotelRates = {
    'standard': 8000,
    'deluxe': 15000,
    'executive': 28000
  };

  function calculateTrip() {
    const dest = destinationSelect.value;
    const days = parseInt(daysInput.value) || 5;
    const persons = parseInt(personsInput.value) || 2;
    const vehicle = vehicleSelect.value;
    const hotel = hotelSelect.value;

    const baseDestRate = destinationBaseRates[dest] || 10000;
    const vehicleCost = (vehicleRates[vehicle] || 15000) * days;
    const roomsCount = Math.ceil(persons / 2);
    const hotelCost = (hotelRates[hotel] || 10000) * roomsCount * days;
    const guideAndOps = 4000 * days;

    let addonsCost = 0;
    let selectedAddonsList = [];
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        addonsCost += parseInt(cb.getAttribute('data-cost')) || 0;
        selectedAddonsList.push(cb.getAttribute('data-name'));
      }
    });

    const totalEstimate = vehicleCost + hotelCost + guideAndOps + addonsCost;
    const perPerson = Math.round(totalEstimate / persons);

    if (totalPriceEl) {
      totalPriceEl.textContent = `PKR ${totalEstimate.toLocaleString('en-US')}`;
    }
    if (perPersonPriceEl) {
      perPersonPriceEl.textContent = `PKR ${perPerson.toLocaleString('en-US')} / Person`;
    }

    if (whatsappBookBtn) {
      const destName = destinationSelect.options[destinationSelect.selectedIndex].text;
      const vehicleName = vehicleSelect.options[vehicleSelect.selectedIndex].text;
      const hotelName = hotelSelect.options[hotelSelect.selectedIndex].text;
      const addonsStr = selectedAddonsList.length ? selectedAddonsList.join(', ') : 'Standard Inclusions';

      const msg = `Assalam-o-Alaikum Explorzi.pk Team,\n\nI would like to request an official quotation for a custom tour:\n- Destination: ${destName}\n- Duration: ${days} Days\n- Travelers: ${persons} Persons\n- Transport: ${vehicleName}\n- Hotel Category: ${hotelName}\n- Add-ons: ${addonsStr}\n- Estimated Budget: PKR ${totalEstimate.toLocaleString('en-US')} (~PKR ${perPerson.toLocaleString('en-US')} per person)\n\nPlease share available dates and final confirmation. Thank you.`;

      const encodedMsg = encodeURIComponent(msg);
      whatsappBookBtn.href = `https://wa.me/923004900508?text=${encodedMsg}`;
    }
  }

  [destinationSelect, daysInput, personsInput, vehicleSelect, hotelSelect].forEach(el => {
    if (el) el.addEventListener('input', calculateTrip);
  });
  addonCheckboxes.forEach(cb => cb.addEventListener('change', calculateTrip));

  calculateTrip();
}

/* ==========================================================================
   7. FAQ Accordion Handler
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-question');
    if (q) {
      q.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   8. Modal Dialog for Itinerary / Quick Seat Booking
   ========================================================================== */
let activeModalTour = null;

function initModal() {
  const overlay = document.getElementById('booking-modal');
  const closeBtn = document.querySelector('.modal-close-btn');

  if (!overlay) return;

  const closeModal = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  const openButtons = document.querySelectorAll('.open-tour-modal-btn');
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tourTitle = btn.getAttribute('data-tour-title') || 'Explorzi Signature Tour';
      const tourPrice = btn.getAttribute('data-tour-price') || 'Contact for Price';
      const tourDays = btn.getAttribute('data-tour-days') || '5 Days';
      
      const modalTitle = document.getElementById('modal-tour-title');
      const modalPrice = document.getElementById('modal-tour-price');
      const modalDays = document.getElementById('modal-tour-days');
      const modalInputTour = document.getElementById('modal-input-tour');

      if (modalTitle) modalTitle.textContent = tourTitle;
      if (modalPrice) modalPrice.textContent = tourPrice;
      if (modalDays) modalDays.textContent = tourDays;
      if (modalInputTour) modalInputTour.value = tourTitle;

      activeModalTour = { title: tourTitle, price: tourPrice, days: tourDays };

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const modalForm = document.getElementById('modal-booking-form');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modal-input-name').value;
      const phone = document.getElementById('modal-input-phone').value;
      const seats = document.getElementById('modal-input-seats').value;
      const city = document.getElementById('modal-input-city').value;
      const tour = activeModalTour ? activeModalTour.title : 'Tour Package';

      const msg = `Assalam-o-Alaikum Explorzi.pk,\n\nI would like to reserve seats for:\n- Tour: ${tour}\n- Name: ${name}\n- Contact: ${phone}\n- Departure City: ${city}\n- Number of Seats: ${seats}\n\nPlease share the bank details for the seat reservation deposit. Thank you.`;

      window.open(`https://wa.me/923004900508?text=${encodeURIComponent(msg)}`, '_blank');
      closeModal();
      showToast('Booking details forwarded to WhatsApp.');
    });
  }
}

/* ==========================================================================
   9. Contact Form Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('main-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    const phone = form.querySelector('[name="phone"]').value;
    const message = form.querySelector('[name="message"]').value;

    const text = `Inquiry via Explorzi.pk Website:\n- Name: ${name}\n- Phone: ${phone}\n- Message: ${message}`;
    window.open(`https://wa.me/923004900508?text=${encodeURIComponent(text)}`, '_blank');

    form.reset();
    showToast('Your inquiry has been forwarded to WhatsApp.');
  });
}

/* ==========================================================================
   10. Toast Notification
   ========================================================================== */
function showToast(msg) {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${msg}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
