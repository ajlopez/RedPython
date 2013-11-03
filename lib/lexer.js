
var TokenType = { Indent: 1, Integer: 2, String: 3, Name: 4, Operator: 5, Punctuation: 6 };

var punctuations = '():,';
var operators = '=+-*/';

function Lexer(text) {
    var position = 0;
    var length = text.length;
    var lastwasindent = false;
    
    this.nextToken = function () {
        if (position >= length)
            return null;
            
        if (position == 0 && !lastwasindent)
            return nextIndent();
            
        while (position < length && isWhiteSpace(text[position]))
            position++;
            
        var ch = text[position++];
        
        if (ch === '\n')
            return nextIndent();
            
        if (ch === '"')
            return nextString();
        
        if (isDigit(ch))
            return nextInteger(ch);
        
        if (punctuations.indexOf(ch) >= 0)
            return { value: ch, type: TokenType.Punctuation };
            
        if (operators.indexOf(ch) >= 0)
            return { value: ch, type: TokenType.Operator };
        
        return nextName(ch);
    }
    
    function nextString() {
        var string = '';
        
        while (position < length && text[position] !== '"')
            string += text[position++];
        
        if (text[position] === '"')
            position++;
            
        return { value: string, type: TokenType.String };
    }
    
    function nextInteger(ch) {
        var integer = ch;
        
        while (position < length && isDigit(text[position]))
            integer += text[position++];
            
        return { value: integer, type: TokenType.Integer };
    }
    
    function nextName(ch) {
        var name = ch;
        
        while (position < length && isLetter(text[position]))
            name += text[position++];
            
        return { value: name, type: TokenType.Name };
    }
    
    function nextIndent() {
        var value = 0;
        
        while (position < length && (text[position] === ' ' || text[position] === '\r' || text[position] === '\n')) {
            if (text[position] === '\n')
                value = 0;
            else
                value++;
                
            position++;
        }
        
        if (position >= length)
            return null;
        
        lastwasindent = true;
        
        return { value: value, type: TokenType.Indent };
    }
}

function isLetter(ch) {
    return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z';
}

function isDigit(ch) {
    return ch >= '0' && ch <= '9';
}

function isWhiteSpace(ch) {
    return ch <= ' ' && ch !== '\n';
}

function createLexer(text) {
    return new Lexer(text);
}

module.exports = {
    createLexer: createLexer,
    TokenType: TokenType
};

