document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.review-item').forEach(item => {
        if (!item.dataset.userId) {
            item.querySelectorAll('.btn-like, .btn-dislike')
                .forEach(btn => btn.disabled = true);
          }
        });
  
    async function sendVote(reviewId, type) {
      const res = await fetch(`/review/${reviewId}/${type}`, { method: 'POST', credentials: 'same-origin'});
      if (!res.ok) throw new Error('Vote failed');
      return res.json(); // { likes, dislikes }
    }
  
    document.querySelectorAll('.btn-like, .btn-dislike').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const container = btn.closest('.review-item');
        if (!container) {
            console.error('Could not find .review-item parent for vote button');
            return;
          }
        const reviewId = btn.dataset.id;
        const isLike   = btn.classList.contains('btn-like');
        try {
          const { likes, dislikes } = await sendVote(reviewId, isLike ? 'like' : 'dislike');
          
          // update both counts
          container.querySelector('.like-count').textContent    = likes;
          container.querySelector('.dislike-count').textContent = dislikes;
          // reset button states
          container.querySelectorAll('.btn-like, .btn-dislike').forEach(b => b.classList.remove('voted'));
          btn.classList.add('voted');
        } catch (error) {
          console.error('Voting error:', error);
        }
      });
    });
  });