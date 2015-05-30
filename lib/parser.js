
var lexer = require('./lexer');
var TokenType = lexer.TokenType;

function doVisit(node, name, visitor) {
    var fnname = 'visit' + name;
    
    if (visitor[fnname])
        visitor[fnname](node);
    else
        visitor.visitGeneric(node);
}

function ConstantExpression(value) {
    this.compile = function () {
        return value;
    };
    
    this.getValue = function () { return value; };
    
    this.visit = function (visitor) {
        doVisit(this, 'ConstantExpression', visitor);
    };
    
    this.getType = function () {
        if (typeof value === 'number')
            return 'int';
    }
}

function StringExpression(value) {
    this.compile = function () {
        return '"' + value + '"';
    };
    
    this.getValue = function () { return value; };
    
    this.visit = function (visitor) {
        doVisit(this, 'StringExpression', visitor);
    };
}

function NameExpression(name) {
    this.compile = function () {
        return name;
    };
    
    this.getName = function () { return name; };
    
    this.visit = function (visitor) {
        doVisit(this, 'NameExpression', visitor);
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
    
    this.getLeftExpression = function () { return leftexpr; };
    this.getRightExpression = function () { return rightexpr; };
    this.getOperator = function () { return operator; };
    
    this.visit = function (visitor) {
        return doVisit(this, 'BinaryExpression', visitor);
    }
}

function CompositeCommand(commands) {
    this.compile = function () {
        var cmds = [];
        
        if (this.variables)
            this.variables.forEach(function (variable) {
                cmds.push(variable.type + ' ' + variable.name + ';');
            });
        
        commands.forEach(function (command) {
            cmds.push(command.compile());
        });
        
        return cmds;
    };
    
    this.getCommands = function () { return commands; };
    
    this.visit = function (node) {
        doVisit(this, 'CompositeCommand', node);
    };
}

function ReturnCommand(expr) {
    this.compile = function () {
        return 'return ' + expr.compile() + ';';
    };
}

function BreakCommand(expr) {
    this.compile = function () {
        return 'break;';
    };
}

function ContinueCommand(expr) {
    this.compile = function () {
        return 'continue;';
    };
}

function IfCommand(expr, command) {
    this.compile = function () {
        var result = ['if (' + expr.compile() + ')'];
        var cmd = command.compile();
        
        if (Array.isArray(cmd))
            result[1] = cmd;
        else
            result[1] = [cmd];
        
        return result;
    };
    
    this.getExpression = function () { return expr; };
    this.getCommand = function () { return command; };
    
    this.visit = function (visitor) {
        doVisit(this, 'IfCommand', visitor);
    };
}

function WhileCommand(expr, command) {
    this.compile = function () {
        var result = ['while (' + expr.compile() + ')'];
        var cmd = command.compile();
        
        if (Array.isArray(cmd))
            result[1] = cmd;
        else
            result[1] = [cmd];
        
        return result;
    };
    
    this.getExpression = function () { return expr; };
    this.getCommand = function () { return command; };
    
    this.visit = function (visitor) {
        doVisit(this, 'WhileCommand', visitor);
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
    
    this.visit = function (visitor) {
        doVisit(this, 'AssignmentCommand', visitor);
    };
    
    this.getLeftValueExpression = function () { return expr; };
    
    this.getRightExpression = function () { return expr2; };
}

function DefCommand(name, args, command) {
    this.compile = function () {
        var code = 'int ' + name + '(';
        
        for (var k = 0; k < args.length; k++) {
            if (k)
                code += '. ';
            code += 'int ' + args[k];
        }
        
        code += ')';
            
        var result = [code];
        var cmd = command.compile();
        
        if (Array.isArray(cmd))
            result[1] = cmd;
        else
            result[1] = [cmd];
            
        var vars = [];
        
        if (this.variables)
            this.variables.forEach(function (variable) {
                vars.push(variable.type + ' ' + variable.name + ';');
            });
        
        result[1] = vars.concat(result[1]);
        
        if (result[1].length == 1)
            result[1].push(null);
        
        return result;
    };

    this.getCommand = function () { return command; };
    
    this.visit = function (visitor) {
        doVisit(this, 'DefCommand', visitor);
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
        
        if (isWord(token, 'break'))
            return new BreakCommand();
        
        if (isWord(token, 'continue'))
            return new ContinueCommand();
            
        if (isWord(token, 'if')) {
            var expr = this.parseExpression();
            parseToken(':', TokenType.Punctuation);
            var commands = parseSuite(indent);
            return new IfCommand(expr, commands);
        }
            
        if (isWord(token, 'while')) {
            var expr = this.parseExpression();
            parseToken(':', TokenType.Punctuation);
            var commands = parseSuite(indent);
            return new WhileCommand(expr, commands);
        }
        
        if (isWord(token, 'def')) {
            var name = parseName();
            var args = [];
            
            parseToken('(', TokenType.Punctuation);
            
            var token = nextToken();
            
            if (token && token.type == TokenType.Name) {
                args.push(token.value);
            }
            else
                pushToken(token);
            
            parseToken(')', TokenType.Punctuation);
            parseToken(':', TokenType.Punctuation);
            var commands = parseSuite(indent);
            return new DefCommand(name, args, commands);
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
    
    this.parseCommands = function () {
        var commands = [];
        
        for (var command = this.parseCommand(); command; command = this.parseCommand())
            commands.push(command);
            
        return new CompositeCommand(commands);
    };
    
    function parseSuite(indent) {
        var commands = [];
        
        for (var ind = self.parseIndent(); ind && ind > indent; ind = self.parseIndent()) {
            pushToken({ value: ind, type: TokenType.Indent });
            commands.push(self.parseCommand());
        }
        
        if (ind !== null)
            pushToken({ value: ind, type: TokenType.Indent });
        
        return new CompositeCommand(commands);
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
        
        if (token.type === TokenType.Integer)
            return new ConstantExpression(parseInt(token.value));

        if (token.type === TokenType.Real)
            return new ConstantExpression(parseFloat(token.value));
            
        if (token.type === TokenType.Indent)
            throw "Unexpected indent";
            
        throw "Unexpected '" + token.value + "'";
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

var binaryoperators = ['+', '-', '*', '/', '%', '<', '>', '==', '!=', '<=', '>='];

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

