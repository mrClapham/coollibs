function TestClass1(targ, msg){
    this.targ = document.getElementById(targ)
    this.msg = msg
    console.log(arguments)
    this.init()
}

TestClass1.prototype.init = function(){
    console.log(this.targ)
    this.targ.innerHTML = "<h1>"+this.msg+"</h1>"
}




TestClass1.staticMethod = function(){
   alert("static")
}


