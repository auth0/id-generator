/*
License notes:
Elements within this file derives from elements within 
https://nodejs.org/api/crypto.html#crypto_crypto_randomint_min_max_callback
and is subject to the terms of the NODEJS_LICENSE in the root of this repository.
*/

const crypto = require('crypto');

// Largest integer we can read from a buffer.
//const RAND_MAX = 0xFFFF_FFFF_FFFF;
const RAND_MAX = Buffer.from("ff".repeat(6), "hex").readUIntBE(0, 6);

/*
 Generates an integer in [min, max) range where min is inclusive and max is
 exclusive.

 Derived from node.js v14 crypto.randomInt,
 https://nodejs.org/api/crypto.html#crypto_crypto_randomint_min_max_callback
 
 
 Notes about differences with the node.js implementation:
  - Removes async codepath entirely
  - Swaps native NumberIsSafeInteger with Number.isSafeInteger and uses locally defined rand_max values
  - Switches to generic Error exceptions, rather than ERR_-type exceptions
*/
function randomInt(min, max) {

    // detect if there is a native implementation we can use instead
    if(typeof crypto.randomInt === "function"){
        return crypto.randomInt(min, max);
    }

    // Detect optional min syntax
    // randomInt(max)
    const minNotSpecified = typeof max === 'undefined';

    if (minNotSpecified) {
        max = min;
        min = 0;
    }

    if (!Number.isSafeInteger(min)) {
        throw new Error(`"min" value must be a safe integer. value:${min}`);
    }
    if (!Number.isSafeInteger(max)) {
        throw new Error(`"max" value must be a safe integer. value:${max}`);
    }
    if (max <= min) {
        throw new Error(`"max" value (${max}) must be greater than the value of "min" (${min})`);
    }

    // First we generate a random int between [0..range)
    const range = max - min;

    if (!(range <= RAND_MAX)) {
        throw new ERR_OUT_OF_RANGE(`max${minNotSpecified ? '' : ' - min'}`,
            `<= ${RAND_MAX}`, range);
    }

    const excess = RAND_MAX % range;
    const randLimit = RAND_MAX - excess;

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
}

module.exports = randomInt;