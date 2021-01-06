/*
The operation of the randomInteger function within this file derives from elements within
https://nodejs.org/api/crypto.html#crypto_crypto_randomint_min_max_callback.  The implementation
is not designed to be compatible with the original node version, but will make use of an underlying
native implementation if it exists.
*/

const crypto = require('crypto');

// Largest integer we can read from a buffer.
const RAND_MAX = Buffer.from("ff".repeat(6), "hex").readUIntBE(0, 6);

/**
 * Generates an integer between 0 and maximum range where 0 is inclusive and maximum is
 * exclusive.
 * @param maximum { number } a natural number specifying the maximum random value that can be returned
 * @returns { number } a natural number between 0 and the specified maximum
 * @throws { Error } Will throw when the maximum argument is less than 0
 * @throws { Error } Will throw when the maximum argument is an unsafe integer
 * @throws { Error } Will throw when the maximum argument is larger than the maximum value readable by a Buffer
 **/
function randomInteger(maximum) {
    // detect if there is a native implementation we can use instead
    if(typeof crypto.randomInt === "function"){
        return crypto.randomInt(maximum);
    }

    if(maximum < 0){
        throw new Error(`"max" must be a natural number. value:${maximum}`);
    }

    if (!Number.isSafeInteger(maximum)) {
        throw new Error(`"max" value must be a safe integer. value:${maximum}`);
    }

    if (!(maximum <= RAND_MAX)) {
        throw new Error(`max ${maximum} <= ${RAND_MAX}`);
    }

    while (true) {
        const x = crypto.randomBytes(6).readUIntBE(0, 6);
        // If x > (maxVal - (maxVal % maximum)), we will get "modulo bias"
        if (x > RAND_MAX - RAND_MAX % maximum) {
            // Try again
            continue;
        }
        return (x % maximum);
    }
}

module.exports = randomInteger;