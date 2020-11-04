var IdGenerator = require('../lib');
var LIMIT = 100000;

id_generator = new IdGenerator();

console.time("idgen");

for(i = 1; i < LIMIT; i++){
    var id = id_generator.new('cus');
}

console.timeEnd("idgen");