
var lexer = require('./lexer');

function ConstantExpression(value) {
    this.compile = function () {
        return value;
    };
}

function Parser(text) {
    var lexr = lexer.createLexer(text);
    
    this.parseExpression = function () {
        var token = lexr.nextToken();
        
        if (token === null)
            return null;
        
        return new ConstantExpression(token.value);
    }
    
    this.parseIndent = function () {
        return lexr.nextToken().value;
    }
}

function createParser(text) {
    return new Parser(text);
}

module.exports = {
    createParser: createParser
}

