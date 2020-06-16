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
- [x] add themes
- [x] fix 880/383 options for quadvertex4
- [x] themes load only after page reload
- [x] order option "change" event needs adding, so both wheel and change work
- [x] add option to overlap all completely
- [x] fix eventListeners and that for overlapAmount
- [x] add share button
- [x] enable query parameters for bookmarking and sharing
- [x] PWA stuff, service workers, etc
- [ ] add printing options
- [ ] add pin-to-top / favourite feature for individual squares
- [ ] hover info for each square or put into modal
- [ ] number overlay?
- [ ] fix line width for arc and altarc
- [ ] fix mobile style again
- [ ] manual order change triggers two draws of squares
- [ ] finish defining data lists for ranges
- [ ] insert intersection observer sooner? at 150?
- [ ] move generateSharedLengths to mapreduce filter view in couch?
- [ ] update/push cache with changes
- [ ] use indexedDB to be able to access settings via service worker
- [ ] digital root, connect number pairs
- [ ] art sketch, basic dasharray len / order^2
- [ ] animation broken?
- [ ] couch sharedLengths reducer for all orders
- [ ] couch remove shared lengths from index (not needed)
- [ ] couch don't regen index on contribute - change _ids and sorting




1. render page, load default settings, store settings in localStorage and iDB
2. add static assets, data to cache if it doesn't exist?
3. any interaction on page, add data to cache
4. 





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
