//Everything should be under 'kivotos' to avoid conflicts.
//If 'kivotos' is not defined, define it.
if(typeof kivotos=="undefined") {window.kivotos={};}

kivotos.Level=function() {
	this.name="Default Level";
	this.description="Hi, this is the default level.";
	this.blockSize=100;
	this.terrainBlocks=[];
	this.terrain=[];
	this.player;
	this.creatures=[];
	this.init=function() {}
	this.defaultCode="";
	this.context={};
	this.context.run=function(code) {try{eval(code);return true;}catch(e){return false;}}
	this.goals=[];
	this.evaluate=function() {
		var levelCompleted=0;
		for(var i=0;i<this.goals.length;i++) {
			this.goals[i].check();
			if(this.goals[i].isAchieved) {levelCompleted++;}
		}
		if(levelCompleted==this.goals.length) {return true;}
		else {return false;}
	}
	this.afterEvaluation=function() {}
	
	this.removeCreature=function(index) {
		var before=this.creatures.slice(0,index);
		var after=this.creatures.slice(index+1);
		this.creatures=before.concat(after);
	}
	
}

kivotos.Goal=function(level) {
	this.level=level;
	this.description="n/a";
	this.isAchieved=false;
	this.check=function() {}
}