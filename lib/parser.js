
var lexer = require('./lexer');
var TokenType = lexer.TokenType;

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

function AssignmentCommand(expr, expr2) {
    this.compile = function () {
        return expr.compile() + ' = ' + expr2.compile() + ';';
    };
}

function Parser(text) {
    var lexr = lexer.createLexer(text);
    var tokens = [];
    
    this.parseExpression = function () {
        var token = nextToken();
        
        if (token === null)
            return null;
        
        return new ConstantExpression(token.value);
    }
    
    this.parseIndent = function () {
        var token = nextToken();
        
        if (token === null)
            return null;
            
        return token.value;
    }
    
    this.parseCommand = function () {
        if (this.parseIndent() === null)
            return null;
            
        var expr = this.parseExpression();
        
        var token = nextToken();
        
        if (!token || token.type !== TokenType.Operator || token.value !== '=') {
            pushToken(token);
            return new ExpressionCommand(expr);
        }
        
        var expr2 = this.parseExpression();
        
        return new AssignmentCommand(expr, expr2);
    };
    
    function nextToken() {
        if (tokens.length)
            return tokens.pop();
            
        return lexr.nextToken();
    }
    
    function pushToken(token) {
        tokens.push(token);
    }
}

function createParser(text) {
    return new Parser(text);
}

module.exports = {
    createParser: createParser
}

