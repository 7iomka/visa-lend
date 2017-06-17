import 'vendors/swiper/swiper.jquery.min.js';
/** GSAP and it plugins **/
import "gsap";
import 'vendors/gsap/ScrollToPlugin';

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
            slidesPerView: 4,
            slidesPerColumn: 2,
            // need for hidden slider works
            observer: true,
            observeParents: true,
            // slidesPerColumnFill: 'row',
            spaceBetween: 10,
            simulateTouch: false,
            // Small screens, center to align and loop elements (max width (!inclusive))
            breakpoints: {
              1920: {
                slidesPerView: 4
              },
              1280: {
                 slidesPerView: 3
              },
              767: {
                slidesPerView: 2
              },
              575: {
                 slidesPerView: 1
              },
              // 480: {
              //    slidesPerView: 1
              // }
            },
        });
    });

    // ----------------------------------------------------------------------------
    // Actions for each countries category
    // ----------------------------------------------------------------------------
    var $countries__category = $('.countries__category');
    var $countries__slider = $('.countries__slider');
    var $countries__sliderActive = $('.countries__slider.active');
    var $countries__tables = $('.countries__tables');
    var $countries__table = $countries__tables.find('.table--country');
    var $countries__preloader = $countries__tables.find('.preloader');
    var $countries__tablesContent = $('.countries__tables-content');
    // время анимации при переключении видимости контейнеров
    var sendTransitionTime = 400;

    $countries__category.each(function(){
      var $this = $(this);
      var category = $this.data('category');
      /**
       * On click by category labels
       */
      $this.on('click mouseover', function(){

        var $currentSlider = $(`.countries__slider--${category}`);

        //remove active class from all categories
        $countries__category.removeClass('active');
        $(this).addClass('active');
        // hide all sliders
        $countries__slider.addClass('hidden').removeClass('active');
        // update current slider instance
        // currentSliderInstance.reinit();
        // show current slider
        $currentSlider.removeClass('hidden').addClass('active');
      });
    });


    var $detailArea = $countries__slider.find('.country-block__detail');

    // countries detail button on click action
    $detailArea.on('click', function(){
      var $countryBlock = $(this).closest('.country-block');
      var countryCode = $countryBlock.data('country-code');

      // находим нужную для раскрытия таблицу
      var $coutryTableCurrent = $countries__tables.find(`.table--country-${countryCode}`);
      // находим открытую в настоящий момент таблицу
      var $coutryTableActive = $countries__tables.find('.table--country.active');


      function beforeLoadData(){

        if ($coutryTableActive) {
          // Получаем высоту первоначального контента и фиксируем её у родителя
          // для последующей анимации до высоты результирующего контейнера
          var primaryContentHeight = $countries__tablesContent.outerHeight();
          $countries__tables.css('height', primaryContentHeight);
        }
          scrollToData($countries__tables);
        // скрываем контейнер с контентом и включаем прелоадер
        $countries__tablesContent.fadeOut(sendTransitionTime, function(){
          // включаем прелоадер
          $countries__preloader.fadeIn(sendTransitionTime/2, function(){
            // тут выполняем действия в результате полученного аякс-ответа
            $countries__table.removeClass('active');
            // включаем нужную нам таблицу
            $coutryTableCurrent.addClass('active');
          });

        });

      }
      function scrollToData($el){

        // var query = ( Modernizr.touchevents && Modernizr.mq('(max-height: 767px)') ) || Modernizr.mq('(max-height: 767px)');
        var query = Modernizr.touchevents;

         TweenMax.to(window, 1, {
           scrollTo: {
             y: $el.offset().top,
             offsetY: 30
           },
           ease: Power1.easeOut,
           delay: 0.5,
         });

      }
      function afterLoadData(){
        // получаем высоты контента контейнера с успешными данными о заявке
        var successContainerHeight = $countries__tablesContent.actualHeight(true);

        // скрываем прелоадер
        $countries__preloader.fadeOut();
        // анимируем контейнер до вычисленной высоты
        $countries__tables.smoothAnimate({
          height: successContainerHeight
        },{
            duration: 400,
            easing: 'ease',
            complete: function () {

                // убираем статичную высоту
                $countries__tables.css('height', 'auto');

                // раскрываем контейнер с контентом
                $countries__tablesContent.fadeIn();

            }
        });
      }

      beforeLoadData();
      setTimeout(afterLoadData,sendTransitionTime+400);

    });

  }
});
