// { "rows": [
//   { "key": [1857,1857,2332,3663,2284], "value": "2" },

function(doc) {
  let stl = [doc.quadvertex.length,doc.quadline.length,doc.straight.length,doc.arc.length,doc.altarc.length];
  let nms = ['quadvertex','quadline','straight','arc','altarc'];
  for (i=0; i < 5; i++) {
    emit(stl[i], nms[i]);
  }
}


function(keys, values, rereduce) {
    for(i=0,l=values.length; i < l; i++) { 
        if(rereduce) { 
            return values[i];
        } else { 
            return values;
        } 
    } 
}

    let ids = []; 
    for(i=0,l=values.length; i < l; i++) { 
        if(rereduce) { 
            ids.push(values[i]); 
        } else { 
            ids.push(values[i]);
        } 
    } 
    return ids;


// built in count
function (keys, values, rereduce) {
  if (rereduce) {
    return sum(values);
  } else {
    return values.length;
  }
}




function (keys, values, rereduce) { 
  for(i=0,v=values.length; i < v; i++) { 
    if(rereduce) { 
      return values[i]; 
    } else { 
      return values; 
    } 
  } 
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