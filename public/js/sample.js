//used to take up space for further use

(function ($) {
    $('#sortByFood').on('click', function (event) {
        event.preventDefault();
        $('#leaderboard').empty();

        let infoRequest = {
          method: 'GET',
          url: `/leaderboard/sortByFood`,
        };
    
        $.ajax(infoRequest).then(function () {
        
        });
      });
    })(window.jQuery);