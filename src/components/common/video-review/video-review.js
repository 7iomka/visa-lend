import "vendors/lazyYT.custom";

domready(function () {
  exports.init = function () {
    if ($('.reviewYT').length) {
      $('.reviewYT').lazyYT('AIzaSyDTvkd_fXoqr3v0T4ad4EyV4s6vgKJmqYM', {
          youtube_parameters: 'rel=0&controls=1&showinfo=0',
      });
    }
  }
});
