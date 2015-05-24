Bone.prototype=new kivotos.Creature(0,0,"assets/bone.png",100,1,1,1000);
Bone.prototype.constructor=Bone;

function Bone(h,v,level) {

	this.h=h;
	this.v=v;
	this.level=level;
	this.name="bone";
	this.maxFood=0;
	this.food=this.maxFood;
	this.foodProduction=0;
	this.energy=0;
	this.energyReduction=0;
	thisobj=this;
		
}
