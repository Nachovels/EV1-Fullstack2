
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    
    if (window.scrollY > 100) {
        navbar.classList.add('solid');
    } else {
        navbar.classList.remove('solid');
    }
});


document.addEventListener('DOMContentLoaded', function() {

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    

    document.querySelectorAll('.nav-menu li a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    

    const images = document.querySelectorAll('.carousel-images img');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let current = 0;

    function showImage(index) {
        images.forEach((img, i) => img.classList.toggle('active', i === index));
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            current = (current - 1 + images.length) % images.length;
            showImage(current);
        });

        nextBtn.addEventListener('click', () => {
            current = (current + 1) % images.length;
            showImage(current);
        });
    }

    if (images.length > 0) {
        showImage(current);
    }
});