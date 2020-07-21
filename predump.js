// SERVER.js

// couch.getDBInfo()

// const localData = fs.readFileSync(`./data/source4.json`)
// const data = JSON.parse(localData)
// data.forEach( d => {
//   const coords = draw.getCoords(4,d)
//   const svgString = draw.prepareSVG(4,'colours',coords,0)
//   console.log(svgString)
// })



// couch.areThereChanges(12)






// async function setupOrder(n) {
//   await couch.areThereChanges(n)
//   const result = await generate.index(n)
//   await couch.populateDB(result, n)
// }
// setupOrder('4a')
// setupOrder(5)


// async function setupOrderLARGE(n) {
//   const sourceData = fs.readFileSync(`./data/source${n}.json`)
//   const data = JSON.parse(sourceData)
//   const len = data.length
//   const chunks = _.chunk(data, 1000)

//   const forLoop = async _ => {
//     console.log('Start async loop')
//     for (let i=0; i < chunks.length; i++) {
//       console.log('inside chunks loop', i, chunks[i].length)
//       const result = await generate.indexLARGE(n,chunks[i])
//       await couch.populateDBLARGE(result, n)
//     }
//     console.log('End async loop')
//   }
//   forLoop(chunks)
// }
// setupOrderLARGE('5a')



// async function initialiseAll() {
//   await setupOrder(3)
//   await setupOrder(4)
//   await setupOrder(5)
//   await setupOrder(6)
//   await setupOrder(7)
//   await setupOrder(8)
//   await setupOrder(9)
//   await setupOrder(10)
//   await setupOrder(11)
//   await setupOrder(12)
//   await setupOrder(13)
//   await setupOrder(14)
//   await setupOrder(15)
//   await setupOrder(16)
//   await setupOrder(17)
//   await setupOrder(18)
//   await setupOrder(19)
//   await setupOrder(20)
// }

// initialiseAll()



app.get('/data/:n', async (req, res) => {
  const order = req.params.n
  const data = await couch.viewAllDB(order)
  res.send( data )
})
// app.get('/data/lengths/:n(\\d+)/:s', async (req, res) => {
app.get('/data/lengths/:n/:s', async (req, res) => {
  const order = req.params.n
  const style = req.params.s
  const data = await couch.getSharedLengths(order,style)
  res.send( data )
})
app.get('/data/:n/source', async (req, res) => {
  const order = req.params.n
  res.sendFile(`./data/source${order}.json`, {root: './'})
})


// END OF SERVER.js





// HOME.js

// async function getData(offset = 0) {
//   try {
//     let order = getSettings().order;
//     let style = getSettings().style;
//     // TODO fix order 4 unique/all choice subsubmenu
//     const unique = document.getElementById('unique');
//     const all = document.getElementById('all');
//     if (order === 4 && style === 'quadvertex' && unique.checked) 
//       style = 'unique';
//     if (order === 4 && style === 'quadvertex' && all.checked) 
//       style = 'quadvertex';
//     (order === 4 && (style === 'quadvertex' || style === 'unique'))
//       ? document.getElementById('order4quadOptions').classList.remove('hide')
//       : document.getElementById('order4quadOptions').classList.add('hide');
//     console.log(`getData ${order} ${style} ${offset}`);
//     if(offset === 0) squares.innerHTML = '';
//     loading.classList.add('show'); 
//     const url = `/data/${order}/${style}/${offset}`;
//     const rawData = await fetch(url);
//     const data = await rawData.json();
//     for (let i in data.rows) {
//       const elem = data.rows[i].value.svg;
//       squares.insertAdjacentHTML('beforeend',elem);
//       if(!['numbers','blocks','circles','tetromino'].includes(style)) {
//         animationCSS(data.rows[i].id, order, style, 
//                              data.rows[i].value['length']);
//       }
//     }
//     // TODO add sntinel earlier, at 150 or so
//     // only add sentinel if we have more results left
//     if(data.rows.length === 200) {
//       const io = new IntersectionObserver(
//         entries => {
//           if(entries[0].isIntersecting) {
//             // console.log(entries[0].target, entries[0]);
//             offset += 200;
//             getData(offset);
//             io.unobserve(entries[0].target);
//           }
//         },{}
//       );
//       const sentinel = document.createElement('div');
//       sentinel.classList.add(`sentinel${offset}`);
//       squares.appendChild(sentinel);
//       io.observe(sentinel);
//       // enable overlap for new squares if checked
//       applyOverlap(getSettings().overlap === 'true' || getSettings().overlap);
//     }
//   } 
//   catch (error) { console.log(error) }
//   finally { loading.classList.remove('show'); }
// }


// IndexedDB
// function saveSettingsDB(settings) {
//   console.log('saveSettings to IDB via front end');
//   const request = indexedDB.open('magic', 1);
//   request.onerror = event => console.error(event.target.errorCode);
//   request.onupgradeneeded = event => {
//     const db = event.target.result;
//     db.createObjectStore('settings');
//   };
//   request.onsuccess = event => {
//     const db = event.target.result;
//     updateData(db, settings);
//   };
// }
// function updateData(db, settings) {
//   let tx = db.transaction(['settings'], 'readwrite');
//   let store = tx.objectStore('settings');
//   store.put(settings,1);
//   tx.oncomplete = () => { console.log('Updated settings in IDB') }
//   tx.onerror = event => console.error(event.target.errorCode);
// }


