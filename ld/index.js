'use strict';

function identity(value) {
    return value;
}
module.exports.identity = identity;

function typeOf(value) {
    if (Array.isArray(value)) {
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
    if (Array.isArray(collection)) {
        for (var i = 0; i < collection.length; i++) {
            action(collection[i], i, collection);
        }
    } else {
        for (var key in collection) {
            action(collection[key], key, collection);
        }
    }
}
module.exports.each = each;

function eachRight(collection, action) {
    if (Array.isArray(collection)) {
        iterArrayAtRight(collection, action);
    } else {
        iterObjectAtRight(collection, action);
    }
}
module.exports.eachRight = eachRight;

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
    each(collection, function (value, position, collection) {
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
    each(collection, function (value, position, collection) {
        if (test(value, position, collection)) filtered.push(value);
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

function indexOf(array, target) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === target) {
            return i;
        }
    }
    return -1;
}
module.exports.indexOf = indexOf;

/**
 * pluck: Takes an Array of Object and returns an Array representing the values 
 * of the specified key. The function map provide the same functionality.
 * 
 * @param {Array} collection An Array of Object on which to perform the key search.
 * @param {String} key A String representing the key to look for in each Object
 * if the Array.
 * 
 * @return {Array} An Array containing the values plucked at the given key from 
 * the Array of Object.
 */
function pluck(collection, key) {
    return map(collection, function (object) {
      return object[key];
    });
}
module.exports.pluck = pluck;

function unique(array) {
    return reduce(array, function (uniqueVals, value) {
        if (indexOf(uniqueVals, value) === -1) uniqueVals.push(value);
        return uniqueVals;
    }, []);
}
module.exports.unique = unique;

function contains(collection, target) {
    if (Array.isArray(collection)) {
      if (indexOf(collection, target) > -1) return true;
    } else {
      for (var key in collection) {
        if (collection[key] === target) return true;
      }
    }
    return false;
}
module.exports.contains = contains;

function reduce(collection, summarize, start) {
    var summary = start;
    var startAt = 0;
    if (start === undefined) {
        summary = getFirstCollectionValue(collection);
        startAt = 1;
    }
    iterAt(collection, function (value, position, collection) {
        summary = summarize(summary, value, position, collection);
    }, startAt);
    return summary;
}
module.exports.reduce = reduce;

function reduceRight(collection, combine, start) {
  var startAtIndex, summary;
  
  if (start === undefined) {
    startAtIndex = length(collection) - 2;
    summary = getLastCollectionValue(collection);
  } else {
    startAtIndex = length(collection) - 1;
    summary = start;
  }
  
  iterAtRight(collection, function(value, position, collection) { 
      summary = combine(summary, value, position, collection);
  }, startAtIndex);
  return summary;
}
module.exports.reduceRight = reduceRight;

function getFirstCollectionValue(collection) {
    if (Array.isArray(collection)) {
        return collection[0];
    }
    return collection[first(Object.keys(collection))];
}

function getLastCollectionValue(collection) {
    if (Array.isArray(collection)) {
        return last(collection);
    }
    return collection[last(Object.keys(collection))];
}

function length(collection) {
    return collection.length || Object.keys(collection).length;
}

function iterAt(collection, action, startAtIndex) {
    startAtIndex = startAtIndex || 0;
    if (Array.isArray(collection)) {
        iterArrayAt(collection, action, startAtIndex);
    } else {
        iterObjectAt(collection, action, startAtIndex);
    }
}
module.exports.eachAt = iterAt;

function iterAtRight(collection, action, startAtIndex) {
    if (Array.isArray(collection)) {
        iterArrayAtRight(collection, action, startAtIndex);
    } else {
        iterObjectAtRight(collection, action, startAtIndex);
    }
}
module.exports.eachAtRight = iterAtRight;

function iterArrayAt(array, action, startAtIndex) {
    var i = startAtIndex || 0;
    for (; i < array.length; i++) {
        action(array[i], i, array);
    }
}

function iterObjectAt(object, action, startAtIndex) {
    var i = startAtIndex || 0;
    var keys = Object.keys(object);
    for (; i < keys.length; i++) {
        action(object[keys[i]], keys[i], object);
    }
}

function iterArrayAtRight(array, action, startAtIndex) {
    var i = startAtIndex || array.length - 1;
    for (; i > -1; i--) {
        action(array[i], i, array);
    }
}

function iterObjectAtRight(object, action, startAtIndex) {
    var keys = Object.keys(object);
    var i = startAtIndex || keys.length - 1;
    for (; i > -1; i--) {
        action(object[keys[i]], keys[i], object);
    }
}

function some(collection, test) {
    test = test || identity;
    if (Array.isArray(collection)) {
        for (var i = 0; i < collection.length; i++) {
            if (test(collection[i], i, collection)) {
                return true;
            }
        }
    } else {
        for (var key in collection) {
            if (test(collection[key], key, collection)) {
                return true;
            }
        }
    }
    return false;
}
module.exports.some = some;

function every(collection, test) {
    test = test || identity;
    if (Array.isArray(collection)) {
        for (var i = 0; i < collection.length; i++) {
            if (!test(collection[i], i, collection)) {
                return false;
            }
        }
    } else {
        for (var key in collection) {
            if (!test(collection[key], key, collection)) {
                return false;
            }
        }
    }
    return true;
}
module.exports.every = every;

function extend(copyTo) {
    var sources = Array.prototype.slice.call(arguments, 1);
    iterArrayAt(sources, function (copyFrom) {
        iterObjectAt(copyFrom, function (value, key) {
            copyTo[key] = value;
        });
    });
    return copyTo;
}
module.exports.extend = extend;
