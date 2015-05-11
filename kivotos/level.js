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
	this._init=function() {		
		this.init();
		//reset goals
		for(var i=0;i<this.goals.length;i++) {this.goals[i].reset();}
	}
	this.init=function() {}
	this.defaultCode="";
	this.currentCode="";
	this.context={};
	this.context.run=function(code) {try{eval(code);return true;}catch(e){return false;}}
	this.goals=[];
	this.score=0;
	this.evaluate=function() {
		this.score=0;
		var levelCompleted=0;
		for(var i=0;i<this.goals.length;i++) {
			this.goals[i].check();
			if(this.goals[i].isAchieved) {levelCompleted++;}
			this.score+=this.goals[i].score;
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
	this.score=0;
	this.check=function() {}
	this.reset=function() {
		this.score=0;
		this.isAchieved=false;
	}
}