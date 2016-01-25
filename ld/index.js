'use strict';

function identity(value) {
    return value;
}
module.exports.identity = identity;

function typeOf(value) {
    if(Array.isArray(value)) {
        return 'array';
    } else if (value === null) {
        return 'null';
    } else if (value instanceof Date) {
        return 'date';
    } 
    return typeof value;
}
module.exports.typeOf = typeOf;

/**
 * first: Returns the first or first n elements from the provided Array. 
 * Provding a negative value for n will result in an empty Array. If n is 
 * greater than the length of the Array, the full Array will be returned.
 * 
 * @param {Array} array The Array from which to draw the first value(s).
 * @param {Number} n The number of beginning elements to be returned.
 * 
 * @return {String} A value or an Array of the first n values.
 */
function first(array, n) {
    n = n || 1;
    if (n < 1 || !Array.isArray(array)) return [];
    return n > 1 ? array.slice(0, n) : array[0];
}
module.exports.first = first;

/**
 * last: Returns the last or last n elements from the provided Array. 
 * Provding a negative value for n will result in an empty Array. If n is 
 * greater than the length of the Array, the full Array will be returned.
 * 
 * @param {Array} array The Array from which to draw the last value(s).
 * @param {Number} n The number of ending elements to be returned.
 * 
 * @return {String} A value or an Array of the first n values.
 */
function last(array, n) {
    n = n || 1;
    if (n < 1 || !Array.isArray(array)) return [];
    return n > 1 ? array.slice(-n) : array[array.length - 1];
}
module.exports.last = last;

/**
 * each: Designed to loop over a collection, Array or Object, and applies the action 
 * Function to each value in the collection.
 * 
 * @param {Array or Object} collection The collection over which to iterate.
 * @param {Function} action The Function to be applied to each value in the 
 * collection
 */
function each(collection, action) {
    if(Array.isArray(collection)) {
        for(var i = 0; i < collection.length; i++) {
            action(collection[i], i, collection);
        }
    } else {
        for (var key in collection) {
            action(collection[key], key, collection);
        }
    }
}
module.exports.each = each;

/**
 * Takes a collection, and applies a tranformation function to each value in 
 * the collection, and returns an Array of the tranformations.
 * 
 * @param {Array or Object} collection The collection from which to map.
 * @param {Function} transform The transformation Function, it MUST return a 
 * value representing a transformation of the collection value.
 * 
 * @return {Array} An Array of the mapped or transformed values.
 */
function map(collection, transform) {
    var mapped = [];
    each(collection, function(value, position, collection) {
        mapped.push(transform(value, position, collection));
    });
    return mapped;
}
module.exports.map = map;

/**
 * fitler: Based a a test Function, filter is designed to collect values from 
 * a collection, Array or Object, and return those filtered values.
 * 
 * @param {Array or Object} collection The collection from which to filter.
 * @param {Function} test The Function that tests whether values should be 
 * inlcuded in the returned output. The test Function MUST return a Boolean.
 * The test Function is invoked with the value, the index or key, and the 
 * collection.
 * 
 * @return {Array} An Array of the filtered values.
 */
function filter(collection, test) {
    var filtered = [];
    each(collection, function(value, position, collection) {
        if(test(value, position, collection)) filtered.push(value);
    });
    return filtered;
}
module.exports.filter = filter;

/**
 * reject: Returns an Array of values from a collection, Array or Object
 * that failed a test Function.
 * 
 * @param {Array or Object} collection The collection from which to reject.
 * @param {Function} test The Function that tests whether values should be 
 * rejected. If the test Function returns false, the value is added to the 
 * rejected output. The test Function MUST return a Boolean. The test Function 
 * is invoked with the value, the index or key, and the collection.
 * 
 * @return {Array} An Array of the rejected values.
 */
function reject(collection, test) {
    return filter(collection, function (value, position, collection) {
        return !test(value, position, collection);
    });
}
module.exports.reject = reject;

/**
 * partition: Takes a collection and a test to apply to each value in the 
 * collection, and returns an Array containing an Array of values that passed 
 * the test and an Array of those that failed.
 * 
 * @param {Array or Object} collection The collection to partition.
 * @param {Function} test The Function that defines how to partition, If the 
 * test Function returns true, the value is added to the first Array, otherwise 
 * the value is added to the second Array. The test Function MUST return a 
 * Boolean. The test Function is invoked with the value, the index or key, and 
 * the collection.
 * 
 * @return {Array} An Array containing an Array of values that passed 
 * the test and an Array of those that failed.
 */
function partition(array, test) {
    return [filter(array, test), reject(array, test)];
}
module.exports.partition = partition;
