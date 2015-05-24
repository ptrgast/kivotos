Man.prototype=new kivotos.Creature(0,0,"assets/man.png",100,5,4,450);
Man.prototype.constructor=Man;

function Man(h,v,level) {

	this._HOR=0;
	this._VER=1;

	this.h=h;
	this.v=v;
	this.level=level;
	this.name="man";
	this.maxEnergy=10;
	this.energy=this.maxEnergy;
	this.energyReduction=0.5;
	this.energyGauge=new kivotos.Sprite("assets/energy-bar.png",100,20,11,2);
	this.direction=this._VER;
	this.queue=[];
	thisobj=this;
	
	this.drawExtras=function(context) {
		this.energyGauge.setFrame(10-Math.round(this.energy),this.currentFrame);
		this.energyGauge.draw(context,this.x,this.y+this.size-this.energyGauge.height);
	}
	
	this.consumeEnergy=function(factor) {
		if(!factor) {factor=1;}
		//reduce creature energy
		this.energy-=this.energyReduction*factor;
		if(this.energy<0) {this.energy=0;}
	}
	
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
			if(creatures[creatureIndex].name=="bone") {
				this.level.removeCreature(creatureIndex);
			} else if(creatures[creatureIndex].name=="pumpkin") {
				this.energy+=creatures[creatureIndex].food;
				if(this.energy>this.maxEnergy) {this.energy=this.maxEnergy;}
				//delete the creature
				this.level.removeCreature(creatureIndex);
			} else if(creatures[creatureIndex].name=="bear") {
				this.energy=0;
			}
		}
		if(this.energy==0) {this.queue=[];}
		//set animation row
		var animationRow=3-((this.energy/this.maxEnergy)*3)|0;
		this.creatureView.setFrame(animationRow,null);
	}

	this.moveLeft=function() {
		if(this.steps>0||this.energy==0) {return;}
		var terrain=this.getTerrain(this.h-1,this.v);
		if(terrain!=null&&terrain.throughput!=0) {
			this.h--;
			this.steps++;
			this.direction=this._HOR;
			this.consumeEnergy();
		}
		this.afterMove();
	}

	this.moveRight=function() {
		if(this.steps>0||this.energy==0) {return;}
		var terrain=this.getTerrain(this.h+1,this.v);
		if(terrain!=null&&terrain.throughput!=0) {
			this.h++;
			this.steps++;
			this.direction=this._HOR;
			this.consumeEnergy();
		}
		this.afterMove();
	}

	this.moveUp=function() {
		if(this.steps>0||this.energy==0) {return;}
		var terrain=this.getTerrain(this.h,this.v-1);
		if(terrain!=null&&terrain.throughput!=0) {
			this.v--;
			this.steps++;
			this.direction=this._VER;
			this.consumeEnergy();
		}
		this.afterMove();
	}

	this.moveDown=function() {
		if(this.steps>0||this.energy==0) {return;}
		var terrain=this.getTerrain(this.h,this.v+1);
		if(terrain!=null&&terrain.throughput!=0) {
			this.v++;
			this.steps++;
			this.direction=this._VER;
			this.consumeEnergy();
		}
		this.afterMove();
	}
	
	this.wait=function() {
		this.consumeEnergy(0.5);
		this.afterMove();
	}
	
	this.checkArea=function() {
		var creatures=this.level.creatures;
		for(var i=0;i<creatures.length;i++) {
			if(creatures[i]!=this&&creatures[i].h==this.h&&creatures[i].v==this.v) {
				return i;
			}
		}
		return -1;
	}
		
}
