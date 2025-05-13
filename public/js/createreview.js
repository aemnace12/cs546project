document.addEventListener('DOMContentLoaded', () => {
    const form     = document.getElementById('createreview-form');
    const backBtn  = document.getElementById('btn-back');
    const spotId   = form.dataset.id;
  
    form.action = `/review/createreview/${spotId}`;
  
    backBtn.addEventListener('click', () => {
      window.location.href = `/vacation/${spotId}`;
    });
  });