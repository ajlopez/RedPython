
var parser = require('./parser');

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
            if (!lastempty) {;;
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
    var program = parsr.parseProgram();
    var code = toCode(program, 0);
    
    return code;
}

module.exports = {
    compile: compile
};