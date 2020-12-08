# Magic Squares 

Don't forget to set up `.env` and `magic.json` files.

Run with `node server` or start the daemon `pm2 start magic.json`.

<!-- Update sw.js and home.js cache version numbers -->


## Todo

### Bugs ?

- [ ] tablet screens don't fit side settings menu? 
- [ ] make Edge respect speed range adjustments without turning anim off/on
- [ ] check printing on all browsers
- [ ] work out why 256 quadvertex, arc, blocks, etc aren't working


### Functionality

- [ ] classification
- [ ] length filter
- [ ] search by (id:order, lists)
- [ ] add search box for single input and multiple inputs

### Backend

- [ ] order 256 not working
- [ ] extract more behaviour out to backend
- [ ] partition order 5 by magic square classification?
- [ ] partition by number, e.g. simply group every 1000?
- [ ] merge sharedLengths into one file via couch? to simplify caching

### Interface

- [ ] add option to hide interface via share button / bookmarks
- [ ] make print stylesheet sizes dynamic
- [ ] modal being added twice after print dialog triggered
- [ ] create new research page
- [ ] don't save to localstorage while live adjusting things like fill
- [ ] prevent overlap for more than 200? e.g. for order 5s (with loads)
- [ ] add dropdown for shared lengths per order
- [ ] fix mobile style again
- [ ] finish defining data lists for ranges
- [ ] insert intersection observer sooner? at 150?
- [ ] number overlay?
- [ ] enable a fixed width rather than percentage to allow different line breaks in svg grid
- [ ] make sure new theme is added to dropdown when saved
- [ ] add pin-to-top / favourite feature for individual squares

### Art

- [ ] colour different line lengths
- [ ] art digital root, connect number pairs
- [ ] art sketch, basic dasharray len / order^2
- [ ] feed mesh into deep dream
- [ ] make magic line glow neon (like window)?




## Done

- [x] anim radio buttons not correct after making changes?
- [x] reset button triggering animations?
- [x] mobile and tablet screens have extra height between rows?
- [x] mobile and tablet screens don't show async animations?
- [x] edge scaling width/height probs past 150px
- [x] try inline styles for animation?
- [x] circle colours broken for n>4
- [x] remoteOrders ? randomise theme broken
- [x] change width/size to be based on height, not width
- [x] make sure number svgs are readable for larger orders
- [x] add other orders to print stylesheet
- [x] hover info for each square or put into modal
- [x] fix line width for arc and altarc
- [x] cache needs updating if changes on server
- [x] cache only adds new resources in, not updates out-of-date ones?
- [x] change spinner
- [x] disable spinner
- [x] day/night mode
- [x] add printing options
- [x] dark mode
- [x] research filters not based on class but on custom view directly
- [x] replace nano with generic http lib axios
- [x] delete unused code, clean, refactor
- [x] load order display broken
- [x] contribute higher orders than exist on server at that point broken **!**
- [x] order selection is broken with wheel and click **!!!**
- [x] manual order change triggers two draws of squares
- [x] when user contributes a square, cache needs to be refreshed
- [x] couch don't regen index on contribute - change _ids and sorting
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
- https://css-tricks.com/dark-modes-with-css/
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
- https://www.w3schools.com/howto/howto_js_toggle_dark_mode.asp

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





order 32