// END OF HOME.js




// COUCH.js


// getDBInfo()

//   console.log('statusCode:', res.statusCode);
//   console.log('headers:', res.headers);

//   res.on('data', (d) => {
//     log(d);
//   });

// }).on('error', (e) => {
//   console.error(e);
// });


// IS THIS NEEDED?
// async function getLatestID(order) {
//   try {
//     const db = nano.use(`index${order}`)
//     const dbList = await db.view('filter', 'arrays')
//     return dbList.rows.pop().key
//   } catch (error) { console.log( 'getLatestID:', error ) }
// }


// async function getDBInfo() {
//   try {
//     console.log('trying to get DB info')

//     const options = new URL(base)

//     // console.log(base)
//     // console.log(options)
//     const result = await myRequest(base)
//     if(result === 'data') console.log(result)
//     else console.log('oh no')

//   } 
//   catch (error) { console.log( 'getDBInfo:', error ) }
// }



// IS THIS NEEDED?
// CHECK IF DB IS AHEAD LOCAL
// async function areThereChanges(order) {
//   try {
//     // REMOTE STUFF
//     const remote = await nano.db.changes(`index${order}`, {include_docs: true})
//     const remoteObjects = remote.results.filter(res => ! res.id.includes('_design/'))
//     const remoteData = remoteObjects.map(r => r.doc.numbers.array).sort()
//     // LOCAL STUFF
//     const localFile = fs.readFileSync(`./data/source${order}.json`)
//     const localData = JSON.parse(localFile).sort()

//     console.log(`Are there changes for order ${order}? `, JSON.stringify(remoteData) !== JSON.stringify(localData))

//     if (JSON.stringify(remoteData) !== JSON.stringify(localData)) {
//       await getSourceChanges(order, remoteData, localData)
//     }
//   } catch (error) { console.log( 'areThereChanges:', error ) }
// }

// IS THIS NEEDED?
// async function getSourceChanges(order, remoteData, localData) {
//   try {
//     // get only changes from remote and add to local
//     const diffRL = _.differenceWith(remoteData, localData, _.isEqual)
//     if (diffRL.length > 0) {
//       const localFile = fs.readFileSync(`./data/source${order}.json`)
//       const data = JSON.parse(localFile)
//       diffRL.forEach(dr => data.push(dr))
//       data.sort()
//       fs.writeFileSync(`./data/source${order}.json`, JSON.stringify(data))
//     } else { console.log('Changes in local to be uploaded.') }
//   } catch (error) { console.log( 'getChanges:', error ) }
//   finally { console.log( 'Changes dealt with.' ) }
// }



async function populateDBLARGE(data, order) {
  try {
    console.log( `(Re-) Creating database for index${order}` )
    // bulk docs needs individual rev ids for updates
    // const info = await nano.db.list()

    // if (info.includes(`index${order}`)) { 
    //   await nano.db.destroy(`index${order}`)
    // }
    // await nano.db.create(`index${order}`)
    const db = nano.use(`index${order}`)

    let output = data
    // console.log(output[0])
    // output.push(getFilterDocs())
    // output.push(getReducerDocs())
    await db.bulk({docs: output}).then((body) => {
      // console.log(body);
    });
  } catch (error) { console.log( 'populateDBLARGE:', error ) }
  finally {
    console.log( '-------------------- END ---------------------' )
  }
}


// async function viewDB(order, design, view, offset=0) {
//   try {
//     const db = nano.use(`index${order}`)
//     const data = await db.view(design, view, { 
//       include_docs: false,
//       limit: 200,
//       skip: offset 
//     })
//     return data
//   } catch (error) { console.log( 'viewDB:', error ) }
// }


// IS THIS NEEDED?
async function populateDB(data, order) {
  try {
    console.log( `(Re-) Creating database for index${order}` )
    // bulk docs needs individual rev ids for updates
    const info = await nano.db.list()

    // CREATE IF NEW OR REUSE OLD
    // if (! info.includes(`index${order}`)) { 
    //   await nano.db.create(`index${order}`)
    // }
    // const db = nano.use(`index${order}`)

    // DELETE OLD AND CREATE NEW AND UPLOAD FROM SCRATCH
    if (info.includes(`index${order}`)) { 
      await nano.db.destroy(`index${order}`)
    }
    await nano.db.create(`index${order}`)
    const db = nano.use(`index${order}`)

    let output = data
    output.push(getFilterDocs())
    output.push(getReducerDocs())
    await db.bulk({docs: output}).then((body) => {
      // console.log(body);
    });
  } catch (error) { console.log( 'populateDB:', error ) }
  finally {
    console.log( '-------------------- END ---------------------' )
  }
}


async function insertDoc(numbers, order) {
  try {
    await areThereChanges(order)

    // LOCAL
    const localData = fs.readFileSync(`./data/source${order}.json`)
    const data = JSON.parse(localData)
    data.push(numbers)
    data.sort()
    fs.writeFileSync(`./data/source${order}.json`, JSON.stringify(data))
    // REMOTE
    const result = await generate.index(order)
    await populateDB(result, order)
    // LOG
    const date = (new Date()).toGMTString()
    const entry = `Date: ${date} - order ${order} - numbers [${numbers}]\n`
    fs.appendFileSync(`./data/contributions.log`, entry)
  } catch (error) { console.log( 'insertDoc:', error ) }
}

// END OF COUCH.js
