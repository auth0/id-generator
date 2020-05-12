var expect  = require('chai').expect;
var IdGenerator = require('../lib');

describe('with no accepted prefix list', function () {
  var id_generator;
  before(function(){
    id_generator = new IdGenerator();
  });

  it ('should generate id with provided prefix', function(){
    var id = id_generator.new('cus');
    expect(id).to.have.length(20);
    expect(id).to.match(/^cus_[a-zA-Z0-9]{16}$/);
  });

  it ('should throw if no prefix is provided', function(){
    expect(function () {
      id_generator.new();
    }).to.throw(Error, /missing prefix for id/);
  });
});

describe('with accepted prefix list', function () {
  var id_generator;
  before(function(){
    id_generator = new IdGenerator(['cus', 'con']);
  });

  it ('should generate id if prefix is in list', function(){
    var id = id_generator.new('cus');
    expect(id).to.have.length(20);
    expect(id).to.match(/^cus_[a-zA-Z0-9]{16}$/);
  });

  it ('should throw prefix is not in list', function(){
    expect(function() { id_generator.new('cli') }).to.throw(Error, /invalid prefix cli, valid: cus,con/);
  });
});

describe('with one accepted prefix', function () {
  var id_generator;
  before(function(){
    id_generator = new IdGenerator('cus');
  });

  it ('should generate the id with the default prefix', function(){
    var id = id_generator.new();
    expect(id).to.have.length(20);
    expect(id).to.match(/^cus_[a-zA-Z0-9]{16}$/);
  });
});

describe('uid', function () {
  var id_generator;
  before(function(){
    id_generator = new IdGenerator('cus');
  });

  it ('should generate an uid with specified len', function(){
    var id = id_generator.newUid(30);
    expect(id).to.have.length(30);
    expect(id).to.match(/^[a-zA-Z0-9]{30}$/);
  });
});

describe('api v1: with length, alphabet and prefix defined', function () {
  var id_generator;
  before(function(){
    id_generator = new IdGenerator({ len: 4, alphabet: 'abcd1234', prefix: 'usr' });
  });

  it ('should generate the id with the defined prefix, length and alphabet', function(){
    var id = id_generator.get();
    expect(id).to.have.length(8);
    expect(id).to.match(/^usr_[a-d1-4]{4}$/);
  });
});

describe('api v1: with length and prefix defined', function () {
  var id_generator;
  before(function(){
    id_generator = new IdGenerator({ len: 4, prefix: 'tkt' });
  });

  it ('should generate the id with the defined length and prefix and the default alphabet', function(){
    var id = id_generator.get();
    expect(id).to.have.length(8);
    expect(id).to.match(/^tkt_[a-zA-Z0-9]{4}$/);
  });
});

describe('api v1: with custom separator', function () {
  var id_generator;
  before(function(){
    id_generator = new IdGenerator({ len: 4, prefix: 'tkt', separator: '@' });
  });

  it ('should generate the id with the defined separator', function(){
    var id = id_generator.get();
    expect(id).to.have.length(8);
    expect(id).to.match(/^tkt@[a-zA-Z0-9]{4}$/);
  });
});

describe('api v1: with nothing defined', function () {
  var id_generator;
  before(function(){
    id_generator = new IdGenerator();
  });

  it ('should generate the id with the default length, prefix and alphabet', function(){
    var id = id_generator.get();
    expect(id).to.have.length(16);
    expect(id).to.match(/^[a-zA-Z0-9]{16}$/);
  });
});
