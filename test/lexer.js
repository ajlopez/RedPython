
var lexer = require('../lib/lexer.js');
TokenType = lexer.TokenType;

exports['get null if empty string'] = function (test) {
    var lxr = lexer.createLexer('');
    
    test.strictEqual(lxr.nextToken(), null);
}

exports['get null if blank string'] = function (test) {
    var lxr = lexer.createLexer('    ');
    
    test.strictEqual(lxr.nextToken(), null);
}

exports['get null if empty lines'] = function (test) {
    var lxr = lexer.createLexer('  \n   \n');
    
    test.strictEqual(lxr.nextToken(), null);
}

exports['get null if empty lines with carriage return'] = function (test) {
    var lxr = lexer.createLexer('  \r\n   \n');
    
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

exports['get indent two spaces and name'] = function (test) {
    var lxr = lexer.createLexer('  name');
    
    var token = lxr.nextToken();
    test.ok(token);
    test.equal(token.type, TokenType.Indent);
    test.equal(token.value, 2);
    
    token = lxr.nextToken();
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'name');
    
    test.strictEqual(lxr.nextToken(), null);
};

exports['get indent two spaces and name skipping empty lines'] = function (test) {
    var lxr = lexer.createLexer('    \r\n\n  name');
    
    var token = lxr.nextToken();
    test.ok(token);
    test.equal(token.type, TokenType.Indent);
    test.equal(token.value, 2);
    
    token = lxr.nextToken();
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'name');
    
    test.strictEqual(lxr.nextToken(), null);
};

exports['get parenthesis as punctuation'] = function (test) {
    var lxr = lexer.createLexer('()');
    
    var token = lxr.nextToken();
    test.ok(token);
    test.equal(token.type, TokenType.Indent);
    test.equal(token.value, 0);
    
    token = lxr.nextToken();
    test.ok(token);
    test.equal(token.type, TokenType.Punctuation);
    test.equal(token.value, '(');
    
    token = lxr.nextToken();
    test.ok(token);
    test.equal(token.type, TokenType.Punctuation);
    test.equal(token.value, ')');
    
    test.strictEqual(lxr.nextToken(), null);
};

exports['get colons as punctuation'] = function (test) {
    var lxr = lexer.createLexer(':');
    
    var token = lxr.nextToken();
    test.ok(token);
    test.equal(token.type, TokenType.Indent);
    test.equal(token.value, 0);
    
    token = lxr.nextToken();
    test.ok(token);
    test.equal(token.type, TokenType.Punctuation);
    test.equal(token.value, ':');
    
    test.strictEqual(lxr.nextToken(), null);
};