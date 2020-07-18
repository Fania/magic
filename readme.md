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
- [ ] getData being called 4 times?
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