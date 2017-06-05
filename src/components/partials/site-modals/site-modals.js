// validation library
import 'jquery-validation';
// custom validator settings
import 'vendors/jquery.validator-custom';

import 'jquery.inputmask';
// Add extensions as necessary make sure you remember to add the corresponding aliases in the webpack config
import 'inputmask.numeric.extensions';

domready(function () {
  exports.init = function () {
    /********************************** SETTINGS FOR ALL FORMS in MODAL *************************************/
    var $actionModal = $('.action-modal');

    $actionModal.each(function() {
        var $this = $(this),
            $form = $(this).find('.form'),
            $action_id = $this.attr('id');

        // предотвращаем отправку формы
        $form.submit(function(e) {
            e.preventDefault();
        });

        var rules = {},
            messages = {};

        var namespaces = ["user_name", "user_phone"];

        $.each(namespaces, function(i, namespace) {
            var $form_elements = $form.find('input[name^="' + namespace + '"], textarea[name^="' + namespace + '"]');

            $form_elements.each(function() {
                var elem_name = $(this).attr('name');
                var message;

                switch (namespace) {
                    case "user_name":
                        message = "Заполните Ваше имя";
                        break;
                    case "user_phone":
                        message = "Не указан телефон";
                        break;
                    // case "user_email":
                    //     message = "Укажите корректный email";
                    //     break;
                    default:
                        message = "Заполните данное поле";
                        break;
                }
                rules[elem_name] = {
                    required: !$(this).hasClass('optional')
                };
                if (namespace === 'user_phone') {
                    $('input[name^="' + namespace + '"]').inputmask("+7 (999) 999-9999");
                    rules[elem_name].usPhoneFormat = true;
                }

                if (namespace === 'user_email') {
                  rules[elem_name].email = (namespace === 'user_email');
                }
                messages[elem_name] = {
                    required: message
                }

            });

        })
        // console.log(rules, messages);
        $form.validate({
            rules: rules,
            messages: messages,
            ignore:'input[type="date"],input[type="time"]',
            highlight: function (element) {
               $(element).closest('.form-group').removeClass('has-success').addClass('has-danger');
               $(element).removeClass('form-control-success').addClass('form-control-danger');
             },
             unhighlight: function (element) {
                 $(element).closest('.form-group').removeClass('has-danger').addClass('has-success');
                 $(element).removeClass('form-control-danger').addClass('form-control-success');

             },
           errorClass: 'form-control-feedback',
           errorPlacement: function (error, element) {
               if (element.parent('.input-group').length) {
                   error.insertAfter(element.parent());
               } else {
                   error.insertAfter(element);
               }
           },
            submitHandler: function(form) {
                submitModalForm(form, $action_id);
            }
        });

    });
    function submitModalForm(form, task) {
        // форма
        var $form = $(form);

        // в какой модалке находится
        var $formModal = $form.closest('.action-modal');


        // значения элементов формы
        // var name            = $form.find("#user_name--order").val();
        // var phone           = $form.find("#user_phone--order").val();
        // var email           = $form.find("#user_email--order").val();
        // var comments        = $form.find("#user_comments--order").val();

        // прочие элементы контейнера
        var $modalTitle            = $formModal.find('.action-modal__title');
        var $modalContent          = $formModal.find('.action-modal__content');
        var $modalAnnonce          = $formModal.find('.action-modal__annonce');

        var $modalPrimaryContainer = $formModal.find('.primary-container');

        var $modalPreloader        = $formModal.find('.preloader');

        var $modalSuccessContainer = $formModal.find('.success-container');

        var $modalResetButton      = $formModal.find('.modal__button-close');
        var $finalData             = $modalSuccessContainer.find('.final-data');

        // время анимации при переключении видимости контейнеров
        var sendTransitionTime = 400;




        // Хешируем перезаписываемые элементы контейнера модалки
        var primaryData = {
          $modalTitle: $modalTitle.html(),
          $modalAnnonce: $modalAnnonce.html(),
          primaryContentHeight: false
        };







        /*  prepare serialized array for the addition of a form type identifier  */
        var form_data = $(form).serializeArray();
        // for php data
        form_data.push({name: "task", value: task});
        form_data = $.param(form_data);

        // для заказа пишем отдельную функцию (описана ниже или в отдельном файле)
        if (task === 'action-order') {

            sendOrder();
            // return;
        } else {
          // для всех остальных модалок
            $.ajax({
                url: localProxy + '/ajax.php',
                type: 'POST',
                data: form_data,

                beforeSend: function(r) {
                    // $form.hide();
                    // $modalTitle.html('Отправка заявки...');
                    // $modalAnnonce.html('');
                    // **************************

                    // Получаем высоту первоначального контента (формы) и фиксируем её у родителя
                    // для последующей анимации до высоты результирующего контейнера
                    var primaryContentHeight = $modalPrimaryContainer.outerHeight();
                    // сохраняем значение
                    primaryData.primaryContentHeight = primaryContentHeight;

                    $modalContent.css('height', primaryContentHeight);

                    // промежуточный заголовок
                    $modalTitle.html('Идет отправка...');
                    // скрываем котнейнер с формой
                    $modalPrimaryContainer.fadeOut(sendTransitionTime, function(){
                      // включаем прелоадер
                      $modalPreloader.fadeIn();
                      // тут выполняем действия в результате полученного аякс-ответа
                    });

                }
            }).always(function(r) {

            }).done(function(r) {

                // последние действия
                function finalActions(){

                  // обновляем заголовок
                  $modalTitle.text('Ваша заявка оформлена');


                  // получаем высоты контента контейнера с успешными данными о заявке
                  var modalSuccessContainerHeight = $finalData.actualHeight(true);
                  // анимируем контейнер до вычисленной высоты
                  $modalContent.smoothAnimate({
                    height: modalSuccessContainerHeight
                  },{
                      duration: 600,
                      easing: 'ease',
                      complete: function () {
                          // скрываем прелоадер
                          $modalPreloader.fadeOut();
                          // убираем статичную высоту
                          $modalContent.css('height', 'auto');
                          // отображаем данные о заявке
                          $finalData.fadeIn();

                      }
                  })
                }
                // выполняем эти действия не раньше чем скроется первоначальный контейнер
                setTimeout(finalActions, sendTransitionTime);

                // действия сброса формы
                function resetDataActions() {
                  // ресетим форму
                  $form.trigger('reset');
                  // удаляем все классы с полей по отношению к заполненности
                  $form.find('.form-group').removeClass('has-success has-danger');
                  $form.find('.form-control').removeClass('form-control-success form-control-danger');

                  // обновляем заголовок
                  $modalTitle.html(primaryData.$modalTitle);
                  $modalAnnonce.html(primaryData.$modalAnnonce);

                  /**
                   * Простой сброс формы (сброс данных в фоне)
                   */

                   // скрываем данные о заявке
                   $finalData.fadeOut(sendTransitionTime);
                   $modalPrimaryContainer.fadeIn(sendTransitionTime);

                  /**
                   * Красивый сброс формы (не актуален)
                   */
                  /*
                     // включаем прелоадер
                      $modalPreloader.fadeIn(sendTransitionTime);
                      // скрываем данные о заявке
                      $finalData.fadeOut(sendTransitionTime);

                      var primaryContentHeight = primaryData.primaryContentHeight || $modalPrimaryContainer.outerHeight();

                      // $modalContent.css('height', primaryContentHeight);
                      $modalContent.smoothAnimate({
                        height: primaryContentHeight
                      },{
                          duration: 600,
                          easing: 'ease',
                          complete: function () {
                            // выключаем прелоадер
                            $modalPreloader.fadeOut();
                            // показываем котнейнер с формой
                            $modalPrimaryContainer.fadeIn(sendTransitionTime, function(){
                              // убираем статичную высоту
                              $modalContent.css('height', 'auto');
                            });
                          }
                      });
                    */


                }


                // вешаем событие преждевременного одноразового сброса на кнопку возврата к сайту
                $modalResetButton.one('click', function () {
                  resetDataActions();
                });

                $(document).one('afterClose.fb', function( e, instance, slide ) {

                  var $modalSource = $(instance.current.src);
                  if ($modalSource.is($formModal)) {
                    resetDataActions();
                  }
                });


            }).fail(function(request, textStatus, errorThrown) {
                // alert('fail');
                console.log(request.responseText);
                console.log(textStatus);
                console.log(errorThrown);
            });

        } // end else

    };


    /** ЭТУ ФУНКЦИЮ МОЖНО БУДЕТ ВЫНЕСТИ **/
    function sendOrder(){

        // модальное окно заказа
        var $orderModal     = $('#action-order');
        // форма
        var $orderModalForm = $orderModal.find('.form');
        // значения элементов формы
        var name            = $orderModalForm.find("#user_name--order").val();
        var phone           = $orderModalForm.find("#user_phone--order").val();
        var comments           = $orderModalForm.find("#user_comments--order").val();
        var from = $orderModalForm.find("#user_from--order").val();
        var to = $orderModalForm.find("#user_to--order").val();
        var dateStart = $orderModalForm.find("#user_date-start--order").val();
        var dateFinish = $orderModalForm.find("#user_date-finish--order").val();
        var weight = $orderModalForm.find("#user_weight--order").val();
        var dimensions = $orderModalForm.find("#user_dimensions--order").val();

        // прочие элементы контейнера
        var $orderModalTitle            = $orderModal.find('.action-modal__title');
        var $orderModalContent          = $orderModal.find('.action-modal__content');
        var $orderModalAnnonce          = $orderModal.find('.action-modal__annonce');
        var $orderModalPrimaryContainer = $orderModal.find('.primary-container');

        var $orderModalResetButton = $orderModal.find('.modal__button-close');

        var $orderModalPreloader        = $orderModal.find('.preloader');

        var $orderModalSuccessContainer = $orderModal.find('.success-container');
        var $orderData                  = $orderModalSuccessContainer.find('.order-data');


        // время анимации при переключении видимости контейнеров
        var sendTransitionTime = 400;




        //alert(material_depth);
        var err = true;

        // Хешируем перезаписываемые элементы контейнера модалки для их восстановления после сброса
        var primaryData = {
          $orderModalTitle: $orderModalTitle.html(),
          $orderModalAnnonce: $orderModalAnnonce.html(),
          orderModalPrimaryContentHeight: false
        };

        //alert(material + " " + material_type);return;
        $.ajax({
          url: localProxy + '/ajax.php',
          dataType: 'json',
          type: 'POST',
          data: {
            task: "action-order",
            user_name: name,
            user_phone: phone,
            user_comments: comments,
            user_from: from,
            user_date_start: dateStart,
            user_date_finish: dateFinish,
            user_weight: weight,
            user_dimensions: dimensions
          },
          timeout: 30000,
          beforeSend: function() {

            // Получаем высоту первоначального контента (формы) и фиксируем её у родителя
            // для последующей анимации до высоты результирующего контейнера
            var orderModalPrimaryContentHeight = $orderModalPrimaryContainer.outerHeight();
            // сохраняем значение
            primaryData.orderModalPrimaryContentHeight = orderModalPrimaryContentHeight;
            $orderModalContent.css('height', orderModalPrimaryContentHeight);



            // промежуточный заголовок
            $orderModalTitle.html('Идет отправка...');
            // скрываем котнейнер с формой
            $orderModalPrimaryContainer.fadeOut(sendTransitionTime, function(){
              // включаем прелоадер
              $orderModalPreloader.fadeIn();
              // тут выполняем действия в результате полученного аякс-ответа
            });

          }
        })
        .done(function(data) {
          err = false;

          if (data.is_err == 0) {
            // финальные действия
            function finalActions(){

              // обновляем заголовок
              $orderModalTitle.text('Ваша заявка оформлена');


              // получаем высоты контента контейнера с успешными данными о заказе
              var orderModalSuccessContainerHeight = $orderData.actualHeight(true);
              // анимируем контейнер до вычисленной высоты
              $orderModalContent.smoothAnimate({
                height: orderModalSuccessContainerHeight
              },{
                  duration: 600,
                  easing: 'ease',
                  complete: function () {
                      // скрываем прелоадер
                      $orderModalPreloader.fadeOut();
                      // убираем статичную высоту
                      $orderModalContent.css('height', 'auto');
                      // отображаем данные заказа
                      $orderData.fadeIn();
                  }
              });
              window.orderReady = true;

            }
            // выполняем эти действия не раньше чем скроется первоначальный контейнер
            setTimeout(finalActions, sendTransitionTime);

            // функция сброса данных
            function resetDataActions() {
                // ресетим форму
                $orderModalForm.trigger('reset');
                // удаляем все классы с полей по отношению к заполненности
                $orderModalForm.find('.form-group').removeClass('has-success has-danger');
                $orderModalForm.find('.form-control').removeClass('form-control-success form-control-danger');

                // обновляем заголовок
                $orderModalTitle.html(primaryData.$orderModalTitle);
                $orderModalAnnonce.html(primaryData.$orderModalAnnonce);

                /**
                 * Простой сброс формы (сброс данных в фоне)
                */
                // скрываем данные о заявке
                $orderData.fadeOut(sendTransitionTime);
                // показываем котнейнер с формой
                $orderModalPrimaryContainer.fadeIn(sendTransitionTime);

                /**
                 * Красивый сброс формы (не актуален)
                */
                /*
                    // включаем прелоадер
                    $orderModalPreloader.fadeIn(sendTransitionTime);
                    // скрываем данные о заявке
                    $orderData.fadeOut(sendTransitionTime);

                    var orderModalPrimaryContentHeight = primaryData.orderModalPrimaryContentHeight || $orderModalPrimaryContainer.outerHeight();

                    // $modalContent.css('height', primaryContentHeight);
                    $orderModalContent.smoothAnimate({
                      height: orderModalPrimaryContentHeight
                    },{
                        duration: 600,
                        easing: 'ease',
                        complete: function () {
                          // выключаем прелоадер
                          $orderModalPreloader.fadeOut();
                          // показываем котнейнер с формой
                          $orderModalPrimaryContainer.fadeIn(sendTransitionTime, function(){
                            // убираем статичную высоту
                            $orderModalContent.css('height', 'auto');
                          });
                        }
                    });
                */

            }

            // по закрытию модалки любым из способов делать ряд действий
            $(document).one('afterClose.fb', function( e, instance, slide ) {
              var $modalSource = $(instance.current.src);
              if ($modalSource.is($orderModal)) {
                // если данные о заказе выданы (заказ совершен)
                if(window.orderReady) {
                  // сбрасываем форму
                  resetDataActions();
                } else {
                  // ничего не делать
                  e.preventDefault();
                  return false;
                }
              }
            });

          } else {
            console.log(data.is_err, 'data.is_err');
          }
          //return(data);

        })
        .fail(function(request, textStatus, errorThrown) {
          if (err == true) {

            console.log(request.responseText);
            console.log(textStatus);
            console.log(errorThrown);

          }
        })
        .always(function() {
          //  alert('always');
          if (err == true) {
            //alert(data.err);
            //$('#button_order').show('slow');
            //  $('#button_order').attr('disabled',false);
            //  $('#button_order').attr('value','Отправить');
          }
        })




    }


  }
});
