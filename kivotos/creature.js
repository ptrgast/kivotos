//Everything should be under 'kivotos' to avoid conflicts.
//If 'kivotos' is not defined, define it.
if(typeof kivotos=="undefined") {window.kivotos={};}

kivotos.Creature=function(h,v,url,size,frames,rows,framePeriod,level) {
	this.x=0; //real position
	this.y=0; //real position
	this.h=h; //block coordinate
	this.v=v; //block coordinate
	this.steps=0; //steps since last execution
	this.size=size;
	this.currentFrame=0;
	this.framePeriod=framePeriod;
	this.lastFrameTime=0;
	this.level=level;
	this.init; //the initialization program
	this.loop; //the creature logic
	this.queue=[];
	this.name="creature";
	this.creatureView=new kivotos.Sprite(url,size,size,rows,frames);
		
	this.draw=function(context) {
		this.computePosition();
		this.creatureView.setFrame(null,this.currentFrame);
		this.creatureView.draw(context,this.x,this.y);
		if(this.drawExtras) {this.drawExtras(context);}
	}
		
	this.computePosition=function() {
		this.x=this.h*this.level.blockSize-this.level.halfBlock;
		this.y=this.v*this.level.blockSize-this.level.halfBlock;
	}

	this.enqueue=function(action) {		
		this.queue.push(action);
	}
	
}
