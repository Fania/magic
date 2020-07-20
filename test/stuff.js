let x = [8,1,6,3,5,7,4,9,2]

let x1 = x.map(n => shift(n,1))
let x2 = x.map(n => shift(n,2))
let x3 = x.map(n => shift(n,3))
let x4 = x.map(n => shift(n,4))
let x5 = x.map(n => shift(n,5))
let x6 = x.map(n => shift(n,6))
let x7 = x.map(n => shift(n,7))
let x8 = x.map(n => shift(n,8))
let x9 = x.map(n => shift(n,9))

function shift(n,m) {
  let o;
  (n+m) % 9 == 0 ? o = 9 : o = (n+m) % 9;
  return o;
}

console.log(x);  // [8,1,6,3,5,7,4,9,2] ORIGINAL
console.log(x1); // [9,2,7,4,6,8,5,1,3] NOT MAGIC
console.log(x2); // [1,3,8,5,7,9,6,2,4] NOT MAGIC
console.log(x3); // [2,4,9,6,8,1,7,3,5] NOT MAGIC
console.log(x4); // [3,5,1,7,9,2,8,4,6] NOT MAGIC
console.log(x5); // [4,6,2,8,1,3,9,5,7] NOT MAGIC
console.log(x6); // [5,7,3,9,2,4,1,6,8] NOT MAGIC
console.log(x7); // [6,8,4,1,3,5,2,7,9] NOT MAGIC
console.log(x8); // [7,9,5,2,4,6,3,8,1] NOT MAGIC
console.log(x9); // [8,1,6,3,5,7,4,9,2] MAGIC
