window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    
    if (window.scrollY > 80) {
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


    document.querySelectorAll('.card-img').forEach(img => {
        const originalSrc = img.src;
        const hoverSrc = img.getAttribute('data-hover');
        if (!hoverSrc) return;

        img.addEventListener('mouseenter', () => {
            img.classList.add('fade');
            setTimeout(() => {
                img.src = hoverSrc;
                img.classList.remove('fade');
            }, 200); 
        });

        img.addEventListener('mouseleave', () => {
            img.classList.add('fade');
            setTimeout(() => {
                img.src = originalSrc;
                img.classList.remove('fade');
            }, 200);
        });
    });
});

