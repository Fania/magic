// LOADING ICON
loading.classList.add('show');
window.addEventListener('load', () => loading.classList.remove('show') );
// const loadTriggers = document.querySelectorAll('[type="submit"]');
// loadTriggers.forEach(lt => 
//   lt.addEventListener('click', () => loadDiv.classList.add('show')));





// DISPLAY DATA
async function displaySVGs(target) {
  console.log(`Showing ${target}`);
  squares.innerHTML = '';
  let response = await fetch(`http://localhost:3000/${target}`);
  let data = await response.json();
  for (let i in data.rows) {
    const elem = data.rows[i].doc;
    squares.insertAdjacentHTML('beforeend',elem.quadvertex.svg);
  }
  
}



uniquesMenu.addEventListener('click', () => {
  uniquesMenu.classList.add('active');
  unfilteredMenu.classList.remove('active');
  displaySVGs('data/4/unique');
  event.preventDefault();
});
unfilteredMenu.addEventListener('click', () => {
  uniquesMenu.classList.remove('active');
  unfilteredMenu.classList.add('active');
  displaySVGs('data/4/all');
  event.preventDefault();
});

// default
displaySVGs('data/4/unique');