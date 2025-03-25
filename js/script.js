document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate elements when scrolling
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .portfolio-item, .about-content > *, .contact-content > *');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    document.querySelectorAll('.service-card, .portfolio-item, .about-content > *, .contact-content > *').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run once on load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to a server
            alert('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.');
            this.reset();
        });
    }
});

// Music Player Functionality
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicText = document.querySelector('.music-text');
let isPlaying = false;

// Fungsi untuk memulai musik setelah interaksi pengguna
function startMusic() {
    // Hapus event listener setelah pertama kali dijalankan
    document.removeEventListener('click', startMusic);
    document.removeEventListener('keydown', startMusic);
    
    bgMusic.volume = 0.3; // Atur volume rendah (30%)
    const playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Musik berhasil diputar
            isPlaying = true;
            musicText.textContent = 'Pause Music';
            musicToggle.innerHTML = '<i class="fas fa-pause"></i><span class="music-text">Pause Music</span>';
            localStorage.setItem('musicPref', 'playing');
        })
        .catch(error => {
            // Gagal memutar musik
            console.log("Autoplay prevented:", error);
            musicText.textContent = 'Play Music';
            musicToggle.innerHTML = '<i class="fas fa-music"></i><span class="music-text">Play Music</span>';
        });
    }
}

// Coba autoplay dengan permission
function tryAutoplay() {
    bgMusic.volume = 0; // Set volume ke 0 dulu
    
    const playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Jika berhasil, set volume normal
            bgMusic.pause();
            bgMusic.volume = 0.3;
            
            // Simpan preferensi
            isPlaying = true;
            musicText.textContent = 'Pause Music';
            musicToggle.innerHTML = '<i class="fas fa-pause"></i><span class="music-text">Pause Music</span>';
            localStorage.setItem('musicPref', 'playing');
            
            // Coba play lagi dengan volume sudah di-set
            bgMusic.play();
        })
        .catch(error => {
            // Jika autoplay diblokir, tunggu interaksi pengguna
            console.log("Autoplay prevented, waiting for user interaction");
            musicText.textContent = 'Play Music';
            
            // Tambahkan event listener untuk interaksi pertama
            document.addEventListener('click', startMusic);
            document.addEventListener('keydown', startMusic);
        });
    }
}

// Load music preference
if(localStorage.getItem('musicPref') === 'playing') {
    tryAutoplay();
} else {
    musicText.textContent = 'Play Music';
}

// Toggle button functionality
musicToggle.addEventListener('click', function(e) {
    e.stopPropagation(); // Mencegah trigger startMusic
    
    if(isPlaying) {
        bgMusic.pause();
        musicText.textContent = 'Play Music';
        musicToggle.innerHTML = '<i class="fas fa-music"></i><span class="music-text">Play Music</span>';
        localStorage.setItem('musicPref', 'paused');
    } else {
        bgMusic.volume = 0.3;
        bgMusic.play();
        musicText.textContent = 'Pause Music';
        musicToggle.innerHTML = '<i class="fas fa-pause"></i><span class="music-text">Pause Music</span>';
        localStorage.setItem('musicPref', 'playing');
    }
    isPlaying = !isPlaying;
});

// Pause music when tab is inactive
document.addEventListener('visibilitychange', function() {
    if(document.hidden) {
        bgMusic.pause();
    } else if(isPlaying && localStorage.getItem('musicPref') === 'playing') {
        bgMusic.play();
    }
});
