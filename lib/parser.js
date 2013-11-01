
var lexer = require('./lexer');

function ConstantExpression(value) {
    this.compile = function () {
        return value;
    };
}

function ExpressionCommand(expr) {
    this.compile = function () {
        return expr.compile() + ';';
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
        var token = lexr.nextToken();
        
        if (token === null)
            return null;
            
        return token.value;
    }
    
    this.parseCommand = function () {
        if (this.parseIndent() === null)
            return null;
            
        var expr = this.parseExpression();
        return new ExpressionCommand(expr);
    };
}

function createParser(text) {
    return new Parser(text);
}

module.exports = {
    createParser: createParser
}

