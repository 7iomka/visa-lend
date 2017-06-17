import 'vendors/swiper/swiper.jquery.min.js';
domready(function () {
  exports.init = function () {
    // header slideshow
    var headerSlideShow = new Swiper('.header__slideshow .swiper-container', {
        pagination: '.header__slideshow .swiper-pagination',
        paginationClickable: true,
        nextButton: '.header__slideshow .swiper-button-next',
        prevButton: '.header__slideshow .swiper-button-prev',
        spaceBetween: 30,
        effect: 'fade',
        loop: true,
        autoplayDisableOnInteraction: false,
        autoplay: 5000,
    });
  }
});
