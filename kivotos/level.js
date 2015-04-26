//Everything should be under 'kivotos' to avoid conflicts.
//If 'kivotos' is not defined, define it.
if(typeof kivotos=="undefined") {window.kivotos={};}

kivotos.Level=function() {
	var thisobj=this;
	this.name="Default Level";
	this.description="Hi, this is the default level.";
	this.blockSize=100;
	this.terrainBlocks=[];
	this.terrain=[];
	this.player=new Man(0,0,this);
	this.creatures=[];
	this.init=function() {}
	this.context={};
	this.context.run=function(code) {try{eval(code);return true;}catch(e){return false;}}
	this.evaluate=function() {return false;}
}