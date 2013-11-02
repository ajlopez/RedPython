
var parser = require('../lib/parser.js');

exports['compile integer'] = function (test) {
    var parsr = parser.createParser('123');
    parsr.parseIndent();
    
    var expr = parsr.parseExpression();
    test.ok(expr);
    test.equal(expr.compile(), '123');
    
    test.strictEqual(parsr.parseExpression(), null);
};

exports['compile name'] = function (test) {
    var parsr = parser.createParser('name');
    parsr.parseIndent();
    
    var expr = parsr.parseExpression();
    test.ok(expr);
    test.equal(expr.compile(), 'name');
    
    test.strictEqual(parsr.parseExpression(), null);
};

exports['get indent with zero size'] = function (test) {
    var parsr = parser.createParser('name');
    var indent = parsr.parseIndent();
    
    test.strictEqual(indent, 0);
};

exports['get indent with size equals two'] = function (test) {
    var parsr = parser.createParser('  name');
    var indent = parsr.parseIndent();
    
    test.strictEqual(indent, 2);
};

exports['compile simple expression command'] = function (test) {
    var parsr = parser.createParser('123');
    var command = parsr.parseCommand();
    
    test.ok(command);
    test.equal(command.compile(), '123;');
    
    test.strictEqual(parsr.parseCommand(), null);
};

exports['compile simple assignment command'] = function  (test) {
    var parsr = parser.createParser('a=123');
    var command = parsr.parseCommand();
    
    test.ok(command);
    test.equal(command.compile(), 'a = 123;');
    
    test.strictEqual(parsr.parseCommand(), null);
};

exports['compile simple program with assignment'] = function (test) {
    var parsr = parser.createParser('a=123');
    var program = parsr.parseProgram();
    test.ok(program);
    test.ok(Array.isArray(program));
    test.equal(program.length, 2);
    test.equal(program[0], 'int a;');
    test.equal(program[1], 'a = 123;');
};

exports['compile simple return command'] = function (test) {
    var parsr = parser.createParser('return 123');
    var command = parsr.parseCommand();
    
    test.ok(command);
    test.equal(command.compile(), 'return 123;');
    
    test.strictEqual(parsr.parseCommand(), null);
};