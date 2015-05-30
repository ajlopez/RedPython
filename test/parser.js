
var parser = require('../lib/parser.js');

exports['compile integer'] = function (test) {
    var parsr = parser.createParser('123');
    parsr.parseIndent();
    
    var expr = parsr.parseExpression();
    test.ok(expr);
    test.equal(expr.compile(), '123');
    
    test.strictEqual(parsr.parseExpression(), null);
};

exports['compile integer expression to have int as type'] = function (test) {
    var parsr = parser.createParser('123');
    parsr.parseIndent();
    
    var expr = parsr.parseExpression();
    test.ok(expr);
    test.equal(expr.getType(), 'int');
};

exports['compile string'] = function (test) {
    var parsr = parser.createParser('"foo"');
    parsr.parseIndent();
    
    var expr = parsr.parseExpression();
    test.ok(expr);
    test.equal(expr.compile(), '"foo"');
    
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

exports['compile sum'] = function (test) {
    var parsr = parser.createParser('123+a');
    parsr.parseIndent();
    
    var expr = parsr.parseExpression();
    test.ok(expr);
    test.equal(expr.compile(), '123 + a');
    
    test.strictEqual(parsr.parseExpression(), null);
};

exports['compile arithmetic expression'] = function (test) {
    var parsr = parser.createParser('123+a-1*2/3');
    parsr.parseIndent();
    
    var expr = parsr.parseExpression();
    test.ok(expr);
    test.equal(expr.compile(), '123 + a - 1 * 2 / 3');
    
    test.strictEqual(parsr.parseExpression(), null);
};

exports['compile arithmetic expression with parens'] = function (test) {
    var parsr = parser.createParser('123+(a-1)*2/3');
    parsr.parseIndent();
    
    var expr = parsr.parseExpression();
    test.ok(expr);
    test.equal(expr.compile(), '123 + (a - 1) * 2 / 3');
    
    test.strictEqual(parsr.parseExpression(), null);
};

exports['compile simple call expression'] = function (test) {
    var parsr = parser.createParser('put("Hello, world")');
    parsr.parseIndent();
    
    var expr = parsr.parseExpression();
    test.ok(expr);
    test.equal(expr.compile(), 'put("Hello, world")');
    
    test.strictEqual(parsr.parseExpression(), null);
};

exports['compile simple call expression with two arguments'] = function (test) {
    var parsr = parser.createParser('add(1,2)');
    parsr.parseIndent();
    
    var expr = parsr.parseExpression();
    test.ok(expr);
    test.equal(expr.compile(), 'add(1, 2)');
    
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

exports['compile simple return command'] = function (test) {
    var parsr = parser.createParser('return 123');
    var command = parsr.parseCommand();
    
    test.ok(command);
    test.equal(command.compile(), 'return 123;');
    
    test.strictEqual(parsr.parseCommand(), null);
};

exports['compile simple if command'] = function (test) {
    var parsr = parser.createParser('if a:\n  b = 1');
    var command = parsr.parseCommand();
    
    test.ok(command);
    
    var result = command.compile();
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 2);
    test.equal(result[0], 'if (a)');
    test.ok(Array.isArray(result[1]));
    test.equal(result[1].length, 1);
    test.equal(result[1][0], 'b = 1;');
    
    test.strictEqual(parsr.parseCommand(), null);
};

exports['compile call with two arguments'] = function (test) {
    var parsr = parser.createParser('add(1, 2)');
    parsr.parseIndent();    
    var expr = parsr.parseExpression();
    
    test.ok(expr);
    
    var result = expr.compile();
    
    test.ok(result);
    test.equal(result, 'add(1, 2)');
    
    test.strictEqual(parsr.parseExpression(), null);
};
