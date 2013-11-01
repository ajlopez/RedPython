
var lexer = require('../lib/lexer.js');
TokenType = lexer.TokenType;

exports['get null if empty string'] = function (test) {
    var lxr = lexer.createLexer('');
    
    test.strictEqual(lxr.nextToken(), null);
}

exports['get indent and name'] = function (test) {
    var lxr = lexer.createLexer('name');
    
    var token = lxr.nextToken();
    test.ok(token);
    test.equal(token.type, TokenType.Indent);
    test.equal(token.value, 0);
    
    token = lxr.nextToken();
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'name');
    
    test.strictEqual(lxr.nextToken(), null);
};