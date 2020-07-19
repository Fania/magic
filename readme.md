# Magic Squares

Don't forget to set up `.env` and `magic.json` files.

Run with `node server` or start the daemon `pm2 start magic.json`.



## Todo


### Functionality

- [ ] classification
- [ ] length filter
- [ ] search by (id:order, lists)
- [ ] add search box for single input and multiple inputs

### Backend

- [ ] delete unused code, clean, refactor
- [ ] extract more behaviour out to backend
- [ ] when user contributes a square, cache needs to be refreshed
- [ ] partition order 5 by magic square classification?
- [ ] partition by number, e.g. simply group every 1000?
- [ ] cache needs updating if changes on server
- [ ] cache only adds new resources in, not updates out-of-date ones?
- [ ] couch don't regen index on contribute - change _ids and sorting
- [ ] check if contribute allows higher orders than exist on server at that point
- [ ] merge sharedLengths into one file via couch? to simplify caching

### Interface

- [ ] don't save to localstorage while live adjusting things like fill
- [ ] prevent overlap for more than 200? e.g. for order 5s (with loads)
- [ ] try inline styles for animation?
- [ ] add dropdown for shared lengths per order
- [ ] hover info for each square or put into modal
- [ ] fix mobile style again
- [ ] manual order change triggers two draws of squares
- [ ] finish defining data lists for ranges
- [ ] change width/size to be based on height, not width
- [ ] insert intersection observer sooner? at 150?
- [ ] fix line width for arc and altarc
- [ ] number overlay?
- [ ] enable a fixed width rather than percentage to allow different line breaks in svg grid
- [ ] make sure new theme is added to dropdown when saved
- [ ] add pin-to-top / favourite feature for individual squares
- [ ] day/night mode
- [ ] add printing options
- [ ] change spinner
- [ ] disable spinner

### Art

- [ ] art digital root, connect number pairs
- [ ] art sketch, basic dasharray len / order^2
- [ ] feed mesh into deep dream




## Done

- [x] getData being called 4 times? SW does that due to debug mode
- [x] add check for uniques for new source db backend
- [x] use raw data in couch for order 5s and generate svgs on the fly
- [x] upload source files to db
- [x] disable gallery for now
- [x] mobile size sliders appear in line
- [x] mobile overlap broken (z-index)
- [x] add animation to presets and random?
- [x] animation broken? cache problem? no, i think this is CSSOM problem, see animationCSS function
- [x] add animation to bookmarks
- [x] make reset trigger a redraw of data as well
- [x] add fullscreen mode hiding interface
- [x] stroke/background/fill broken
- [x] overlay broken? cache problem?
- [x] fix mobile form field sizes (to avoid default zoom to pt 16)
- [x] make PWA app fullscreen (minimal ui)
- [x] daemonise app on server
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


## References

- https://eloquentjavascript.net/18_http.html

`process.stdout.write("hello: ");`
`process.stdout.write("Downloading " + data.length + " bytes\r");`




1 22 23 17 2 15 6 12 14 18 20 13 9 7 16 8 19 10 24 4 21 5 11 3 25

6 15 12 18 14 22 1 23 2 17 13 20 9 16 7 5 21 11 25 3 19 8 10 4 24

25 5 11 3 21 18 6 12 14 15 16 13 9 7 20 4 19 10 24 8 2 22 23 17 1

6 18 12 15 14 5 25 11 21 3 13 16 9 20 7 22 2 23 1 17 19 4 10 8 24

1 22 23 17 2 15 6 18 14 12 20 13 9 7 16 8 19 4 24 10 21 5 11 3 25


// order 3
// 4,9,2,3,5,7,8,1,6
// 2,9,4,7,5,3,6,1,8
// 8,1,6,3,5,7,4,9,2
// 4,3,8,9,5,1,2,7,6
// 6,7,2,1,5,9,8,3,4
// 8,3,4,1,5,9,6,7,2
// 6,1,8,7,5,3,2,9,4
// 2,7,6,9,5,1,4,3,8