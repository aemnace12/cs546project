document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('btn-back-to-spot');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        const id = backBtn.dataset.id;
        if (id) window.location.href = `/vacation/${id}`;
      });
    }
  });