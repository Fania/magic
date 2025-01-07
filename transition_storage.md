let lastClickX, lastClickY;
document.addEventListener('click', (event) => {
  if (event.target.tagName.toLowerCase() === 'a') return;
  lastClickX = event.clientX;
  lastClickY = event.clientY;
});

// Write position to storage on old page
window.addEventListener('pageswap', (event) => {
  if (event.viewTransition && lastClick) {
    sessionStorage.setItem('lastClickX', lastClickX);
    sessionStorage.setItem('lastClickY', lastClickY);
  }
});

// Read position from storage on new page
window.addEventListener('pagereveal', (event) => {
  if (event.viewTransition) {
    lastClickX = sessionStorage.getItem('lastClickX');
    lastClickY = sessionStorage.getItem('lastClickY');
  }
});