Bear.prototype=new kivotos.Creature(0,0,"assets/bear.png",100,6,1,400);
Bear.prototype.constructor=Bear;

function Bear(h,v,level) {

	this.h=h;
	this.v=v;
	this.level=level;
	this.name="bear";
	this.food=20;
	this.energy=10;
	this.energyReduction=0.02;
	this.direction=0;
	thisobj=this;

	this.getTerrain=function(x,y) {			
		if(x<0||y<0||x>=this.level.terrain[0].length||y>=this.level.terrain.length) {return null;}
		var terrainIndex=this.level.terrain[y][x]-1;
		if(terrainIndex>=0) {
			return this.level.terrainBlocks[terrainIndex];
		} else {
			return null;
		}
	}
	
	//common actions after the man moves
	this.afterMove=function() {
		var creatureIndex=this.checkArea();
		if(this.checkArea()>=0) {
			var creatures=this.level.creatures;
			if(creatures[creatureIndex].name=="man") {
				var man=creatures[creatureIndex];
				man.energy=0;
				man.queue=[];
				//set animation row
				man.creatureView.setFrame(3,null);	
			}		
		}
	}

	this.moveLeft=function() {
		if(this.steps>0) {return;}
		var terrain=this.getTerrain(this.h-1,this.v);
		if(terrain!=null&&terrain.throughput!=0) {
			this.h--;
			this.steps++;
		}
	}

	this.moveRight=function() {
		if(this.steps>0) {return;}
		var terrain=this.getTerrain(this.h+1,this.v);
		if(terrain!=null&&terrain.throughput!=0) {
			this.h++;
			this.steps++;
		}
	}

	this.moveUp=function() {
		if(this.steps>0) {return;}
		var terrain=this.getTerrain(this.h,this.v-1);
		if(terrain!=null&&terrain.throughput!=0) {
			this.v--;
			this.steps++;
		}
	}

	this.moveDown=function() {
		if(this.steps>0) {return;}
		var terrain=this.getTerrain(this.h,this.v+1);
		if(terrain!=null&&terrain.throughput!=0) {
			this.v++;
			this.steps++;
		}
	}
	
	this.wait=function() {
		//do nothing... just consume a time step
	}

	this.checkArea=function() {
		var creatures=this.level.creatures;
		for(var i=0;i<creatures.length;i++) {
			if(creatures[i]!=this&&creatures[i].h==this.h&&creatures[i].v==this.v) {
				return creatures[i].name;
			}
		}
		return "nothing";
	}
	
	this.eat=function() {
		if(this.steps>0) {return;}
		var creatures=this.level.creatures;
		var currentCreature=null;
		for(var i=0;i<creatures.length;i++) {
			if(creatures[i]!=this&&creatures[i].h==this.h&&creatures[i].v==this.v) {
				currentCreature=creatures[i];
				break;
			}
		}
		if(currentCreature!=null) {	//eat
			if(currentCreature.food>0) {
				currentCreature.food--;
				this.energy++;
				this.steps++;
			} else {
				console.log("Nothing to eat");
			}
		}
	}
	
	this.computePosition=function() {
		this.x=this.h*this.level.blockSize-this.level.halfBlock;
		this.y=this.v*this.level.blockSize-this.level.halfBlock;
	}
	
}
