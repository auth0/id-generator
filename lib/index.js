const crypto = require('crypto');

const ALPHA_NUM = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const IdGenerator = function(prefixes){
  if (Array.isArray(prefixes)) {
    this.prefixes = prefixes;
  }
  if (typeof prefixes === 'string') {
    this.prefixes = [prefixes];
  }
  this.prefixes = this.prefixes ||  [];
};


IdGenerator.prototype.newUid = function(len) {
  const rnd = crypto.randomBytes(len);
  const value = new Array(len);
  const charsLength = ALPHA_NUM.length;

  for (var i = 0; i < len; i++) {
    value[i] = ALPHA_NUM[rnd[i] % charsLength];
  }

  return value.join('');
};


IdGenerator.prototype.new = function(prefix) {
  if (!prefix) {
    if (this.prefixes.length !== 1) {
      throw new Error('missing prefix for id');
    }
    prefix = this.prefixes[0];
  }

  if (this.prefixes.length && !~this.prefixes.indexOf(prefix)){
    throw new Error('invalid prefix ' + prefix + ', valid: ' + this.prefixes);
  }

  return prefix + '_' + this.newUid(16);
};

module.exports = IdGenerator;
