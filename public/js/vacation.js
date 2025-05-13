document.addEventListener('DOMContentLoaded', () => {
    const imageover = document.querySelector('.spot-imageover');
    if (imageover) {
      const img      = imageover.querySelector('.spot-image');
      const imageUrl = imageover.dataset.image;
      if (img && imageUrl) img.src = imageUrl;
    }
  
    const createBtn = document.getElementById('btn-create-review');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        const id = createBtn.dataset.id;
        if (id) window.location.href = `/review/createreview/${id}`;
      });
    }

    document.querySelectorAll('.btn-view-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (id) window.location.href = `/review/${id}`;
      });
    });
  
    document.querySelectorAll('.recommendation-item').forEach(card => {
      const img     = card.querySelector('.recommendation-image');
      const imageUrl= card.dataset.image;
      if (img && imageUrl) img.src = imageUrl;
  
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        if (id) window.location.href = `/vacation/${id}`;
      });
    });
  });