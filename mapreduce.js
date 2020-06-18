// { "rows": [
//   { "key": [1857,1857,2332,3663,2284], "value": "2" },

function(doc) {
  let arr = [doc.quadvertex.length,doc.quadline.length,doc.straight.length,doc.arc.length,doc.altarc.length];
  let nms = ['quadvertex','quadline','straight','arc','altarc'];
  for (i=0,l=arr.length; i < l; i++) {
    emit([arr[i], nms[i]], doc._id);
  }
}


function(keys, values, rereduce) {
    // keys = array of arrays of lengths
    // values = array of ids

    let output = [];

    keys.forEach(k => {
      
        let result = [];
        values.forEach(v => {
            if (rereduce) {
                return v;
            } else {
                return values;
            }
        });
        output.push(result);

    });

    return output;
}



















// BACKUP


// function(doc) {
//     emit([doc.quadvertex.length,doc.quadline.length,doc.straight.length,doc.arc.length,doc.altarc.length], doc._id);
// }

// function(keys, values, rereduce) {
//     let result = [];
//     for (i = 0, v = values.length; i < v; i++) {
//         if (rereduce) {
//             return values[i];
//         } else {
//             return values;
//         }
//     }
// }