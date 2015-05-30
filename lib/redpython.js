
var parser = require('./parser');

function VariableVisitor() {
    this.variables = [];
}

VariableVisitor.prototype.visitGeneric = function (node) {
    var self = this;
    
    if (node.getCommand)
        node.getCommand().visit(this);
    else if (node.getCommands)
        node.getCommands().forEach(function (command) {
            if (command.visit)
                command.visit(self);
        });
}

VariableVisitor.prototype.visitDefCommand = function (node) {
    var cmd = node.getCommand();
    var visitor = new VariableVisitor();
    cmd.visit(visitor);
    
    node.variables = visitor.variables;
}

VariableVisitor.prototype.visitAssignmentCommand = function (node) {
    var expr = node.getLeftValueExpression();
    
    if (expr.getName) {
        var name = expr.getName();
        var valueexpr = node.getRightExpression();
        var type = 'int';
        
        if (valueexpr.getType) {
            var gtype = valueexpr.getType();
            
            if (gtype == 'real')
                type = 'double';
            else if (gtype == 'string')
                type = 'char *';
        }
        
        if (this.variables.indexOf(name) < 0)
            this.variables.push({ name: name, type: type });
    }
}

function toCodeLine(text, indent) {
    var code = '';
    
    for (var k = 0; k < indent; k++)
        code += '    ';
        
    code += text;
    code += '\r\n';
    
    return code;
}

function toCode(lines, indent) {
    var code = '';
    var lastempty = false;
    var lastblock = false;
    
    lines.forEach(function (line) {
        if (line === null)
            return;
            
        if (Array.isArray(line)) {
            if (!lastempty) {
                lastempty = true;
                code += '\r\n';
            }
            
            line.forEach(function (subline) {
                if (Array.isArray(subline)) {
                    if (subline.length > 1)
                        code += toCodeLine('{', indent);

                    code += toCode(subline, indent + 1);
                    
                    if (subline.length > 1)
                        code += toCodeLine('}', indent);
                }
                else
                    code += toCodeLine(subline, indent);
            });
            
            lastblock = true;
            lastempty = false;
            
            return;
        }
        
        if (lastblock)
            code += '\r\n';
        
        code += toCodeLine(line, indent);
        lastblock = false;
        lastempty = false;
    });
    
    return code;
}

function compile(text) {
    var parsr = parser.createParser(text);
    var commands = parsr.parseCommands();
    var visitor = new VariableVisitor();
    commands.visit(visitor);
    commands.variables = visitor.variables;
    var program = commands.compile();
    var code = toCode(program, 0);
    
    return code;
}

module.exports = {
    compile: compile
};