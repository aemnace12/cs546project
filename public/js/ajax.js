// do not touch anything in this file
(function($) {
    $('#comment-form').on('submit', function(event) {
      event.preventDefault();
  
      const reviewId = $('#reviewId').val();
     
      const comment  = $('#comment').val().trim();
      //console.log('AjAXtriggered:', { reviewId, comment });
  
    
      if (comment.length < 3 || comment.length > 500) {
        return $('#comment-error').text('Comment must be between 3 and 500 characters.');
      }
  
      $.ajax({
        url: `/review/${reviewId}/comment`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ comment })
      })
      .done(function(comments) {
       
        $('#comment-error').empty();
        $('#comment').val('');
  
        
        const $list = $('#commentsList').empty();
        if (comments.length > 0) {
          for (let i = 0; i < comments.length; i++) {
            const toAdd = comments[i];
            $list.append(`
              <li data-id="${toAdd._id}">
                <p>Comment: ${toAdd.comment}</p>
              </li>
            `);
          }
        } 
      })
    });
  })(jQuery);
  