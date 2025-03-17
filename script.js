// Czekaj, aż dokument zostanie w pełni załadowany
document.addEventListener('DOMContentLoaded', function() {
    // Elementy DOM
    const header = document.querySelector('.header');
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');
    const backToTop = document.querySelector('.back-to-top');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contact-form');
    const typewriterText = document.querySelector('.typewriter-text');
    const sections = document.querySelectorAll('section');

    // Funkcja zmieniająca wygląd nagłówka podczas przewijania
    function toggleHeaderClass() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Funkcja pokazująca/ukrywająca przycisk "Back to top"
    function toggleBackToTopButton() {
        if (window.scrollY > 700) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    }

    // Obsługa przewijania strony
    window.addEventListener('scroll', function() {
        toggleHeaderClass();
        toggleBackToTopButton();
        highlightActiveNavLink();
    });

    // Inicjalizacja przy załadowaniu strony
    toggleHeaderClass();
    toggleBackToTopButton();

    // Obsługa menu mobilnego
    burgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Zamykanie menu mobilnego po kliknięciu w link
    navLinksItems.forEach(item => {
        item.addEventListener('click', function() {
            burgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Podświetlanie aktywnego linku w nawigacji podczas przewijania
    function highlightActiveNavLink() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinksItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }

    // Filtrowanie projektów
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Usuń klasę active ze wszystkich przycisków
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Dodaj klasę active do klikniętego przycisku
            this.classList.add('active');
            
            // Pobierz kategorię do filtrowania
            const filterValue = this.getAttribute('data-filter');
            
            // Filtruj projekty
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Efekt pisania na maszynie
    function typeWriter(text, i, fnCallback) {
        if (i < text.length) {
            typewriterText.innerHTML = text.substring(0, i+1) + '<span class="cursor"></span>';
            
            // Losowy czas pomiędzy wprowadzaniem znaków
            setTimeout(function() {
                typeWriter(text, i + 1, fnCallback)
            }, Math.random() * 100 + 50);
        } else if (typeof fnCallback == 'function') {
            setTimeout(fnCallback, 700);
        }
    }

    // Rozpocznij efekt pisania
    function startTypewriter() {
        const text = typewriterText.textContent;
        typewriterText.textContent = '';
        typeWriter(text, 0, function() {
            // Po zakończeniu animacji można dodać dodatkową funkcjonalność
        });
    }

    // Wywołaj funkcję po 1.5s opóźnienia
    setTimeout(startTypewriter, 1500);

    // Obsługa formularza kontaktowego
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Zapobiegamy domyślnej akcji formularza, aby uniknąć przekierowania
            e.preventDefault();
            
            // Zmiana tekstu przycisku podczas wysyłania
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Wysyłanie...';
            submitBtn.disabled = true;
            
            // Dodaj klasę do formularza, aby pokazać stan wysyłania
            this.classList.add('submitting');
            
            // Pobierz dane z formularza
            const formData = new FormData(this);
            const formAction = this.getAttribute('action');
            
            // Wyślij dane za pomocą fetch API
            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Sukces - pokaż powiadomienie
                    showNotification('Wiadomość została wysłana. Dziękuję za kontakt!', 'success');
                    
                    // Wyczyść formularz
                    contactForm.reset();
                    
                    // Przywróć oryginalny tekst przycisku
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        contactForm.classList.remove('submitting');
                    }, 1000);
                } else {
                    // Błąd - pokaż powiadomienie o błędzie
                    response.json().then(data => {
                        let errorMessage = 'Wystąpił błąd podczas wysyłania wiadomości.';
                        if (data && data.error) {
                            errorMessage = data.error;
                        }
                        showNotification(errorMessage, 'error');
                        
                        // Przywróć oryginalny tekst przycisku
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        contactForm.classList.remove('submitting');
                    });
                }
            })
            .catch(error => {
                // Błąd połączenia - pokaż powiadomienie
                showNotification('Nie można połączyć się z serwerem. Sprawdź swoje połączenie internetowe.', 'error');
                
                // Przywróć oryginalny tekst przycisku
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                contactForm.classList.remove('submitting');
            });
        });
    }

    // Funkcja do wyświetlania powiadomień
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Pokaż powiadomienie
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Ukryj powiadomienie po 5 sekundach
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Usuń element po zakończeniu animacji
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Płynne przewijanie dla linków kotwicznych
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });

    // Animacje elementów podczas przewijania
    function revealOnScroll() {
        const elements = document.querySelectorAll('.skill-item, .soft-skill, .project-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    }

    // Dodaj klasę animate do elementów CSS
    document.head.insertAdjacentHTML('beforeend', `
        <style>
        .skill-item, .soft-skill, .project-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .skill-item.animate, .soft-skill.animate, .project-card.animate {
            opacity: 1;
            transform: translateY(0);
        }
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: white;
            color: #333;
            padding: 15px 25px;
            border-radius: 4px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
            max-width: 300px;
        }
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        .notification.success {
            background-color: #4CAF50;
            color: white;
        }
        .notification.error {
            background-color: #f44336;
            color: white;
        }
        </style>
    `);

    // Wywołaj funkcję przy przewijaniu
    window.addEventListener('scroll', revealOnScroll);
    
    // Wywołaj funkcję na start, aby pokazać widoczne elementy
    revealOnScroll();
}); 