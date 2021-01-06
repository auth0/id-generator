# id-generator
Generates random ids with a prefix (a la Stripe)

## Installing
```
npm i auth0-id-generator
```

## Using
Simple case:
```javascript
var IdGenerator = require('auth0-id-generator');

var generator = new IdGenerator();
var id = generator.new('cus');

console.log(id); // cus_lO1DEQWBbQAACfHO
```

Predefined set of allowed prefixes (to avoid mistakes):
```javascript
var IdGenerator = require('auth0-id-generator');

var generator = new IdGenerator(['cus', 'con']);
var id = generator.new('cus');

console.log(id); // cus_lO1DEQWBbQAACfHO

generator.new('cli'); // throws
```

To get a uid (id with a given length and without prefix):
```javascript
var IdGenerator = require('auth0-id-generator');

var generator = new IdGenerator(['cus', 'con']);
var id = generator.newUid(10);

console.log(id); // lO1DEQWBbQ
```

## New API
Updated api allows more customizations. Uses a new method `.get()`:
```javascript
var generator = new IdGenerator({len: 5, alphabet: 'abc123', prefix: 'foo', separator: ':'});

generator.get();  // -> foo:2a2b1
```

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
