var redpython = require('../..'),
    fs = require('fs');
    
function compileFile(filename) {
    var text = fs.readFileSync(filename).toString();
	var code = redpython.compile(text);
    console.log(code);
};

process.argv.forEach(function(val) {
    if (val.slice(-3) == ".py")
        compileFile(val);
});