2 831 1017 200 899 190 124 837 738 479 281 552 355 606 668 421
23 810 1008 209 918 171 109 852 759 458 272 561 374 587 653 436
59 774 964 253 954 135 65 896 731 486 292 541 346 615 673 416
46 787 981 236 943 146 88 873 718 499 309 524 335 626 696 393
931 158 92 869 34 799 985 232 323 638 700 389 706 511 313 520
950 139 77 884 55 778 976 241 342 619 685 404 727 490 304 529
922 167 97 864 27 806 996 221 378 583 641 448 763 454 260 573
911 178 120 841 14 819 1013 204 367 594 664 425 750 467 277 556
800 33 231 986 157 932 870 91 512 705 519 314 637 324 390 699
777 56 242 975 140 949 883 78 489 728 530 303 620 341 403 686
805 28 222 995 168 921 863 98 453 764 574 259 584 377 447 642
820 13 203 1014 177 912 842 119 468 749 555 278 593 368 426 663
189 900 838 123 832 1 199 1018 605 356 422 667 480 737 551 282
172 917 851 110 809 24 210 1007 588 373 435 654 457 760 562 271
136 953 895 66 773 60 254 963 616 345 415 674 485 732 542 291
145 944 874 87 788 45 235 982 625 336 394 695 500 717 523 310
279 554 752 465 662 427 365 596 1015 202 16 817 118 843 909 180
258 575 761 456 643 446 380 581 994 223 25 808 99 862 924 165
302 531 725 492 687 402 344 617 974 243 53 780 79 882 952 137
315 518 708 509 698 391 321 640 987 230 36 797 90 871 929 160
694 395 333 628 311 522 720 497 86 875 941 148 983 234 48 758
675 414 348 613 290 543 729 488 67 894 956 133 962 255 57 776
655 434 376 585 270 563 757 460 111 850 920 169 1006 211 21 812
666 423 353 608 283 550 740 477 122 839 897 192 1019 198 4 829
521 312 498 719 396 693 627 334 233 984 786 47 876 85 147 942
544 289 487 730 413 676 614 347 256 961 775 58 893 68 134 955
564 269 459 758 433 656 586 375 212 1005 811 22 849 112 170 919
549 284 478 739 424 665 607 354 197 1020 830 3 840 121 191 898
428 661 595 366 553 280 466 751 844 117 179 910 201 1016 818 15
445 644 582 379 576 257 455 762 861 100 166 923 224 993 807 26
401 688 618 343 532 301 491 726 881 80 138 951 244 973 779 54
392 697 639 322 517 316 510 707 872 89 159 930 229 988 798 35
746 471 273 560 363 598 660 429 10 823 1009 208 907 182 116 845
767 450 264 569 382 579 645 444 31 802 1000 217 926 163 101 860
723 494 300 533 338 623 681 408 51 782 972 245 946 143 73 888
710 507 317 516 327 634 704 385 38 795 989 228 935 154 96 865
331 630 692 397 714 503 305 528 939 150 84 877 42 791 977 240
350 611 677 412 735 482 296 537 958 131 69 892 63 770 968 249
370 591 649 440 755 462 268 565 914 175 105 856 19 814 1004 213
359 602 672 417 742 475 285 548 903 186 128 833 6 827 1021 196
504 713 527 306 629 332 398 691 792 41 239 978 149 940 878 83
481 736 538 295 612 349 411 678 769 64 250 967 132 957 891 70
461 756 566 267 592 369 439 650 813 20 214 1003 176 913 855 106
476 741 547 286 601 360 418 671 828 5 195 1022 185 904 834 127
597 364 430 659 472 745 559 274 181 908 846 115 824 9 207 1010
580 381 443 646 449 768 570 263 164 925 859 102 801 32 218 999
624 337 407 682 493 724 534 299 144 945 887 74 781 52 246 971
633 328 386 703 508 709 515 318 153 936 866 95 796 37 227 990
1023 194 8 825 126 835 901 188 287 546 744 473 670 419 357 604
1002 215 17 816 107 854 916 173 266 567 753 464 651 438 372 589
966 251 61 772 71 890 960 129 294 539 733 484 679 410 352 609
979 238 44 789 82 879 937 152 307 526 716 501 690 399 329 632
94 867 933 156 991 226 40 793 702 387 325 636 319 514 712 505
75 886 948 141 970 247 49 784 683 406 340 621 298 535 721 496
103 858 928 161 998 219 29 804 647 442 384 577 262 571 765 452
114 847 905 184 1011 206 12 821 658 431 361 600 275 558 748 469
225 992 794 39 868 93 155 934 513 320 506 711 388 701 635 326
248 969 783 50 885 76 142 947 536 297 495 722 405 684 622 339
220 997 803 30 857 104 162 927 572 261 451 766 441 648 578 383
205 1012 822 11 848 113 183 906 557 276 470 747 432 657 599 362
836 125 187 902 193 1024 826 7 420 669 603 358 545 288 474 743
853 108 174 915 216 1001 815 18 437 652 590 371 568 265 463 754
889 72 130 959 252 965 771 62 409 680 610 351 540 293 483 734
880 81 151 938 237 980 790 43 400 689 631 330 525 308 502 715

duplicate numbers? 758



## HTTPS Requests

