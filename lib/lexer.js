
var TokenType = { Indent: 1, Name: 2 };

function Lexer(text) {
    this.nextToken = function () {
    }
}

function createLexer(text) {
    return new Lexer(text);
}

module.exports = {
    createLexer: createLexer
};
