
var lexer = require('./lexer');
var TokenType = lexer.TokenType;

function ConstantExpression(value) {
    this.compile = function () {
        return value;
    };
}

function StringExpression(name) {
    this.compile = function () {
        return '"' + name + '"';
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

function CallExpression(expr, args) {
    this.compile = function () {
        var code = expr.compile() + "(";
        
        for (var k = 0; k < args.length; k++) {
            if (k)
                code += ", ";
            code += args[k].compile();
        }
        
        code += ')';
        
        return code;
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

function IfCommand(expr, commands) {
    this.compile = function () {
        var result = ['if (' + expr.compile() + ')', []];
        
        commands.forEach(function (command) {
            result[1].push(command.compile());
        });
        
        return result;
    };
    
    this.collectVariables = function (names) {
        commands.forEach(function (command) {
            if (command.collectVariables)
                command.collectVariables(names);
        });
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
    
    this.collectVariables = function (names) {
        if (expr && expr.getName) {
            var name = expr.getName();
            if (names.indexOf(name) < 0)
                names.push(name);
        }
    };
}

function DefCommand(name, commands) {
    this.compile = function () {
        var result = ['int ' + name + '()', []];
        var names = [];
        
        commands.forEach(function (command) {
            if (command.collectVariables)
                command.collectVariables(names);
            result[1].push(command.compile());
        });
        
        var vars = [];
        
        names.forEach(function (name) {
            vars.push('int ' + name + ';');
        });
        
        result[1] = vars.concat(result[1]);
        
        if (result[1].length == 1)
            result[1].push(null);
        
        return result;
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
        var indent = this.parseIndent();
        
        if (indent === null)
            return null;
            
        var token = nextToken();
        
        if (isWord(token, 'return'))
            return new ReturnCommand(this.parseExpression());
            
        if (isWord(token, 'if')) {
            var expr = this.parseExpression();
            parseToken(':', TokenType.Punctuation);
            var commands = parseSuite(indent);
            return new IfCommand(expr, commands);
        }
        
        if (isWord(token, 'def')) {
            var name = parseName();
            parseToken('(', TokenType.Punctuation);
            parseToken(')', TokenType.Punctuation);
            parseToken(':', TokenType.Punctuation);
            var commands = parseSuite(indent);
            return new DefCommand(name, commands);
        }
            
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
            if (command.collectVariables)
                command.collectVariables(names);
                
            commands.push(command.compile());
        }
        
        var vars = [];
        
        names.forEach(function (name) {
            vars.push('int ' + name + ';');
        });
        
        return vars.concat(commands);
    };
    
    function parseSuite(indent) {
        var commands = [];
        
        for (var ind = self.parseIndent(); ind && ind > indent; ind = self.parseIndent()) {
            pushToken({ value: ind, type: TokenType.Indent });
            commands.push(self.parseCommand());
        }
        
        if (ind !== null)
            pushToken({ value: ind, type: TokenType.Indent });
        
        return commands;
    }
    
    function parseTerm() {
        var expr = parseSimpleTerm();
        
        if (expr === null)
            return null;
            
        var token = nextToken();
        
        if (isPunctuation(token, '(')) {
            var args = parseArguments();
            expr = new CallExpression(expr, args);
        }
        else
            pushToken(token);
            
        return expr;
    }

    function parseSimpleTerm() {
        var token = nextToken();
        
        if (token === null)
            return null;
            
        if (token.type === TokenType.Name)
            return new NameExpression(token.value);
            
        if (token.type === TokenType.String)
            return new StringExpression(token.value);
            
        if (token.type === TokenType.Punctuation && token.value === '(') {
            var expr = self.parseExpression();
            parseToken(')', TokenType.Punctuation);
            
            return new ParensExpression(expr);
        }
        
        return new ConstantExpression(token.value);
    }
    
    function parseArguments() {
        var args = [];
        var token = nextToken();
        
        if (!isPunctuation(token, ')')) {
            pushToken(token);
            
            while (true) {
                args.push(self.parseExpression());
                token = nextToken();
                if (!isPunctuation(token, ','))
                    break;
            }
        }
        
        if (!isPunctuation(token, ')'))
            throw "Expected ')'";
            
        return args;
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
    
    function parseName() {
        var token = nextToken();
        
        if (!token || token.type !== TokenType.Name)
            throw "Name expected";
            
        return token.value;
    }
}

function isWord(token, name)
{
    return token && token.type === TokenType.Name && token.value === name;
}

function isPunctuation(token, value)
{
    return token && token.type === TokenType.Punctuation && token.value === value;
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

