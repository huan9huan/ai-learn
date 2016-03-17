var readline = require('readline')

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
rl.setPrompt('Answer> ');

function run () {
	console.log("input 1")
	rl.on('line', function(line){
	    var choose = line.trim()
	    if(choose == "1") {
	    	console.log("good")
	    }else{
	    	console.log("bad")
	    }
	    console.log("input 2")
	})
	rl.prompt();
	process.stdout.pause();

}

run()