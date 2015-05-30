
var redpython = require('..');

exports['compile integer assignment to text'] = function (test) {
    var text = redpython.compile('a = 1');
    
    test.ok(text);
    test.equal(text, "int a;\r\na = 1;\r\n");
};

exports['compile real assignment to text'] = function (test) {
    var text = redpython.compile('a = 3.14');
    
    test.ok(text);
    test.equal(text, "double a;\r\na = 3.14;\r\n");
};

exports['compile simple if to text'] = function (test) {
    var text = redpython.compile('if b:\n  a = 1');
    
    test.ok(text);
    test.equal(text, "int a;\r\n\r\nif (b)\r\n    a = 1;\r\n");
};

exports['compile if to text'] = function (test) {
    var text = redpython.compile('if b:\n  a = 1\n  c = 2');
    
    test.ok(text);
    test.equal(text, "int a;\r\nint c;\r\n\r\nif (b)\r\n{\r\n    a = 1;\r\n    c = 2;\r\n}\r\n");
};

exports['compile simple while to text'] = function (test) {
    var text = redpython.compile('while b:\n  a = 1');
    
    test.ok(text);
    test.equal(text, "int a;\r\n\r\nwhile (b)\r\n    a = 1;\r\n");
};

exports['compile while to text'] = function (test) {
    var text = redpython.compile('while b:\n  a = 1\n  c = 2');
    
    test.ok(text);
    test.equal(text, "int a;\r\nint c;\r\n\r\nwhile (b)\r\n{\r\n    a = 1;\r\n    c = 2;\r\n}\r\n");
};

exports['compile simple def'] = function (test) {
    var text = redpython.compile('def one():\n  return 1');
    
    test.ok(text);
    test.equal(text, "\r\nint one()\r\n{\r\n    return 1;\r\n}\r\n");
};

exports['compile main with call'] = function (test) {
    var text = redpython.compile('\r\ndef main():\r\n  puts("Hello, world")\r\n\r\n');
    
    test.ok(text);
    test.equal(text, '\r\nint main()\r\n{\r\n    puts("Hello, world");\r\n}\r\n');
};

exports['compile function with local variable'] = function (test) {
    var text = redpython.compile('\r\ndef one():\r\n  a = 1\r\n  return a\n');
    
    test.ok(text);
    test.equal(text, '\r\nint one()\r\n{\r\n    int a;\r\n    a = 1;\r\n    return a;\r\n}\r\n');
};

exports['compile function with argument'] = function (test) {
    var text = redpython.compile('\r\ndef incr(a):\r\n  return a + 1\r\n');
    
    test.ok(text);
    test.equal(text, '\r\nint incr(int a)\r\n{\r\n    return a + 1;\r\n}\r\n');
};

exports['compile break'] = function (test) {
    var text = redpython.compile('break');
    
    test.ok(text);
    test.equal(text, 'break;\r\n');
};

exports['compile continue'] = function (test) {
    var text = redpython.compile('continue');
    
    test.ok(text);
    test.equal(text, 'continue;\r\n');
};
