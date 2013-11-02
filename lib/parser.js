
var lexer = require('./lexer');
var TokenType = lexer.TokenType;

function ConstantExpression(value) {
    this.compile = function () {
        return value;
    };
}

function NameExpression(name) {
    this.compile = function () {
        return name;
    };
    
    this.getName = function () {
        return name;
    };
}

function ParensExpression(expr) {
    this.compile = function () {
        return '(' + expr.compile() + ')';
    };
}

function BinaryExpression (leftexpr, rightexpr, operator) {
    this.compile = function () {
        return leftexpr.compile() + ' ' + operator + ' ' + rightexpr.compile();
    }
}

function ReturnCommand(expr) {
    this.compile = function () {
        return 'return ' + expr.compile() + ';';
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
    
    this.getLeftExpression = function () {
        return expr;
    };
}

function Parser(text) {
    var lexr = lexer.createLexer(text);
    var tokens = [];
    var self = this;
    
    this.parseExpression = function () {
        var expr = parseTerm();
        
        if (expr === null)
            return null;
            
        for (var token = nextToken(); isBinaryOperator(token); token = nextToken())
            expr = new BinaryExpression(expr, parseTerm(), token.value);
            
        pushToken(token);
            
        return expr;
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
            
        var token = nextToken();
        
        if (isWord(token, 'return'))
            return new ReturnCommand(this.parseExpression());
            
        pushToken(token);
            
        var expr = this.parseExpression();
        
        token = nextToken();
        
        if (!token || token.type !== TokenType.Operator || token.value !== '=') {
            pushToken(token);
            return new ExpressionCommand(expr);
        }
        
        var expr2 = this.parseExpression();
        
        return new AssignmentCommand(expr, expr2);
    };
    
    this.parseProgram = function () {
        var commands = [];
        var names = [];
        
        for (var command = this.parseCommand(); command; command = this.parseCommand()) {
            if (command instanceof AssignmentCommand && command.getLeftExpression().getName) {
                var name = command.getLeftExpression().getName();
                if (names.indexOf(name) < 0)
                    names.push(name);
            }
                
            commands.push(command.compile());
        }
        
        names.forEach(function (name) {
            commands.unshift('int ' + name + ';');
        });
        
        return commands;
    };

    function parseTerm() {
        var token = nextToken();
        
        if (token === null)
            return null;
            
        if (token.type === TokenType.Name)
            return new NameExpression(token.value);
            
        if (token.type === TokenType.Punctuation && token.value === '(') {
            var expr = self.parseExpression();
            parseToken(')', TokenType.Punctuation);
            
            return new ParensExpression(expr);
        }
        
        return new ConstantExpression(token.value);
    }
    
    function nextToken() {
        if (tokens.length)
            return tokens.pop();
            
        return lexr.nextToken();
    }
    
    function pushToken(token) {
        tokens.push(token);
    }
    
    function parseToken(value, type) {
        var token = nextToken();
        
        if (!token || token.value !== value || token.type !== type)
            throw "Expected '" + value + "'";
    }
}

function isWord(token, name)
{
    return token && token.type === TokenType.Name && token.value === name;
}

var binaryoperators = '+-/*';

function isBinaryOperator(token)
{
    return token && token.type === TokenType.Operator && binaryoperators.indexOf(token.value) >= 0;
}

function createParser(text) {
    return new Parser(text);
}

module.exports = {
    createParser: createParser
}

