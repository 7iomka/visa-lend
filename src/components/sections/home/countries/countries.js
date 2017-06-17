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
            // need for hidden slider works
            observer: true,
            observeParents: true,
            // slidesPerColumnFill: 'row',
            spaceBetween: 10,
            // Small screens, center to align and loop elements
            breakpoints: {
              1920: {
                slidesPerView: 4
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
    var $countries__category = $('.countries__category');
    var $countries__slider = $('.countries__slider');

    $countries__category.each(function(){
      var $this = $(this);
      var $coutriesTables = $this.find('.countries__tables');
      $detailButton = $this.find('.country-block__detail-button');
      var category = $this.data('category');

      $this.on('click mouseover', function(){

        var $currentSlider = $(`.countries__slider--${category}`);

        //remove active class from all categories
        $countries__category.removeClass('active');
        $(this).addClass('active');
        // hide all sliders
        $countries__slider.addClass('hidden');
        // update current slider instance
        // currentSliderInstance.reinit();
        // show current slider
        $currentSlider.removeClass('hidden');
      });

      $detailButton.on('click', function(){
        var $countryBlock = $(this).closest('.country-block');
        var countryCode = $countryBlock.data('country-code');
        $coutriesTables.find('.table--country').addClass('hidden');
        $coutriesTables.find(`.table--country--${countryCode}`).removeClass('hidden');

      });
    });
  }
});
