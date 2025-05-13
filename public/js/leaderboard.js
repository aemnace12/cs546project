document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.leaderboard-item').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        if (id) {
          window.location.href = `/vacation/${id}`;
        }
      });
    });
});