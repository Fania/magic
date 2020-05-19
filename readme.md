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
- [x] stroke width
- [x] add size options
- [x] add colour options
- [x] add padding options
- [x] fix 880/383 options for quadvertex4
- [x] themes load only after page reload
- [ ] add printing options
- [ ] add pin-to-top / favourite feature
- [ ] hover info for each square or put into modal
- [ ] number overlay?
- [ ] favorite theme
- [ ] enable query parameters for bookmarking and sharing
- [ ] add option to overlap all completely
- [ ] fix eventListeners and that for overlapAmount
- [ ] fix line width for arc and altarc
- [ ] fix mobile style again
- [ ] order option "change" event needs adding, so both wheel and change work
- [ ] manual order change triggers two draws of squares
- [ ] finish defining data lists for ranges
- [ ] PWA stuff, service workers, etc




## IA

pages:
  - home
  - gallery
  - contribute
  - about


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
