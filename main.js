document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if(mainNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-arrow-left'); // TPB style back arrow
        } else {
            icon.classList.remove('fa-arrow-left');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a standard link (not the dropdown toggle)
    const navLinks = mainNav.querySelectorAll('a:not(.dropdown-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-arrow-left');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Mobile Dropdown Accordion
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if(window.innerWidth <= 768) {
                e.preventDefault();
                const parent = toggle.parentElement;
                parent.classList.toggle('expanded');
                const icon = toggle.querySelector('.mobile-dropdown-icon');
                if(parent.classList.contains('expanded')) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
    });

    // 2. Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            header.style.padding = '5px 0';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            header.style.padding = '0';
        }
    });

    // 3. Scroll Animation with Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll('.slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // 4. Language Switcher Logic (Custom Dropdown)
    const customLangSelector = document.getElementById('custom-lang-selector');
    const langSelected = document.getElementById('lang-selected');
    const langOptions = document.getElementById('lang-options');
    
    // Toggle dropdown
    langSelected.addEventListener('click', (e) => {
        e.stopPropagation();
        langOptions.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        langOptions.classList.remove('show');
    });

    // Check local storage for saved language
    const savedLang = localStorage.getItem('selected_language') || 'pt-br';
    updateLanguageUI(savedLang);
    applyTranslation(savedLang);

    // Handle language selection
    const options = langOptions.querySelectorAll('li');
    options.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            localStorage.setItem('selected_language', lang);
            updateLanguageUI(lang);
            applyTranslation(lang);
        });
    });

    function updateLanguageUI(lang) {
        // Find the selected option details
        const selectedOption = langOptions.querySelector(`li[data-lang="${lang}"]`);
        if (selectedOption) {
            const flagSrc = selectedOption.querySelector('img').src;
            const langText = selectedOption.textContent.trim();
            
            // Update the display
            langSelected.querySelector('img').src = flagSrc;
            langSelected.querySelector('span').textContent = langText;
        }
    }

    function applyTranslation(lang) {
        if (!translations[lang]) return;
        
        const dict = translations[lang];
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.innerHTML = dict[key];
            }
        });

        // Update form placeholders specifically
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) {
                el.placeholder = dict[key];
            }
        });

        // Update HTML lang attribute for SEO and Accessibility
        document.documentElement.lang = lang;
    }

    // 5. About Image Carousel Logic
    let slideIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const carouselContainer = document.querySelector('.carousel-container');
    
    if(slides.length > 0) {
        showSlides(slideIndex);
        let slideInterval = setInterval(nextSlide, 4000);

        // Pause on hover
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
            carouselContainer.addEventListener('mouseleave', () => {
                clearInterval(slideInterval); // Ensure no duplicate intervals
                slideInterval = setInterval(nextSlide, 4000);
            });
        }
        
        document.querySelector('.carousel-prev')?.addEventListener('click', () => {
            clearInterval(slideInterval);
            slideIndex--;
            showSlides(slideIndex);
            slideInterval = setInterval(nextSlide, 4000);
        });
        
        document.querySelector('.carousel-next')?.addEventListener('click', () => {
            clearInterval(slideInterval);
            nextSlide();
            slideInterval = setInterval(nextSlide, 4000);
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                slideIndex = index;
                showSlides(slideIndex);
                slideInterval = setInterval(nextSlide, 4000);
            });
        });
        
        function nextSlide() {
            slideIndex++;
            showSlides(slideIndex);
        }
        
        function showSlides(n) {
            if (n >= slides.length) { slideIndex = 0 }
            if (n < 0) { slideIndex = slides.length - 1 }
            
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[slideIndex].classList.add('active');
            if(dots[slideIndex]) dots[slideIndex].classList.add('active');
        }
    }

    // 6. Form Submission Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Implementação estática para simular envio
            alert('Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }
});
