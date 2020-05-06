'use strict';

const [...menuTriggers] = document.querySelectorAll('nav a');
const [...displayStyles] = document.getElementsByName('displayStyle');
const [...displayAmounts] = document.getElementsByName('displayAmount');
const displayOrder = document.getElementById('order');
const loadingTriggers = (menuTriggers.concat(displayStyles,displayOrder,displayAmounts)).flat(Infinity);
const displayTriggers = (displayStyles.concat(displayOrder,displayAmounts)).flat(Infinity);
const unique = document.getElementById('unique');
const all = document.getElementById('all');
const opt = document.getElementById('order4quadOptions');


// LOADING ICON TRIGGERS
loadingTriggers.forEach( lt => 
  lt.addEventListener('change', () => loading.classList.add('show') )
);

// DISPLAY TRIGGERS
displayTriggers.forEach( ds => {
  ds.addEventListener('change', () => { 
    displaySVGs(getCurrent('order'),getCurrent('style'));
  });
});













// default
displaySVGs( getCurrent('order'),getCurrent('style') );


// DISPLAY DATA
async function displaySVGs(order,style) {
  try {
    let offset = 0;
    squares.innerHTML = '';
    await getData(order,style,offset);
  } catch (error) { console.log(error) }
  finally { 
    loading.classList.remove('show');
  }
}


async function getData(order,style,offset) {
  try {
    // console.log(`Loading squares ${offset} - ${offset + 200}`);
    // fix order 4 unique/all choice subsubmenu
    if (order === '4' && style === 'quadvertex' && unique.checked) 
      style = 'unique';
    if (order === '4' && style === 'quadvertex' && all.checked) 
      style = 'quadvertex';
    (order === '4' && (style === 'quadvertex' || style === 'unique'))
      ? opt.classList.remove('hide')
      : opt.classList.add('hide');
    const url = `http://localhost:3000/data/${order}/${style}/${offset}`;
    const rawData = await fetch(url);
    const data = await rawData.json();
    for (let i in data.rows) {
      const elem = data.rows[i].value.svg;
      squares.insertAdjacentHTML('beforeend',elem);
    }
    // only add sentinel if we have more results left
    if(data.rows.length === 200) {
      const io = new IntersectionObserver(
        entries => {
          if(entries[0].isIntersecting) {
            // console.log(entries[0].target, entries[0]);
            offset += 200;
            getData(getCurrent('order'),getCurrent('style'),offset);
            io.unobserve(entries[0].target);
          }
        },{}
      );
      const sentinel = document.createElement('div');
      sentinel.classList.add(`sentinel${offset}`);
      squares.appendChild(sentinel);
      io.observe(sentinel);
    }
  } catch (error) { console.log(error) }
}










function getCurrent(thing) {
  switch (thing) {
    case 'style':
      return document.querySelector('input[name="displayStyle"]:checked').id;
    case 'order':
      return displayOrder[displayOrder.selectedIndex].value;
    case 'amount':
      return document.querySelector('input[name="displayAmount"]:checked').id;
  }
}




displayOrder.addEventListener('wheel', () => {
  const totalOptions = displayOrder.length;
  let fromIndex = displayOrder.selectedIndex;
  if (Math.sign(event.deltaY) === 1) {
    let toIndex = (fromIndex + 1) % totalOptions;
    displayOrder.selectedIndex = toIndex;
  } else {
    if (fromIndex === 0) fromIndex = 18;
    let toIndex = (fromIndex - 1) % totalOptions;
    displayOrder.selectedIndex = toIndex;
  }
  loading.classList.add('show')
  displaySVGs(getCurrent('order'),getCurrent('style'));
  event.preventDefault();
})









// setTimeout(function(){




//   const x = document.querySelector('svg#numbers-4-5');
//   // console.dir(x);

//   // console.log(x.children);
//   for (let child of x.children) {

//     console.dir(child);
//     console.log(child.attributes.x.value);
//     console.log(child.attributes.y.value);
//     console.log(child.innerHTML);






//   };



// }, 500); 