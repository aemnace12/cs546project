// do not touch anything in this file
(function ($) {
  $('#comment-form').on('submit', function (event) {
    event.preventDefault();

    const reviewId = $('#reviewId').val();
    const comment  = $('#comment').val().trim();

    if (comment.length < 3 || comment.length > 500) {
      return $('#comment-error').text('Comment must be between 3 and 500 characters.');
    }
    let requestConfig = {
      method: 'POST',
      url: `/review/${reviewId}/comment`,
      contentType: 'application/json',
      data: JSON.stringify({ comment })
    };
    $.ajax(requestConfig).then(function (comments) {
      $('#comment-error').empty();
      $('#comment').val('');
       $('#commentsList').empty();

      if (comments.length > 0) {
        for (let i = 0; i < comments.length; i++) {
          const toAdd = comments[i];
          $('#commentsList').append(`
            <li data-id="${toAdd._id}">
              <p>${toAdd.userId}: ${toAdd.comment}</p>
            </li>
          `);
        }
      
      } 
    });
  })
    
})(jQuery);