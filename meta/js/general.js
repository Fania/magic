

if (document.querySelector('.contribute')) {
  // LOADING ICON
  const manualTrigger = document.querySelector('#manual');
  manualTrigger.addEventListener('submit', () => loading.classList.add('show'));
}



if (document.querySelector('.home')) {
  // LOADING ICON
  const menuTriggers = document.querySelectorAll('nav a');
  menuTriggers.forEach(lt => 
    lt.addEventListener('click', () => loading.classList.add('show') ) );


  // DISPLAY DATA
  async function displaySVGs(target,style) {
    console.log(`Showing ${target} in ${style} style`);
    squares.innerHTML = '';
    // ( target ) uniquesMenu.classList.add('active') : 
    // ( target ) unfilteredMenu.classList.remove('active') : 
    const rawData = await fetch(`http://localhost:3000/${target}`);
    const data = await rawData.json();
    for (let i in data.rows) {
      const elem = data.rows[i].doc;
      squares.insertAdjacentHTML('beforeend',elem[style].svg);
    }
    loading.classList.remove('show');
  }

  displaySVGs( 'data/4/unique', 'quadvertex' );

  uniquesMenu.addEventListener('click', () => {
    uniquesMenu.classList.add('active');
    unfilteredMenu.classList.remove('active');
    const currentStyle = document.querySelector('[name="displayStyle"]:checked').id;
    displaySVGs('data/4/unique', currentStyle);
    event.preventDefault();
  });
  unfilteredMenu.addEventListener('click', () => {
    uniquesMenu.classList.remove('active');
    unfilteredMenu.classList.add('active');
    const currentStyle = document.querySelector('[name="displayStyle"]:checked').id;
    displaySVGs('data/4/all', currentStyle);
    event.preventDefault();
  });


  // RADIO STYLES
  const displayStyle = document.getElementsByName('displayStyle');
  displayStyle.forEach( dStyle => {
    dStyle.addEventListener("change", (ev) => { 
      displaySVGs('data/4/unique', ev.target.id);
    })
  })

} /* end of home page only scripts */


// MANUAL INPUT
// const manual = document.getElementById('manual');
// const manualInput = document.getElementById('manualInput');
// manual.addEventListener('submit', () => {
//   console.log( manualInput.value );
//   // event.preventDefault();
// })

// console.log(  )



// GALLERY

