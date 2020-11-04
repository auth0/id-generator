const crypto = require('crypto');

const ALPHA_NUM = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Largest integer we can read from a buffer.
//const RAND_MAX = 0xFFFF_FFFF_FFFF;
const RAND_MAX = Buffer.from("ff".repeat(6), "hex").readUIntBE(0, 6);
/*
 Generates an integer in [min, max) range where min is inclusive and max is
 exclusive.

 Backported from node.js v14 crypto.randomInt,
 https://nodejs.org/api/crypto.html#crypto_crypto_randomint_min_max_callback
 This version eplaces native NumberIsSafeInteger 
 with Number.isSafeInteger and uses locally defined rand_max values

 This function is licensed under the terms of the nodejs license,
 please see the NODEJS_LICENSE file in the root of this repository
*/
function randomInt(min, max, callback) {
  // Detect optional min syntax
  // randomInt(max)
  // randomInt(max, callback)
  const minNotSpecified = typeof max === 'undefined' ||
    typeof max === 'function';

  if (minNotSpecified) {
    callback = max;
    max = min;
    min = 0;
  }

  const isSync = typeof callback === 'undefined';
  if (!isSync && typeof callback !== 'function') {
    throw new ERR_INVALID_CALLBACK(callback);
  }
  if (!Number.isSafeInteger(min)) {
    throw new ERR_INVALID_ARG_TYPE('min', 'a safe integer', min);
  }
  if (!Number.isSafeInteger(max)) {
    throw new ERR_INVALID_ARG_TYPE('max', 'a safe integer', max);
  }
  if (max <= min) {
    throw new ERR_OUT_OF_RANGE(
      'max', `greater than the value of "min" (${min})`, max
    );
  }

  // First we generate a random int between [0..range)
  const range = max - min;

  if (!(range <= RAND_MAX)) {
    throw new ERR_OUT_OF_RANGE(`max${minNotSpecified ? '' : ' - min'}`,
                               `<= ${RAND_MAX}`, range);
  }

  const excess = RAND_MAX % range;
  const randLimit = RAND_MAX - excess;

  if (isSync) {
    // Sync API
    while (true) {
      const x = crypto.randomBytes(6).readUIntBE(0, 6);
      // If x > (maxVal - (maxVal % range)), we will get "modulo bias"
      if (x > randLimit) {
        // Try again
        continue;
      }
      const n = (x % range) + min;
      return n;
    }
  } else {
    // Async API
    const pickAttempt = () => {
      crypto.randomBytes(6, (err, bytes) => {
        if (err) return callback(err);
        const x = bytes.readUIntBE(0, 6);
        // If x > (maxVal - (maxVal % range)), we will get "modulo bias"
        if (x > randLimit) {
          // Try again
          return pickAttempt();
        }
        const n = (x % range) + min;
        callback(null, n);
      });
    };

    pickAttempt();
  }
}

const IdGenerator = function (prefixes) {
  if (Array.isArray(prefixes)) {
    this.prefixes = prefixes;
  }
  else if (typeof prefixes === 'string') {
    this.prefixes = [prefixes];
  }
  else if (typeof prefixes === 'object') {
    this.prefix = prefixes.prefix;
    this.prefixes = [this.prefix]
    this.len = prefixes.len || 16;
    this.alphabet = prefixes.alphabet || ALPHA_NUM;
    this.separator = prefixes.separator || '_';
  }
  else {
    this.len = 16;
    this.alphabet = ALPHA_NUM;
  }
  this.prefixes = this.prefixes || [];
};


IdGenerator.prototype.get = function () {
  const rnd = crypto.randomBytes(this.len);
  const value = new Array(this.len);
  const charsLength = this.alphabet.length;

  for (var i = 0; i < this.len; i++) {
    value[i] = this.alphabet[rnd[i] % charsLength];
  }

  if (this.prefix) {
    return this.prefix + this.separator + value.join('');
  }
  else {
    return value.join('');
  }
};

IdGenerator.prototype.newUid = function (len) {

  const value = new Array(len);
  for (var i = 0; i < len; i++) {
    value[i] = ALPHA_NUM[randomInt(0, ALPHA_NUM.length-1)];
  }
  return value.join('');
};


IdGenerator.prototype.new = function (prefix) {
  if (!prefix) {
    if (this.prefixes.length !== 1) {
      throw new Error('missing prefix for id');
    }
    prefix = this.prefixes[0];
  }

  if (this.prefixes.length && !~this.prefixes.indexOf(prefix)) {
    throw new Error('invalid prefix ' + prefix + ', valid: ' + this.prefixes);
  }

  return prefix + '_' + this.newUid(16);
};

module.exports = IdGenerator;
