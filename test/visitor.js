
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