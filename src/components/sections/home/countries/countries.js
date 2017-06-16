import 'vendors/swiper/swiper.jquery.min.js';

domready(function () {
  exports.init = function () {
    // ----------------------------------------------------------------------------
    // Country slider
    // ----------------------------------------------------------------------------
    $('.countries .swiper-container').each(function(){
      var coutrySlider = new Swiper($(this), {
            // pagination: $(this).find('.swiper-pagination'),
            // paginationClickable: $(this).find('.swiper-pagination'),
            nextButton: $(this).closest('.countries__slider').find('.swiper-button-next'),
            prevButton: $(this).closest('.countries__slider').find('.swiper-button-prev'),
            slidesPerView: 8,
            slidesPerColumn: 2,
            // slidesPerColumnFill: 'row',
            spaceBetween: 10,
            // Small screens, center to align and loop elements
            breakpoints: {
              1920: {
                slidesPerView: 8
              },
              1600: {
                slidesPerView: 6
              },
              1400: {
                slidesPerView: 5
              },
              1200: {
                 slidesPerView: 4
              },
              768: {
                 slidesPerView: 3
              },
              576: {
                 slidesPerView: 2
              },
              480: {
                 slidesPerView: 1
              }
            },
        });
    });

    // ----------------------------------------------------------------------------
    // Actions for each countries category
    // ----------------------------------------------------------------------------
    $('.countries__category').each(function(){
      var $this = $(this);
      var $coutriesTables = $this.find('.countries__tables');
      $detailButton = $this.find('.country-block__detail-button');
      $detailButton.on('click', function(){
        var $countryBlock = $(this).closest('.country-block');
        var countryCode = $countryBlock.data('country-code');
        $coutriesTables.find('.table--country').addClass('hidden');
        $coutriesTables.find(`.table--country--${countryCode}`).removeClass('hidden');
        console.log($coutriesTables.find(`.table--country--${countryCode}`))
      });
    });
  }
});
