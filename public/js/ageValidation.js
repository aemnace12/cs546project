document.addEventListener('DOMContentLoaded', () => {
    const form     = document.getElementById('age-form');
    const ageInput = document.getElementById('age');
    const errorDiv = document.getElementById('age-error');
  
    form.addEventListener('submit', (e) => {
      errorDiv.textContent = '';
  
      const value = ageInput.value.trim();
      const age   = parseInt(value, 10);
  
      if (!value) {
        e.preventDefault();
        errorDiv.textContent = 'Please enter your age.';
        return;
      }
  
      if (isNaN(age) || age < 1 || age > 130) {
        e.preventDefault();
        errorDiv.textContent = 'Enter a valid number between 1 and 130.';
        return;
      }
  
      if (age < 14) {
        e.preventDefault();
        errorDiv.textContent = 'You must be at least 14 years old to enter.';
        return;
      }
  
    });
  });