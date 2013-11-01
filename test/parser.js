
var parser = require('../lib/parser.js');

exports['compile integer'] = function (test) {
    var parsr = parser.createParser('123');
    parsr.parseIndent(0);
    
    var expr = parsr.parseExpression();
    test.ok(expr);
    test.equal(expr.compile(), '123');
    
    test.strictEqual(parsr.parseExpression(), null);
};