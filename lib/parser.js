
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
    
    this.parseExpression = function () {
        var token = nextToken();
        
        if (token === null)
            return null;
            
        if (token.type == TokenType.Name)
            return new NameExpression(token.value);
        
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
    
    function nextToken() {
        if (tokens.length)
            return tokens.pop();
            
        return lexr.nextToken();
    }
    
    function pushToken(token) {
        tokens.push(token);
    }
}

function isWord(token, name)
{
    return token && token.type === TokenType.Name && token.value === name;
}

function createParser(text) {
    return new Parser(text);
}

module.exports = {
    createParser: createParser
}

