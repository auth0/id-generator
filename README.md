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

## Author
[Auth0](http://auth0.com)

## License
This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
##