Use [Axios](https://github.com/axios/axios) library.

**Request** format:
```
const axios = require('axios')
async function request(endpoint) {
  try {
    const config = {
      url: endpoint,
      method: 'get',
      baseURL: `https://${host}`,
      auth: {
        username: user,
        password: password
      }
      // params: {
      //   ID: 12345
      // },
      // data: {
      //   firstName: 'Fred'
      // },
    }
    const response = await axios.request(config)
    console.log(response)
  } catch (error) { console.error(error) }
}
request(_all_dbs)
```

**Response** format:  
```
{
  data: {},
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
  request: {}
}
```




## Testing


- [ ] android menu doesn't close, top menu bar overlaps with


|             | Chrome | Firefox | Edge | Safari | iOS | Android |
|-------------|--------|---------|------|--------|-----|---------|
| Interface   |   ok   |         |      |        |     |         |
| Chnge Order |   ok   |         |      |        |     |         |
| Order Wheel |   ok   |         |      |        |     |         |
| 383/880     |   ok   |         |      |        |     |         |
| IO          |   ok   |         |      |        |     |         |
| Style       |   ok   |         |      |        |     |         |
| Size        |   ok   |         |      |        |     |         |
| Size Wheel  |   ok   |         |      |        |     |         |
| Gap         |   ok   |         |      |        |     |         |
| Gap Wheel   |   ok   |         |      |        |     |         |
| Line        |   ok   |         |      |        |     |         |
| Line Wheeel |   ok   |         |      |        |     |         |
| Overlap     |   --   |         |      |        |     |         |
| Overlap All |   --   |         |      |        |     |         |
| Day Mode    |        |         |      |        |     |         |
| Day Print   |        |         |      |        |     |         |
| Dbl Clck    |        |         |      |        |     |         |
| Hide Intfc  |        |         |      |        |     |         |
| Night Mode  |        |         |      |        |     |         |
| Night Prnt  |        |         |      |        |     |         |
| Background  |        |         |      |        |     |         |
| Stroke      |        |         |      |        |     |         |
| Strke Alpha |        |         |      |        |     |         |
| Fill        |        |         |      |        |     |         |
| Fill Alpha  |        |         |      |        |     |         |
| Sync        |   ok   |   ok    |  ok  |   ok   | ok  |   ok    |
| Sync Pause  |   ok   |   ok    |  ok  |   ok   | ok  |   ok    |
| Sync Speed  |   ok   |   ok    |  ok  |   ok   | ok  |   ok    |
| Sync Scrll  |   ok   |   --    |  ok  |   *    | --  |   ok    |
| Sync O      |   ok   |   ok    |  ok  |   ok   | --  |   ok    |
| Sync IO     |   ok   |   ok    |  ok  |   ok   | ok  |   ok    |
| Async       |   ok   |   ok    |  ok  |   --   | **  |   ok    |
| Async IO    |   --   |   --    |  --  |   --   | **  |   --    |
| Pick Theme  |        |         |      |        |     |         |
| Rndm Theme  |        |         |      |        |     |         |
| Save Theme  |        |         |      |        |     |         |
| Reset       |        |         |      |        |     |         |
| Share Theme |        |         |      |        |     |         |

\* check if Safari async anim range needs setting to 1 not 0



| Print P     | Chrome | Firefox | Edge | Safari | iOS | Android |
|-------------|--------|---------|------|--------|-----|---------|
| Order 3     |   ok   |         |      |        |     |         |
| Order 4     |   ok   |         |      |        |     |         |
| Order 5     |   --   |         |      |        |     |         |
| Order 6     |   ok   |         |      |        |     |         |
| Order 7     |   ok   |         |      |        |     |         |
| Order 8     |   ok   |         |      |        |     |         |
| Order 9     |   ok   |         |      |        |     |         |
| Order 10    |   ok   |         |      |        |     |         |
| Order 11    |   ok   |         |      |        |     |         |
| Order 12    |   ok   |         |      |        |     |         |
| Order 13    |   ok   |         |      |        |     |         |
| Order 14    |   ok   |         |      |        |     |         |
| Order 15    |   ok   |         |      |        |     |         |
| Order 16    |   ok   |         |      |        |     |         |
| Order 17    |   ok   |         |      |        |     |         |
| Order 18    |   ok   |         |      |        |     |         |
| Order 19    |   ok   |         |      |        |     |         |
| Order 20    |   ok   |         |      |        |     |         |
| Order 21    |   ok   |         |      |        |     |         |
| Order 24    |   ok   |         |      |        |     |         |
| Order 25    |   ok   |         |      |        |     |         |
| Order 27    |   ok   |         |      |        |     |         |
| Order 28    |   ok   |         |      |        |     |         |
| Order 30    |   ok   |         |      |        |     |         |
| Order 32    |   ok   |         |      |        |     |         |


|             | Chrome | Firefox | Edge | Safari | iOS | Android |
|-------------|--------|---------|------|--------|-----|---------|
| old  n3     |        |         |      |        |     |         |
| new  n32    |        |         |      |        |     |         |
| new  n132   |        |         |      |        |     |         |
| non square  |        |         |      |        |     |         |
