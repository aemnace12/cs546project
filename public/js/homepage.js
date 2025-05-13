document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.destination-card').forEach(card => {
      const img       = card.querySelector('.destination-image');
      const imageUrl  = card.dataset.image;
      const name      = card.dataset.name;
      img.src         = imageUrl;
      img.alt         = name;
  
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        if (id) {
          window.location.href = `/vacation/${id}`;
        }
      });
    });
  });