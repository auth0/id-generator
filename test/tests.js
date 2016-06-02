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

describe('with a non default separator provided', function() {
  var id_generator;
  before(function(){
    id_generator = new IdGenerator(['cus', 'con'], '-');
  });

  it ('an id should be provided with the new separator', function(){
    var id = id_generator.new('cus');
    expect(id).to.have.length(20);
    expect(id).to.match(/^cus-[a-zA-Z0-9]{16}$/);
  });
});
