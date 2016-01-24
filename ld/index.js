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
    }
    return typeof value;
}
module.exports.typeOf = typeOf;

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
 * Based a a test Function, filter is designed to collect values from a 
 * collection, Array or Object, and return those filtered values.
 * 
 * @param {Array or Object} collection The collection from which to filter.
 * @param {Function} test The Function that tests whether values should be 
 * inlcuded in the returned output. The test Function MUST return a Boolean.
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
