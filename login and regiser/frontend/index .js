function person (name){
    this.name = name ;
    this.greeting = function(){
        console.log(this.name)
    }
}

let person = new person("raja"); 
person.greeting()