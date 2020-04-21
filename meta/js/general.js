// LOADING ICON
const loadTriggers = document.querySelectorAll('nav a');
loadTriggers.forEach(lt => 
  lt.addEventListener('click', () => loading.classList.add('show') ) );





// DISPLAY DATA
async function displaySVGs(target,style) {
  console.log(`Showing ${target} in ${style} style`);
  squares.innerHTML = '';
  const rawData = await fetch(`http://localhost:3000/${target}`);
  const data = await rawData.json();
  for (let i in data.rows) {
    const elem = data.rows[i].doc;
    squares.insertAdjacentHTML('beforeend',elem[style].svg);
  }
  loading.classList.remove('show');
}

uniquesMenu.addEventListener('click', () => {
  uniquesMenu.classList.add('active');
  unfilteredMenu.classList.remove('active');
  const currentStyle = document.querySelector('[name="displayStyle"]:checked').id;
  displaySVGs('data/4/unique',currentStyle);
  event.preventDefault();
});
unfilteredMenu.addEventListener('click', () => {
  uniquesMenu.classList.remove('active');
  unfilteredMenu.classList.add('active');
  const currentStyle = document.querySelector('[name="displayStyle"]:checked').id;
  displaySVGs('data/4/all',currentStyle);
  event.preventDefault();
});

// default
displaySVGs('data/4/unique','quadvertex');






// RADIO STYLES

const displayStyle = document.getElementsByName('displayStyle');
displayStyle.forEach( dStyle => {
  dStyle.addEventListener("change", (ev) => { 
    displaySVGs('data/4/unique',ev.target.id);
  })
})
