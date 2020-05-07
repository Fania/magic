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
- [ ] tetris shapes for digital roots






## Lazy Loading

https://developers.google.com/web/updates/2016/04/intersectionobserver

1. only grab like 100 svgs from couch
2. manually add a sentinel into dom after svgs
3. that sentinel triggers intersection observer which calls step 1 again






## Art
- create overlaid positions of all squares of number 1. etc. where is the 1 in this square, then where is it in the next? trace position of a given number. if stays in one place, brighten dot

- take all numbers with a colour each and do the same above.






## Nano CouchDB

https://jo.github.io/couchdb-best-practices/
