const assert = require('assert')
const expect = require("chai").expect
// https://mochajs.org/#getting-started
// https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha















// HELP

// describe("title", function() { ... })
// it("use case description", function() { ... })
// assert.equal(value1, value2)


// EXAMPLES

// describe("Color Code Converter", function() {
//   describe("RGB to Hex conversion", function() {
//     it("converts the basic colors", function() {
//       var redHex   = converter.rgbToHex(255, 0, 0);
//       var greenHex = converter.rgbToHex(0, 255, 0);
//       var blueHex  = converter.rgbToHex(0, 0, 255);

//       expect(redHex).to.equal("ff0000");
//       expect(greenHex).to.equal("00ff00");
//       expect(blueHex).to.equal("0000ff");
//     });
//   });


// describe('hooks', function () {

  // before(() => alert("Testing started – before all tests"));
  // after(() => alert("Testing finished – after all tests"));

  // beforeEach(() => alert("Before a test – enter a test"));
  // afterEach(() => alert("After a test – exit a test"));

//   before(function () {
//     // runs once before the first test in this block
//   });

//   after(function () {
//     // runs once after the last test in this block
//   });

//   beforeEach(function () {
//     // runs before each test in this block
//   });

//   afterEach(function () {
//     // runs after each test in this block
//   });

//   // test cases
// });

// beforeEach(async function () {
//   await db.clear();
//   await db.save([tobi, loki, jane]);
// });


// describe('Array', () => {
//   describe('#indexOf()', () => {
//     it('should return -1 when the value is not present', () => {
//       assert.equal([1, 2, 3].indexOf(4), -1)
//     })
//   })
// })


// describe("Customer classifier", () => {
//   test("When customer spent more than 500$, should be classified as premium", () => {
//     //Arrange
//     const customerToClassify = { spent: 505, joined: new Date(), id: 1 };
//     const DBStub = sinon.stub(dataAccess, "getCustomer").reply({ id: 1, classification: "regular" });

//     //Act
//     const receivedClassification = customerClassifier.classifyCustomer(customerToClassify);

//     //Assert
//     expect(receivedClassification).toMatch("premium");
//   });
// });



// describe('#find()', function () {
//   it('responds with matching records', async function () {
//     const users = await db.find({type: 'User'});
//     users.should.have.length(3);
//   });
// });


// describe('my suite', () => {
//   it('my test', () => {
//     // should set the timeout of this test to 1000 ms; instead will fail
//     this.timeout(1000);
//     assert.ok(true);
//   });
// });