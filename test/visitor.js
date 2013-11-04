
var parser = require('../lib/parser.js');

exports['visit constant expression'] = function (test) {
    var count = 0;
    
    var parsr = parser.createParser('123');
    parsr.parseIndent();
    var expr = parsr.parseExpression();
    
    var visitor = {
        visitConstantExpression: function (node) {
            test.ok(node);
            test.equal(node.getValue(), 123);
            count++;
        }
    }
    
    expr.visit(visitor);
    test.equal(count, 1);
};

exports['visit constant expression using visit generic'] = function (test) {
    var count = 0;
    
    var parsr = parser.createParser('123');
    parsr.parseIndent();
    var expr = parsr.parseExpression();
    
    var visitor = {
        visitGeneric: function (node) {
            test.ok(node);
            test.equal(node.getValue(), 123);
            count++;
        }
    }
    
    expr.visit(visitor);
    test.equal(count, 1);
};

exports['visit string expression'] = function (test) {
    var count = 0;
    
    var parsr = parser.createParser('"foo"');
    parsr.parseIndent();
    var expr = parsr.parseExpression();
    
    var visitor = {
        visitStringExpression: function (node) {
            test.ok(node);
            test.equal(node.getValue(), 'foo');
            count++;
        }
    }
    
    expr.visit(visitor);
    test.equal(count, 1);
};

exports['visit string expression using visit generic'] = function (test) {
    var count = 0;
    
    var parsr = parser.createParser('"foo"');
    parsr.parseIndent();
    var expr = parsr.parseExpression();
    
    var visitor = {
        visitGeneric: function (node) {
            test.ok(node);
            test.equal(node.getValue(), 'foo');
            count++;
        }
    }
    
    expr.visit(visitor);
    test.equal(count, 1);
};

exports['visit name expression'] = function (test) {
    var count = 0;
    
    var parsr = parser.createParser('bar');
    parsr.parseIndent();
    var expr = parsr.parseExpression();
    
    var visitor = {
        visitNameExpression: function (node) {
            test.ok(node);
            test.equal(node.getName(), 'bar');
            count++;
        }
    }
    
    expr.visit(visitor);
    test.equal(count, 1);
};

exports['visit name expression using visit generic'] = function (test) {
    var count = 0;
    
    var parsr = parser.createParser('spam');
    parsr.parseIndent();
    var expr = parsr.parseExpression();
    
    var visitor = {
        visitGeneric: function (node) {
            test.ok(node);
            test.equal(node.getName(), 'spam');
            count++;
        }
    }
    
    expr.visit(visitor);
    test.equal(count, 1);
};

exports['visit binary expression'] = function (test) {
    var count = 0;
    
    var parsr = parser.createParser('1+a');
    parsr.parseIndent();
    var expr = parsr.parseExpression();
    
    var visitor = {
        visitBinaryExpression: function (node) {
            test.ok(node);
            test.equal(node.getLeftExpression().compile(), '1');
            test.equal(node.getRightExpression().compile(), 'a');
            test.equal(node.getOperator(), '+');
            count++;
        }
    }
    
    expr.visit(visitor);
    test.equal(count, 1);
};

exports['visit binary expression using visit generic'] = function (test) {
    var count = 0;
    
    var parsr = parser.createParser('1+a');
    parsr.parseIndent();
    var expr = parsr.parseExpression();
    
    var visitor = {
        visitGeneric: function (node) {
            test.ok(node);
            test.equal(node.getLeftExpression().compile(), '1');
            test.equal(node.getRightExpression().compile(), 'a');
            test.equal(node.getOperator(), '+');
            count++;
        }
    }
    
    expr.visit(visitor);
    test.equal(count, 1);
};

exports['visit if command'] = function (test) {
    var count = 0;
    
    var parsr = parser.createParser('if b:\r\n  a = 1');
    var cmd = parsr.parseCommand();
    
    var visitor = {
        visitIfCommand: function (node) {
            test.ok(node);
            test.equal(node.getExpression().compile(), 'b');
            test.equal(node.getCommand().compile(), 'a = 1;');
            count++;
        }
    }
    
    cmd.visit(visitor);
    test.equal(count, 1);
};

exports['visit while command'] = function (test) {
    var count = 0;
    
    var parsr = parser.createParser('while b:\r\n  a = 1');
    var cmd = parsr.parseCommand();
    
    var visitor = {
        visitWhileCommand: function (node) {
            test.ok(node);
            test.equal(node.getExpression().compile(), 'b');
            test.equal(node.getCommand().compile(), 'a = 1;');
            count++;
        }
    }
    
    cmd.visit(visitor);
    test.equal(count, 1);
};


