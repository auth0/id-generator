const crypto = require('crypto');

const ALPHA_NUM = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const IdGenerator = function(prefixes){
  if (Array.isArray(prefixes)) {
    this.prefixes = prefixes;
  }
  else if (typeof prefixes === 'string') {
    this.prefixes = [prefixes];
  }
  else if (typeof prefixes === 'object') {
    this.prefix = prefixes.prefix;

    this.len = prefixes.len  || 16;
    this.alphabet = prefixes.alphabet || ALPHA_NUM;
  }
  else {
    this.len = 16;
    this.alphabet = ALPHA_NUM;
  }
  this.prefixes = this.prefixes ||  [];
};

IdGenerator.prototype.get = function() {
  const rnd = crypto.randomBytes(this.len);
  const value = new Array(this.len);
  const charsLength = this.alphabet.length;

  for (var i = 0; i < this.len; i++) {
    value[i] = this.alphabet[rnd[i] % charsLength];
  }

  if(this.prefix) {
    return this.prefix + '_' + value.join('');
  }
  else {
    return value.join('');
  }
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
