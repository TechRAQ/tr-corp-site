/* assets/js/main.js */

.ready(function(){
    // Initialize Slick Slider for the Hero Section
    .slider.slick({
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 800,
        fade: true,
        cssEase: 'linear',
        arrows: false,
        dots: true,
        pauseOnHover: false
    });

    // Navbar background blur on scroll
    .scroll(function() {
        if (.scrollTop() > 50) {
            .navbar.addClass('shadow');
            .navbar.css('background-color', 'rgba(255, 255, 255, 0.98)!important');
        } else {
            .navbar.removeClass('shadow');
            .navbar.css('background-color', 'rgba(255, 255, 255, 0.95)!important');
        }
    });
});
