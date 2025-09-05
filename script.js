// ================= HAMBURGER MENU =================
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');


    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent event from bubbling up
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');

            // Prevent body scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });


        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', function () {
                if (window.innerWidth <= 968) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        });


        document.addEventListener('click', function (e) {
            if (navLinks.classList.contains('active') &&
                !hamburger.contains(e.target) &&
                !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });


        window.addEventListener('resize', function () {
            if (window.innerWidth > 968) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// ================= THEME TOGGLE =================
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon?.classList.replace('fa-sun', 'fa-moon');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon?.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            themeIcon?.classList.replace('fa-sun', 'fa-moon');
        } else {
            themeIcon?.classList.replace('fa-moon', 'fa-sun');
        }
    });
}

// ================= NAV SCROLL EFFECT =================
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
});

// ================= ACTIVE LINK DETECTION =================
const navLinksList = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

function setActiveNavLink() {
    let currentSection = '';
    const navHeight = header ? header.offsetHeight : 0;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinksList.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

setActiveNavLink();
window.addEventListener('scroll', setActiveNavLink);

// Smooth scroll and close mobile menu on click
navLinksList.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                history.pushState(null, null, targetId);
            }
        }

        // Close mobile menu after clicking
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');

        // Update active class manually
        navLinksList.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// ================= FORM VALIDATION + SUBMISSION =================
const orderForm = document.querySelector('.order-form form');
if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name');
        const phone = document.getElementById('phone');
        const address = document.getElementById('address');
        const state = document.getElementById('state');
        const ready = document.querySelector('input[name="ready"]:checked');

        let isValid = true;

        [name, phone, address, state].forEach(input => {
            if (input && !input.value.trim()) {
                highlightError(input);
                isValid = false;
            } else if (input) {
                removeError(input);
            }
        });

        if (!ready) {
            alert('Please confirm if you are ready to receive the product');
            isValid = false;
        }

        if (isValid) {
            try {
                const formData = new FormData(orderForm);

                const response = await fetch(orderForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('✅ Order placed successfully! Check your email for confirmation.');
                    orderForm.reset();
                } else {
                    alert('❌ Something went wrong. Please try again.');
                }
            } catch (error) {
                alert('⚠️ Network error. Please try again later.');
            }
        }
    });
}

function highlightError(element) {
    element.style.borderColor = 'var(--error-color)';
    element.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.2)';
}

function removeError(element) {
    element.style.borderColor = '';
    element.style.boxShadow = '';
}

// ================= INTERACTIVE PRODUCT CARDS =================
const productItems = document.querySelectorAll('.product-item, .usage-card, .review-item');
productItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px)';
    });
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
    });
});

// ================= SCROLL ANIMATIONS =================
const animatedElements = document.querySelectorAll('.animate-card, .feature-item, .step');
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    setActiveNavLink();
});

// ================= ROTATING BANNER TEXT =================
const bannerTexts = [
    "⚡ Limited Time: Global FREE Express Shipping! ⚡",
    "🔥 Special Offer: Buy 2 Get 1 Free! 🔥",
    "🎉 Exclusive Discount: 25% Off For First-Time Customers! 🎉"
];

let currentBannerIndex = 0;
const bannerElement = document.querySelector('.hero-banner h3');

if (bannerElement) {
    setInterval(() => {
        currentBannerIndex = (currentBannerIndex + 1) % bannerTexts.length;
        bannerElement.textContent = bannerTexts[currentBannerIndex];
    }, 5000);
}

// ================= COUNTDOWN TIMER (OPTIONAL) =================
function createCountdownTimer() {
    const countdownElement = document.createElement('div');
    countdownElement.className = 'countdown-timer';
    countdownElement.innerHTML = `
        <h4>Offer Ends In:</h4>
        <div class="timer">
          <span class="hours">23</span>:<span class="minutes">59</span>:<span class="seconds">59</span>
        </div>
    `;

    const heroBanner = document.querySelector('.hero-banner');
    if (heroBanner) {
        heroBanner.appendChild(countdownElement);

        const hoursElement = countdownElement.querySelector('.hours');
        const minutesElement = countdownElement.querySelector('.minutes');
        const secondsElement = countdownElement.querySelector('.seconds');

        let hours = 23, minutes = 59, seconds = 59;

        const countdown = setInterval(() => {
            seconds--;
            if (seconds < 0) {
                seconds = 59;
                minutes--;
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                    if (hours < 0) {
                        clearInterval(countdown);
                        countdownElement.innerHTML = '<h4>Offer Expired!</h4>';
                        return;
                    }
                }
            }

            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        }, 1000);
    }
}

// Uncomment to enable countdown
// createCountdownTimer();
// ================= SCROLL TO TOP BUTTON =================
const scrollToTopBtn = document.getElementById('scrollToTop');
const homeSection = document.getElementById('home');

if (scrollToTopBtn && homeSection) {
    function toggleScrollToTopButton() {
        const homeSectionBottom = homeSection.offsetTop + homeSection.offsetHeight;

        if (window.scrollY > homeSectionBottom) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }

    // Initial check
    toggleScrollToTopButton();

    // Check on scroll
    window.addEventListener('scroll', toggleScrollToTopButton);

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
