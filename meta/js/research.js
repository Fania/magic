'use strict';


getData();



const classification = document.getElementById('classification');
classification.addEventListener('change', () => {
  console.log('classification change triggered');
  let x = classification[classification.selectedIndex].value;
  console.log(x);
  filterSquares(x);
});




// // POPULATE LENGTHS OPTIONS
// const lengths = document.getElementById('lengths');
// // populateLengthOptions();
// async function populateLengthOptions() {
//   console.log('populateLengthOptions');
//   try {
//     const settings = getSettings();
//     const order = settings.order;
//     const url = `/data/lengths`;
//     const rawData = await fetch(url);
//     const data = await rawData.json();
//     lengths.innerHTML = '<option value="">Choose</option>';
//     for (let i in data.rows) {
//       const len = data.rows[i].key;
//       const num = data.rows[i].value.length;
//       const option = document.createElement('option');
//       option.value = len;
//       option.innerText = `${len} (${num})`;
//       lengths.appendChild(option);
//     }
//     // updateCache(settings);
//   } catch (error) { console.log(error) }
// }
// async function prepareLengthOptions() {
//   console.log('prepareLengthOptions');
//   try {
//     for (let i in data.rows) {
//       const len = data.rows[i].key;
//       const num = data.rows[i].value.length;
//       const option = document.createElement('option');
//       option.value = len;
//       option.innerText = `${len} (${num})`;
//       lengths.appendChild(option);
//     }
//     // updateCache(settings);
//   } catch (error) { console.log(error) }
// }








function filterSquares(c) {

  const squares = document.querySelectorAll(`#squares svg`);
  const matches = document.querySelectorAll(`#squares svg.${c}`);

  squares.forEach( sq => { sq.classList.add('hide') });
  matches.forEach( sq => { sq.classList.remove('hide') });

  if (c == 'all') squares.forEach( sq => { sq.classList.remove('hide') });

}








async function getData(offset = 0) {
  try {

    if(offset === 0) squares.innerHTML = '';
    document.body.style.cursor = 'wait !important';
    const url = `/data/4/quadvertex/${offset}`;
    const rawData = await fetch(url);
    const data = await rawData.json();
    for (let i in data) {
      const elem = data[i].svg;
      squares.insertAdjacentHTML('beforeend',elem);
    }
    if(data.length === 200) {
      const io = new IntersectionObserver(
        entries => {
          if(entries[0].isIntersecting) {
            offset += 200;
            getData(offset);
            io.unobserve(entries[0].target);
          }
        },{}
      );
      const sentinel = document.createElement('div');
      sentinel.classList.add(`sentinel${offset}`);
      squares.appendChild(sentinel);
      io.observe(sentinel);
    }
  } 
  catch (error) { console.log('getData', error) }
  finally { 
    // loading.classList.remove('show'); 
    document.body.style.cursor = 'default !important'; 
  }
}





// FULLSCREEN OPTIONS

document.addEventListener("keydown", event => {
  if (event.key === "i") {
    const elems = document.querySelectorAll("header, footer");
    elems.forEach(e => {
      e.classList.toggle('hide');
    });
  }
});
