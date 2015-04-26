//Everything should be under 'kivotos' to avoid conflicts.
//If 'kivotos' is not defined, define it.
if(typeof kivotos=="undefined") {window.kivotos={};}

kivotos.Creature=function(h,v,url,size,frames,framePeriod,level) {
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
	this.creatureView=new kivotos.Sprite(url,size,size,1,frames);
		
	this.draw=function(context) {
		this.computePosition();
		this.creatureView.setFrame(0,this.currentFrame);
		this.creatureView.draw(context,this.x,this.y);
		if(this.drawExtras) {this.drawExtras(context);}
	}
	
/*
	this.run=function() {
		try{
			//reset steps
			this.steps=0;
			//run the user code
			if(this.queue.length>0) {
				var action=this.queue.shift();
				action();
			}
			return true;
		}catch(e) {
			return false;
		}
	}
*/
	
	this.computePosition=function() {
		this.x=this.h*this.level.blockSize-this.level.halfBlock;
		this.y=this.v*this.level.blockSize-this.level.halfBlock;
	}

	this.enqueue=function(action) {
		console.log("Enqueued action");
		this.queue.push(action);
	}
	
}
