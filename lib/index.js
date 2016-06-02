var Random = require('random-js');
var engine = Random.engines.mt19937().autoSeed();
var distribution = Random.integer(0, 61);
var ALPHA_NUM = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

var IdGenerator = function(prefixes, separator){
  if (Array.isArray(prefixes)) {
    this.prefixes = prefixes;
  }
  if (typeof prefixes === 'string') {
    this.prefixes = [prefixes];
  }
  this.prefixes = this.prefixes ||  [];

  if (typeof separator === 'string') {
    this.separator = separator;
  } 
  this.separator = this.separator || '_';
};

IdGenerator.prototype.new = function(prefix, separator) {
  if (!prefix) {
    if (this.prefixes.length !== 1) {
      throw new Error('missing prefix for id');
    }
    prefix = this.prefixes[0];
  }

  if (this.prefixes.length && !~this.prefixes.indexOf(prefix)){
    throw new Error('invalid prefix ' + prefix + ', valid: ' + this.prefixes);
  }

  if (!separator || typeof separator != 'string') {
    separator = this.separator
  }

  var id = '';
  for (var i = 1; i <= 16; i++) {
    id += ALPHA_NUM[distribution(engine)];
  }

  return prefix + separator + id;
};

module.exports = IdGenerator;
