import 'vendors/swiper/swiper.jquery.min.js';
/** GSAP and it plugins **/
import "gsap";
import 'vendors/gsap/ScrollToPlugin';

domready(function () {
  exports.init = function () {
    // ----------------------------------------------------------------------------
    // Country slider
    // ----------------------------------------------------------------------------
    if ($('.countries .swiper-container').length) {
      $('.countries .swiper-container').each(function(){
        var slidesCount = $(this).find('.swiper-slide').length;
        var slidesPerView = 4;
        var slidesPerColumn = slidesCount > slidesPerView ? 2 : 1;
        var $wrapper = $(this).find('.swiper-wrapper');
        if (slidesCount < slidesPerView * slidesPerColumn) {
          $wrapper.addClass('justify-content-md-center');
        }
        var centeredSlides;

        var coutrySlider = new Swiper($(this), {
          // pagination: $(this).find('.swiper-pagination'),
          // paginationClickable: $(this).find('.swiper-pagination'),
          nextButton: $(this).closest('.countries__slider').find('.swiper-button-next'),
          prevButton: $(this).closest('.countries__slider').find('.swiper-button-prev'),
          slidesPerView: slidesPerView,
          slidesPerColumn: slidesPerColumn,
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
    }

    // ----------------------------------------------------------------------------
    // Actions for each responsive-table
    // ----------------------------------------------------------------------------
    var $tableCountry = $('.table--country');
    var $tableCountryConfig = {
      collapse: true
    };
    var isBinded = false;

    /**
     * setMaxHeight - учавствует в калькуляции высоты контента (при раскрытиии, ресайзе)
     * @param {jQuery} $el   - $toggler
     * @param {Boolean} reset [description]
     */
    function setMaxHeight($el, reset){
      var $toggler = $el;

      var $toggableArea = $toggler.closest('.table-row--body');
      var $toggableAreaActiveClassName = 'table-row--body-open';

      var $toggableAreaIsActive = $toggableArea.hasClass($toggableAreaActiveClassName);
      // если не включены зброс
      if (!reset) {
          // при ресайзе мониторим высоту контента раскрытых аккордеонов
          if($toggableAreaIsActive) {
            $toggableArea.css('max-height', '');
            var toggableAreaHeight = $toggableArea.actual('outerHeight');
            $toggableArea.css('max-height', toggableAreaHeight);
          }
          else {
            // в ином случае мониторим высоту тогглера
            $toggableArea.css('max-height', '');
            var togglerHeight = $toggler.actual('outerHeight');
            $toggableArea.css('max-height', togglerHeight);
          }
      } else {
        // при включенном сбросе обнуляем макс. высоту
        $toggableArea.css('max-height', '');
      }

    }

    /**
     * actionsForActiveTable - В этой функции биндятся или выключаются функции в зависимости от условий
     * @param  {jQuery} $activeTable [description]
     */
    function actionsForActiveTable($activeTable){
      var $toggler = $activeTable.find('.table-row--toggler');
      var query = Modernizr.mq('(min-width: 992px)');
      console.log('isQuery', query);
      if (query) {
          if (isBinded) {
            console.log('снимается онклик');
            $activeTable.off('click','.table-row--toggler', clickHandler);
            console.log('действия c стаблицей > 992px');
            $toggler.each(function () {
              setMaxHeight($(this),true);
            });
            isBinded = false;
          }

      } else {
        if (!isBinded) {
          console.log('навешивает онклик');
          $activeTable.on('click','.table-row--toggler', clickHandler);
          isBinded = true;
        }
        $toggler.each(function () {
          setMaxHeight($(this));
        });
      }
    }
    /**
     * clickHandler - Функция обработчик клика по тогллеру
     */
    function clickHandler(e){
      var $this = $(e.target).closest('.table-row--toggler');
      if (!$this) {
        return;
      }

      var $toggableArea = $this.closest('.table-row--body');

      var tempTogglerMaxHeight = $this.css('max-height');
      var temp$toggableAreaMaxHeight = $toggableArea.css('max-height');
      // !!! Сперва чтобы получить актуальную высоту уберём инлайновую макс. высоту
      $this.css('max-height', '');
      $toggableArea.css('max-height', '');

      // сделаем и сохраним рассчёты
      var togglerHeight = $this.actual('outerHeight');
      var toggableAreaHeight = $toggableArea.actual('outerHeight');
      var $toggableAreaActiveClassName = 'table-row--body-open';

      // возвратим прежнюю макс-высоту
      $this.css('max-height', tempTogglerMaxHeight);
      $toggableArea.css('max-height', temp$toggableAreaMaxHeight);


      // сохраняем значение активности кликабельной области для расчёта новой высоты
      var $toggableAreaIsActive = $toggableArea.hasClass($toggableAreaActiveClassName);
      // меняем класс на противоположный
      $toggableArea.toggleClass($toggableAreaActiveClassName);
      // анимируем контейнер до вычисленной ранее высоты (макс)
      $toggableArea.smoothAnimate({
        'max-height': $toggableAreaIsActive ? togglerHeight : toggableAreaHeight
      },{
          duration: 400,
          easing: 'ease',
      });

      if($tableCountryConfig.collapse){
        var $anotherToggableAreaActive = $tableCountry.find(`.${$toggableAreaActiveClassName}`).not($toggableArea);
        if($anotherToggableAreaActive.length){
          var $anotherToggler = $anotherToggableAreaActive.find('.table-row--toggler');
          // var tempAnotherTogglerMaxHeight = $anotherToggler.css('max-height');
          //  $anotherToggler.css('max-height', '');
          var anotherTogglerHeight = $anotherToggler.actual('outerHeight');
          //  $anotherToggler.css('max-height', tempAnotherTogglerMaxHeight);
          // var $anotherToggableAreaActiveHeight = $anotherToggableAreaActive.actual('outerHeight');

          $anotherToggableAreaActive.smoothAnimate({
            'max-height': anotherTogglerHeight
          },{
              duration: 400,
              easing: 'ease',
          });
          $anotherToggableAreaActive.removeClass($toggableAreaActiveClassName);
        }
      }



    }



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
        // hide last opened table
        $('.table--country.active').removeClass('active');
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


      function beforeLoadData(cb){
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
            // принимаем коллбек параметром чтобы после готовности (активности новой таблицы мы смогли забиндить евенты на неё)
            if (typeof(cb) !== 'undefined' && typeof(cb) === 'function') {
              cb($coutryTableCurrent);
            }
          });

        });

      }
      function scrollToData($el){
       // скролл к таблице с данными
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
        var successContainerHeight = $countries__tablesContent.actual( 'outerHeight', { includeMargin : true });

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

      // Стартует анимация, после активности нужной таблицы запускаются все евенты связанные с ней
      // выключаем isBinded так как переключаем на новую таблицу
      isBinded = false;
      beforeLoadData(actionsForActiveTable.bind(this,$coutryTableCurrent));
      // анимация окончания
      setTimeout(afterLoadData,sendTransitionTime+400);

    });

    /**
     * runActionsForActiveTable - запускает все события только для активной таблицы
     */
    function runActionsForActiveTable(){
      var $activeTable = $('.table--country.active');
      if ($activeTable) {
        actionsForActiveTable($activeTable);
      }
    }
    // resize events
    $(window).on('resize', _.debounce(runActionsForActiveTable, 250));
    $(window).on('orientationchange',runActionsForActiveTable);

  }
});
