document.addEventListener('DOMContentLoaded', () => {
    const shareBtn  = document.getElementById('share-btn');
    const shareMenu = document.getElementById('share-menu');
    const url       = encodeURIComponent(window.location.href);
    const textEl    = document.querySelector('.review-text');
    const text      = textEl ? encodeURIComponent(textEl.innerText.trim()) : '';
  
    const twitterUrl  = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    const redditUrl   = `https://www.reddit.com/submit?url=${url}&title=${text}`;
  
    document.getElementById('twitter-share').href  = twitterUrl;
    document.getElementById('facebook-share').href = facebookUrl;
    document.getElementById('reddit-share').href   = redditUrl;
  
    shareBtn.addEventListener('click', () => {
      shareMenu.classList.toggle('visible');
    });
  
    shareMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        window.open(
          link.href,
          'shareWindow',
          'width=600,height=400,menubar=no,toolbar=no'
        );
        shareMenu.classList.remove('visible');
      });
    });
  
    document.addEventListener('click', e => {
      if (
        !shareMenu.contains(e.target) &&
        e.target !== shareBtn
      ) {
        shareMenu.classList.remove('visible');
      }
    });
  });