document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.review-item').forEach(item => {
      const reviewId = item.dataset.reviewId;
      const userId   = item.dataset.userId;
      // highlight existing vote
      if (userId) {
        const votedLike    = item.dataset.likedBy?.includes(userId);
        const votedDislike = item.dataset.dislikedBy?.includes(userId);
        if (votedLike)    item.querySelector('.btn-like').classList.add('voted');
        if (votedDislike) item.querySelector('.btn-dislike').classList.add('voted');
      }
    });
  
    async function sendVote(reviewId, type) {
      const res = await fetch(`/reviews/${reviewId}/${type}`, { method: 'POST' });
      if (!res.ok) throw new Error('Vote failed');
      return res.json(); // { likes, dislikes }
    }
  
    document.querySelectorAll('.btn-like, .btn-dislike').forEach(btn => {
      btn.addEventListener('click', async () => {
        const reviewId = btn.dataset.id;
        const isLike   = btn.classList.contains('btn-like');
        try {
          const { likes, dislikes } = await sendVote(reviewId, isLike ? 'like' : 'dislike');
          const container = btn.closest('.review-item');
          // update both counts
          container.querySelector('.like-count').textContent    = likes;
          container.querySelector('.dislike-count').textContent = dislikes;
          // reset button states
          container.querySelectorAll('.btn-like, .btn-dislike').forEach(b => b.classList.remove('voted'));
          btn.classList.add('voted');
        } catch (e) {
          console.error(e);
        }
      });
    });
  });