var p1 = new Promise((resolve,reject) => {
  console.log("start p1")
  resolve("p1")	
})
var p2 = new Promise((resolve,reject) => {
  console.log("start p1")
  setTimeout(()=>{
  	console.log("p2 done")
  	resolve(["p2"])
  },5000)
})

function run () {
	return Promise.all([p1,p2])
}

run().then(all => {return all[1].concat(all[0])}).then(console.log)