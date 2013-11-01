
var parser = require('../lib/parser.js');

exports['compile integer'] = function (test) {
    var parsr = parser.createParser('123');
    parsr.parseIndent();
    
    var expr = parsr.parseExpression();
    test.ok(expr);
    test.equal(expr.compile(), '123');
    
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

exports['get simple expression command'] = function (test) {
    var parsr = parser.createParser('123');
    var command = parsr.parseCommand();
    
    test.ok(command);
    test.equal(command.compile(), '123;');
    
    test.strictEqual(parsr.parseCommand(), null);
};

