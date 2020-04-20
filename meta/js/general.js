// LOADING ICON
const loadDiv = document.getElementById('loading');
loadDiv.classList.add('show')
window.addEventListener('load', () => loadDiv.classList.remove('show') );
// const loadTriggers = document.querySelectorAll('[type="submit"]');
// loadTriggers.forEach(lt => 
//   lt.addEventListener('click', () => loadDiv.classList.add('show')));





// DISPLAY DATA
async function getData() {
  let response = await fetch('http://localhost:3000/data')
  let data = await response.json()
  for (let i in data.rows) {
    const elem = data.rows[i].doc
    squares.insertAdjacentHTML('beforeend',elem.quadvertex.svg)
  }
}
getData()