/* public/script.js */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Custom Cursor Glow ---
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    });

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.5)');
        el.addEventListener('mouseleave', () => cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)');
    });

    // --- Typing Effect ---
    const textArray = [
        "Intelligence is being augmented.",
        "Cognition is being offloaded.",
        "Are we learning, or just querying?",
        "The shift is happening now."
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeElement = document.getElementById('typewriter');

    function type() {
        const currentText = textArray[textIndex];
        if (isDeleting) {
            typeElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 30 : 70;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }
    type();

    // --- 3D Tilt Effect on Cards ---
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // --- Magnetic Buttons ---
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- Parallax & Scroll Reveal with Intersection Observer ---
    const reveals = document.querySelectorAll('.reveal');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('active');
                    
                    // Trigger progress bars if inside stats
                    if(entry.target.classList.contains('stat-box')) {
                        const bar = entry.target.querySelector('.bar');
                        if(bar) bar.style.width = bar.getAttribute('data-width');
                        
                        const numTarget = entry.target.querySelector('.stat-number');
                        if(numTarget && numTarget.innerText === '0') animateValue(numTarget, 0, parseInt(numTarget.getAttribute('data-target')), 2000);
                    }
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(reveal => revealObserver.observe(reveal));

    // Simple smooth parallax listener
    let lastKnownScrollPosition = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastKnownScrollPosition = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                parallaxLayers.forEach(layer => {
                    const speed = layer.getAttribute('data-speed');
                    const yPos = -(lastKnownScrollPosition * speed);
                    layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    // --- Number Counter Animation ---
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start) + (obj.getAttribute('data-target').includes('x') ? 'x' : '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // --- Testimonial Slider ---
    const track = document.getElementById('testimonial-slider');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentIndex = 0;
    const cards = document.querySelectorAll('.testimonial-card');
    
    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        if(currentIndex < cards.length - 1) currentIndex++;
        else currentIndex = 0;
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        if(currentIndex > 0) currentIndex--;
        else currentIndex = cards.length - 1;
        updateSlider();
    });

    // --- Interactive Terminal Mock ---
    const triggerBtn = document.getElementById('trigger-ai');
    const terminalBody = document.getElementById('terminal-body');
    const aiResponses = [
        "Analyzing structural paradigm...",
        "Bypassing standard neural retrieval...",
        "Synthesizing argument based on predictive weights...",
        "OUTPUT: Human dependency identified as optimal growth vector."
    ];
    let responseCount = 0;

    triggerBtn.addEventListener('click', () => {
        if (responseCount >= aiResponses.length) return;
        
        const userLine = document.createElement('div');
        userLine.className = 'line user';
        userLine.textContent = "> Generate Hypothesis";
        terminalBody.appendChild(userLine);
        
        triggerBtn.disabled = true;
        triggerBtn.style.opacity = '0.5';

        setTimeout(() => {
            const sysLine = document.createElement('div');
            sysLine.className = 'line sys';
            sysLine.textContent = aiResponses[responseCount];
            terminalBody.appendChild(sysLine);
            terminalBody.scrollTop = terminalBody.scrollHeight;
            responseCount++;
            
            triggerBtn.disabled = false;
            triggerBtn.style.opacity = '1';
        }, 800);
    });

});