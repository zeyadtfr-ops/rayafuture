// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = document.getElementById('menuIcon');

const menuOpenIcon = '<path d="M18 6 6 18M6 6l12 12"/>';
const menuCloseIcon = '<path d="M3 12h18M3 6h18M3 18h18"/>';

menuToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuIcon.innerHTML = isOpen ? menuOpenIcon : menuCloseIcon;
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuIcon.innerHTML = menuCloseIcon;
  });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Subscribe form
const subForm = document.getElementById('subForm');
const emailInput = document.getElementById('emailInput');
const toast = document.getElementById('toast');

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

subForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!emailInput.value) return;
  showToast('تم اشتراكك بنجاح! ستصلك آخر الأخبار والإصدارات على بريدك.');
  emailInput.value = '';
});
