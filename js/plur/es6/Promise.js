/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject' ],
function(
    PlurObject ) {

/**
 * PlurPromise wrapper pre-ES6.
 *
 * @constructor plur/es6/Promise
 **
 */
var PlurPromise = function(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('PlurPromises must be constructed via new');
  } else if (typeof fn !== 'function') {
    throw new TypeError('not a function');
  }

  this._state = 0;
  this._value = null;
  this._deferreds = [];

  if (fn !== PlurPromise.noop) {
    PlurPromise._doResolve(fn, this);
  }
};

PlurPromise.prototype = PlurObject.create('plur/es6/Promise', PlurPromise);

PlurPromise.noop = function() {};

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - PlurPromise._rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.

// to avoid using try/catch inside critical functions, we
// extract them to here.
PlurPromise._LAST_ERROR = null;

PlurPromise._IS_ERROR = {};

PlurPromise._getThen = function(obj) {
  try {
    return obj.then;
  } catch (ex) {
    PlurPromise._LAST_ERROR = ex;
    return PlurPromise._IS_ERROR;
  }
};

PlurPromise._tryCallOne = function(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    PlurPromise._LAST_ERROR = ex;
    return PlurPromise._IS_ERROR;
  }
};

PlurPromise._tryCallTwo = function(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    PlurPromise._LAST_ERROR = ex;
    return PlurPromise._IS_ERROR;
  }
};


PlurPromise._safeThen = function(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new PlurPromise(PlurPromise.noop);
    res.then(PlurPromise._resolve, PlurPromise._reject);
    PlurPromise._handle(self, new PlurPromise._Handler(onFulfilled, onRejected, res));
  });
};

PlurPromise._handle = function(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }

  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }

  (function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._state === 1) {
        PlurPromise._resolve(deferred.promise, self._value);
      } else {
        PlurPromise._reject(deferred.promise, self._value);
      }
      return;
    }
    var ret = PlurPromise._tryCallOne(cb, self._value);
    if (ret === PlurPromise._IS_ERROR) {
      PlurPromise._reject(deferred.promise, PlurPromise._LAST_ERROR);
    } else {
      PlurPromise._resolve(deferred.promise, ret);
    }
  })();
};

PlurPromise._resolve = function(self, newValue) {
  // PlurPromise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return PlurPromise._reject(
      self,
      new TypeError('A promise cannot be PlurPromise._resolved with itself.')
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = PlurPromise._getThen(newValue);
    if (then === PlurPromise._IS_ERROR) {
      return PlurPromise._reject(self, PlurPromise._LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof PlurPromise
    ) {
      self._state = 3;
      self._value = newValue;
      PlurPromise._finale(self);
      return;
    } else if (typeof then === 'function') {
      PlurPromise._doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._state = 1;
  self._value = newValue;
  PlurPromise._finale(self);
};

PlurPromise._reject = function(self, newValue) {
  self._state = 2;
  self._value = newValue;
  PlurPromise._finale(self);
};

PlurPromise._finale = function(self) {
  for (var i = 0; i < self._deferreds.length; i++) {
    PlurPromise._handle(self, self._deferreds[i]);
  }

  self._deferreds = null;
};

PlurPromise._Handler = function(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
};

/**
 * Take a potentially misbehaving PlurPromise._resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
PlurPromise._doResolve = function(fn, promise) {
  var done = false;
  var res = PlurPromise._tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    PlurPromise._resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    PlurPromise._reject(promise, reason);
  })
  if (!done && res === PlurPromise._IS_ERROR) {
    done = true;
    PlurPromise._reject(promise, PlurPromise._LAST_ERROR);
  }
};

PlurPromise._value = function(value) {
  var p = new PlurPromise(PlurPromise.noop);
  p._state = 1;
  p._value = value;
  return p;
};

PlurPromise._TRUE = PlurPromise._value(true);
PlurPromise._FALSE = PlurPromise._value(false);
PlurPromise._NULL = PlurPromise._value(null);
PlurPromise._UNDEFINED = PlurPromise._value(undefined);
PlurPromise._ZERO = PlurPromise._value(0);
PlurPromise._EMPTRYSTRING = PlurPromise._value('');

PlurPromise.resolve = function (value) {
  if (value instanceof PlurPromise) return value;

  if (value === null) return PlurPromise._NULL;
  if (value === undefined) return PlurPromise._UNDEFINED;
  if (value === true) return PlurPromise._TRUE;
  if (value === false) return PlurPromise._FALSE;
  if (value === 0) return PlurPromise._ZERO;
  if (value === '') return PlurPromise._EMPTRYSTRING;

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then;
      if (typeof then === 'function') {
        return new PlurPromise(then.bind(value));
      }
    } catch (ex) {
      return new PlurPromise(function (resolve, reject) {
        PlurPromise._reject(ex);
      });
    }
  }

  return PlurPromise._value(value);
};

PlurPromise.all = function (arr) {
  var args = Array.prototype.slice.call(arr);

  return new PlurPromise(function (resolve, reject) {
    if (args.length === 0) return PlurPromise._resolve([]);
    var remaining = args.length;
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        if (val instanceof PlurPromise && val.then === PlurPromise.prototype.then) {
          while (val._state === 3) {
            val = val._value;
          }
          if (val._state === 1) return res(i, val._value);
          if (val._state === 2) PlurPromise._reject(val._value);
          val.then(function (val) {
            res(i, val);
          }, PlurPromise._reject);
          return;
        } else {
          var then = val.then;
          if (typeof then === 'function') {
            var p = new PlurPromise(then.bind(val));
            p.then(function (val) {
              res(i, val);
            }, PlurPromise._reject);
            return;
          }
        }
      }
      args[i] = val;
      if (--remaining === 0) {
        PlurPromise._resolve(args);
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

PlurPromise.reject = function (value) {
  return new PlurPromise(function (resolve, reject) {
    PlurPromise._reject(value);
  });
};

PlurPromise.race = function (values) {
  return new PlurPromise(function (resolve, reject) {
    values.forEach(function(value){
      PlurPromise._resolve(value).then(PlurPromise._resolve, PlurPromise._reject);
    });
  });
};

PlurPromise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== PlurPromise) {
    return PlurPromise._safeThen(this, onFulfilled, onRejected);
  }
  var res = new PlurPromise(PlurPromise.noop);
  PlurPromise._handle(this, new PlurPromise._Handler(onFulfilled, onRejected, res));
  return res;
};

PlurPromise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};

PlurPromise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this;
  self.then(null, function (err) {
    setTimeout(function () {
      throw err;
    }, 0);
  });
};

return PlurPromise;
});