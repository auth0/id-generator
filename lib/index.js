var crypto = require('crypto');

var ALPHA_NUM = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randomAlphaNum() {
  return ALPHA_NUM[Math.round(Math.random() * (ALPHA_NUM.length - 1))];
}

var IdGenerator = function(prefixes){
  if (Array.isArray(prefixes)) {
    this.prefixes = prefixes;
  }
  if (typeof prefixes === 'string') {
    this.prefixes = [prefixes];
  }
  this.prefixes = this.prefixes ||  [];
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

  var initial = crypto.randomBytes(12).toString('base64').split('');
  return prefix + '_' + initial.map(function(c){
    if (c === '/' || c === '+'){
      return randomAlphaNum();
    }

    return c;
  }).join('');
};

module.exports = IdGenerator;