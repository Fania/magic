# Magic Squares

Don't forget to set up a .env file with login info.



## Todo

- [x] update design docs with rev if needed
- [x] test and check the new createOrder function
- [x] upload single input to DB
- [x] create design doc for each display style
- [x] query doc? see contribute
- [x] contribute, check for transformations
- [x] add other higher order displays
- [x] check sharedLengths in index - broken
- [x] use db.view('order', 'numeric') to get sorted list
- [x] save contributions in log file too (with dates, etc)
- [x] mobile style
- [x] selectively update only changes for bulk index (not possible)
- [x] improve gallery style
- [x] sort local source file every time a new square is added
- [x] tetris shapes for digital roots
- [ ] add colour options
- [ ] add padding options
- [ ] add size options
- [ ] add printing options
- [ ] add 
- [ ] 
- [ ] 
- [ ] 







## IA

pages:
  - home
  - gallery
  - contribute
  - about

styles:
  - lines:
    - numbers
    - straight
    - quadvertex
    - quadline
    - arc
    - altarc
  - colours:
    - circles
    - blocks
    - tetromino

orders: 
  - 3-20

colours:
  - background
  - stroke + alpha
  - fill + alpha
  - fill style?

sizes:
  - padding
  - width/height

animation: 
  - sync
  - async
  - none
  - speed

filters:
  - length
  - id/order + ranges

info:
  - id
  - order
  - style
  - numbers
  - similar ids?
  - numbers overlay?





## Nano CouchDB

https://jo.github.io/couchdb-best-practices/
