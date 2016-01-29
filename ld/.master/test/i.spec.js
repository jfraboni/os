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
    
    describe('eachRight', function() {
        it('should iterate an Array in reverse, applying action to each element, index of the element, and the collection', function() {
            
            var values = [1, 2, 3, 4, 5];
            var reversed = [];
            function action(value, index, coll) {
                reversed.push(index);
            }
            lodown.eachRight(values, action);
            expect(reversed).to.eql([4, 3, 2, 1, 0]);
        });
        
        it('should, when iterating, pass to the action each element, index of the element, and the collection', function() {
            var action = sinon.spy();
            var values = [1, 2, 3, 4, 5];
            lodown.eachRight(values, action);
            expect(action.callCount).to.equal(values.length);
            values.forEach(function(value, index){
                expect(action.calledWith(value, index, values)).to.be.true;
            });
        });
        
        it('should iterate an Object, applying action for each value, key of value, and Object', function() {
            var action = sinon.spy();
            var customer = customers[0];
            lodown.eachRight(customer, action);
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
    
    describe('unique', function() {
        it('should return an Array with no duplicates and have no side effects', function() {
            var input = ["a", 1, 1, "a", "c", false, "b" , 5, "c", null, false, null];
            expect(lodown.unique(input)).to.eql(["a", 1, "c", false, "b", 5, null]);
            expect(input).to.eql(["a", 1, 1, "a", "c", false, "b" , 5, "c", null, false, null]);
        });
    });
    
    describe('reduce', function() {
        var inputArray = [10, 20, 30, 40];
        it('should work with an Array and a seed', function() {
            expect(lodown.reduce(inputArray, function(memo, element, i){
                return memo + element + i;
            }, 10)).to.equal(116);
        });
        it('should work without a seed', function() {
            expect(lodown.reduce(inputArray, function(memo, element, i){
                return memo * element * (i+1);
            })).to.equal(5760000);
        });
        it('should work without a seed when collection is Object', function() {
            var input = {one: 'a', two: 'b', three: 'c'};
            expect(lodown.reduce(input, function(memo, value, i){
                return memo + value;
            })).to.equal('abc');
        });
        it('should work when seed is falsy', function() {
            expect(lodown.reduce(inputArray, function(memo, element, i){
                return memo * element * (i+1);
            }, 0)).to.equal(0);
        });
    });
    
    describe('reduceRight', function() {
        it('should work with an Array and a seed', function() {
            var inputArray = ['k', 'c', 'u'];
            expect(lodown.reduceRight(inputArray, function(memo, element, i){
                return memo + element;
            }, 'f')).to.equal('fuck');
        });
        it('should work without a seed', function() {
            var inputArray = ['k', 'c', 'u', 'f'];
            expect(lodown.reduceRight(inputArray, function(memo, element, i){
                return memo + element;
            })).to.equal('fuck');
        });
        it('should work without a seed when collection is Object', function() {
            var input = {one: 'a', two: 'b', three: 'c'};
            expect(lodown.reduceRight(input, function(memo, value, i){
                return memo + value;
            })).to.equal('cba');
        });
        it('should work when seed is falsy', function() {
            var inputArray = [1, 2, 3, 4];
            expect(lodown.reduceRight(inputArray, function(memo, element, i){
                return memo * element * (i+1);
            }, 0)).to.equal(0);
        });
    });
    
    describe('some', function() {
        var inputData = [2, 4, 6, 7, 8];
        var inputDataTruthy = [1, [], true, "a"];
        var inputDataFalsy = ["", 0, false, null, undefined, NaN];
        var inputObject = {a:"one", b:"two", c:"three"};
        
        it('should return true when at least one value passes the test, wihtout side effects', function() {
            expect(lodown.some(inputData, function(v){
                return v === 7;
            })).to.be.true;
            expect(inputData).to.eql([2, 4, 6, 7, 8]);
        });
        
        it('should return false when all values fail the test', function() {
            expect(lodown.some(inputData, function(v){
                return v > 10;
            })).to.be.false;
        });
        
        it('should handle objects', function() {
            expect(lodown.some(inputObject, function(v, k, o){
                return ["aone3", "btwo3"].indexOf(k + v + Object.keys(o).length) !== -1;
            })).to.be.true;
        });
        
        it('should return true for collection of truthy values when no test function is provided', function() {
            expect(lodown.some(inputDataTruthy)).to.be.true;
        });
        
        it('should return false for collection of falsy values when no test function is provided', function() {
            expect(lodown.some(inputDataFalsy)).to.be.false;
        });
    });
    
    describe('every', function() {
        var inputData = [2, 4, 6, 7, 8];
        var inputDataTruthy = [1, [], true, "a"];
        var inputDataFalsy = ["", 0, false, null];
        var inputObject = {a:"one", b:"two", c:"three"};
        
        it('should return true when all collection values pass the test, without side effects', function() {
            expect(lodown.every(inputData, function(v){
                return v % 2 === 0 || v === 7;
            })).to.be.true;
            expect(inputData).to.eql([2, 4, 6, 7, 8]);
        });
        
        it('should return false when at least one collection value fails the test', function() {
            expect(lodown.every(inputData, function(v){
                return v % 2 === 0;
            })).to.be.false;
        });
        
        it('should handle objects', function() {
            expect(lodown.every(inputObject, function(v, k, o){
                return ["aone3","btwo3","cthree3"].indexOf(k + v + Object.keys(o).length) !== -1;
            })).to.be.true;
        });
        
        it('should return false if at least one value in object fails test', function() {
            expect(lodown.every(inputObject, function(v, k, o){
                return v[0] === 't';
            })).to.be.false;
        });
        
        it('should return true for collection of truthy values when no test function is provided', function() {
            expect(lodown.every(inputDataTruthy)).to.be.true;
        });
        
        it('should return false for collection of falsy values when no test function is provided', function() {
            expect(lodown.every(inputDataFalsy)).to.be.false;
        });
    });
    
    describe('pluck', function() {
        var inputData = [
            { name: "Ralph", age: 22},
            { name: "Jimmy", age: 13},
            { name: "Carla", age: 20}
        ];
        it('should pluck properties out of an Array of objects, without side effects', function() {
            expect(lodown.pluck(inputData, "name")).to.eql(["Ralph","Jimmy","Carla"]);
            expect(inputData).to.eql([
                { name: "Ralph", age: 22},
                { name: "Jimmy", age: 13},
                { name: "Carla", age: 20}
            ]);
        });
    });
    
    describe('contains', function() {
        var inputData = [1, "3", 4, 5, "a", "4", "b"];
        it('should return true if a list contains an element, without side effects', function() {
            expect(lodown.contains(inputData, "a")).to.be.true;
            expect(inputData).to.eql([1, "3", 4, 5, "a", "4", "b"]);
        });
        it('should return false if a list does not contain an element', function() {
            expect(lodown.contains(inputData, "c")).to.be.false;
        });
        it('should not coerce type when comparing.', function() {
            expect(lodown.contains(inputData, 3)).to.be.false;
        });
        it('should not coerce type when comparing.', function() {
            expect(lodown.contains(inputData, 3)).to.be.false;
        });
        it('should return true when object contains target value', function() {
            expect(lodown.contains({one: 'a', two: 'b'}, 'b')).to.be.true;
        });
        it('should return false when object does not contain target value', function() {
            expect(lodown.contains({one: 'a', two: 'b'}, 'c')).to.be.false;
        });
    });
    
    describe('extend', function() {
        it('should copy key values from second argument Object into first', function() {
            var inputData = {a: "one", b: "two"};
            lodown.extend(inputData, {c: "three", d: "four"});
            expect(inputData).to.eql({a: "one", b:"two", c:"three", d:"four"});
        });
        it('should overwrite existing properties', function() {
            var inputData = {a:"one", b:"two"};
            lodown.extend(inputData, {a: "three", d: "four"});
            expect(inputData).to.eql({a: "three",b:"two",d:"four"});
        });
        
        it('should handle any number of arguments.', function() {
            var inputData = {a:"one", b:"two"};
            lodown.extend(inputData);
            expect(lodown.extend(inputData, {a:"three",c:"four"}, {d:"five",c:"six"})).to.eql({a:"three",b:"two",c:"six",d:"five"});
        });
        
    });
});
