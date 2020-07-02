# Magic Squares

Don't forget to set up a .env file with login info.




filters:
  - length
  - id/order + ranges

hover info modal?:
  - id
  - order
  - style
  - numbers
  - similar ids?
  - numbers overlay?






## Todo

- [ ] try inline styles for animation?
- [ ] add animation to presets and random?
- [ ] animation broken? cache problem? no, i think this is CSSOM problem, see animationCSS function
- [ ] overlay broken? cache problem?
- [ ] add dropdown for shared lengths per order
- [ ] cache needs updating if changes on server
- [ ] hover info for each square or put into modal
- [ ] fix mobile style again
- [ ] manual order change triggers two draws of squares
- [ ] finish defining data lists for ranges
- [ ] insert intersection observer sooner? at 150?
- [ ] fix line width for arc and altarc
- [ ] art digital root, connect number pairs
- [ ] art sketch, basic dasharray len / order^2
- [ ] number overlay?
- [ ] couch don't regen index on contribute - change _ids and sorting
- [ ] check if contribute allows higher orders than exist on server at that point
- [ ] enable a fixed width rather than percentage to allow different line breaks in svg grid
- [ ] merge sharedLengths into one file via couch? to simplify caching
- [ ] add search box for single input and multiple inputs
- [ ] add pin-to-top / favourite feature for individual squares
- [ ] add printing options
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
- [x] couch sharedLengths reducer for all orders
- [x] couch remove shared lengths from index (not needed)
- [x] reverse update sources from COUCH to LOCAL (for stuff added online but not via localhost)
- [x] still a problem with local having more new items than server and then ignoring and overwriting server... needs cross checking both ways, item by item
- [x] update/push cache with changes
- [x] move generateSharedLengths to mapreduce filter view in couch?
- [x] use indexedDB to be able to access settings via service worker




- partition order 5 by magic square classification?
- partition by number, e.g. simply group every 1000?

