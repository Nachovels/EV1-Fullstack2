// script.js
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    
    if (window.scrollY > 100) {  // Cuando el scroll es mayor a 50px
        navbar.classList.add('solid');  // Añade la clase 'solid'
    } else {
        navbar.classList.remove('solid');  // Elimina la clase 'solid'
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.carousel-images img');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let current = 0;

    function showImage(index) {
        images.forEach((img, i) => img.classList.toggle('active', i === index));
    }

    prevBtn.addEventListener('click', () => {
        current = (current - 1 + images.length) % images.length;
        showImage(current);
    });

    nextBtn.addEventListener('click', () => {
        current = (current + 1) % images.length;
        showImage(current);
    });

    showImage(current);
});
