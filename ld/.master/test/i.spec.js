var 
    expect = require('chai').expect,
    sinon = require('sinon'),
    lodown = require('../../index'),
    customers = require('./fixtures/customers.json');

describe('lodown', function() {
    describe("identity", function() {
        it('identity should return the value passed to it, including types Number, String, Boolean, Array, Object, Function', function(){
            expect(lodown.identity(1)).to.equal(1);
            expect(lodown.identity('identity')).to.equal('identity');
            expect(lodown.identity({a: "one"})).to.eql({a: "one"});
            expect(lodown.identity([1,2,3])).to.eql([1,2,3]);
            var fn = function() {  };
            expect(lodown.identity(fn)).to.eql(fn);
        });
    });
    
    describe('typeOf', function() {
        it('should return a String representing the type of the value provided', function() {
            expect(lodown.typeOf([])).to.equal('array');
            expect(lodown.typeOf('a')).to.equal('string');
            expect(lodown.typeOf(null)).to.equal('null');
            expect(lodown.typeOf(new Date())).to.equal('date');
            expect(lodown.typeOf(function () { })).to.equal('function');
        });
    });
    
    describe('each', function() {
        it('should iterate an Array, applying action to each element, index of the element, and the collection', function() {
            var action = sinon.spy();
            lodown.each(customers, action);
            expect(action.callCount).to.equal(customers.length);
            customers.forEach(function(customer, index){
                expect(action.calledWith(customer, index, customers)).to.be.true;
            });
        });
   
        it('should iterate an Object, applying action for each value, key of value, and Object', function() {
            var action = sinon.spy();
            var customer = customers[0];
            lodown.each(customer, action);
            expect(action.callCount).to.equal(Object.keys(customer).length);
            for(var key in customer) {
                expect(action.calledWith(customer[key], key, customer)).to.be.true;
            }
        });
    });
    
    describe('filter', function() {
        it('filter should filter Array items based on test provided', function () {
            expect(lodown.filter([1, 2, 3], function(value) { return value > 2; } )).to.eql([3]);
        });
        it('should call the test function with the value, index and Array', function(){
            var test = sinon.spy();
            lodown.filter(customers, test);
            customers.forEach(function(customer, index){
                expect(test.calledWith(customer, index, customers)).to.be.true;
            });
        });
        it('filter should filter Object values based on test provided', function() {
            expect(lodown.filter({one: 'one', two: 'two', three: 'three'}, function(value) { return value[0] === 't' })).to.eql(['two', 'three']);
        });
        it('should call the test function with the value, key and Object', function(){
            var test = sinon.spy();
            var customer = customers[0];
            lodown.filter(customer, test);
            for(var key in customer) {
                expect(test.calledWith(customer[key], key, customer)).to.be.true;
            }
        });
    });
    
    describe('reject', function() {
        it('should reject elements in an Array wihtout side effects', function() {
            var input = ["a", 1, "b", 2, "c", 4];
            expect(lodown.reject(input, function(value, position, collection){
                return typeof value === "string" || position < collection.length / 2;
            })).to.eql([2,4]);
            expect(input).to.eql(["a", 1, "b", 2, "c", 4]);
        });
    });
    
    describe('map', function() {
        it('map should create an Array of transformations for each value in an Array', function () {
            expect(lodown.map([1, 2, 3], function(value) { return value + 1; } )).to.eql([2, 3, 4]);
        });
        it('map should create an Array of transformations for each value in an Object', function() {
            expect(lodown.map({one: 'one', two: 'two', three: 'three'}, function(value) { return value.toUpperCase(); })).to.eql(['ONE', 'TWO', 'THREE']);
        });
    });
    
    describe('first', function() {
        it('should return the first value or n values in an Array', function() {
            expect(lodown.first(["a","b","c"])).to.equal("a");
            expect(lodown.first(["a","b","c"], 2)).to.eql(["a","b"]);
        });
        it('should return empty Array if first is invoked with negative n value', function() {
            expect(lodown.first(["a","b","c"], -1)).to.eql([]);
        });
        it('Should return the whole Array first is invoked with n value greater than the array\'s length.', function(){
            expect(lodown.first(["a","b","c"], 5)).to.eql(["a","b","c"]);
        });
        it('Should return empty Array if the array param is not an Array.', function() {
            expect(lodown.first({a:"b"}, 2)).to.eql([]);
        });
    });
    
    describe('last', function() {
        it('should return the last value or n values in an Array', function() {
            expect(lodown.last(["a","b","c"])).to.equal("c");
            expect(lodown.last(["a","b","c"], 2)).to.eql(["b","c"]);
        });
        it('should return empty Array if last is invoked with negative n value', function() {
            expect(lodown.last(["a","b","c"], -1)).to.eql([]);
        });
        it('Should return the whole Array last is invoked with n value greater than the array\'s length.', function() {
            expect(lodown.last(["a","b","c"], 5)).to.eql(["a","b","c"]);
        });
        it('Should return empty Array if the Array param is not an Array.', function() {
            expect(lodown.last({a:"b"}, 2)).to.eql([]);
        });
    });
    
    describe('partition', function() {
        it('should take an Array and return Array containing two Array of passing and failing values, without side effects.', function() {
            var input = ["a", 1, "b", 2, "c", 4];
            expect(lodown.partition(input, function(value, index, array){
                return typeof value === "string";
            })).to.eql([["a","b","c"],[1,2,4]]);
            expect(input).to.eql(["a", 1, "b", 2, "c", 4]);
        });
        it('should take an Object and return Array containing two Array of passing and failing values, without side effects.', function() {
            var input = {one: 1, two: 2, three: 3, four: 4};
            expect(lodown.partition(input, function(value, index, array){
                return value < 3;
            })).to.eql([[1, 2],[3, 4]]);
            expect(input).to.eql({one: 1, two: 2, three: 3, four: 4});
        });
    });
});