
var TokenType = { Indent: 1, Name: 2, Punctuation: 3 };

var punctuations = '()';

function Lexer(text) {
    var position = 0;
    var length = text.length;
    var lastwasindent = false;
    
    this.nextToken = function () {
        if (position >= length)
            return null;
            
        if (position == 0 && !lastwasindent)
            return nextIndent();
            
        var ch = text[position++];
        
        if (punctuations.indexOf(ch) >= 0)
            return { value: ch, type: TokenType.Punctuation };
        
        return nextName(ch);
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

function createLexer(text) {
    return new Lexer(text);
}

module.exports = {
    createLexer: createLexer,
    TokenType: TokenType
};
