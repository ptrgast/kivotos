Pumpkin.prototype=new kivotos.Creature(0,0,"assets/pumpkin.png",100,4,1,600);
Pumpkin.prototype.constructor=Pumpkin;

function Pumpkin(h,v,level) {

	this.h=h;
	this.v=v;
	this.level=level;
	this.name="pumpkin";
	this.maxFood=10;
	this.food=this.maxFood;
	this.foodProduction=0;
	this.energy=0;
	this.energyReduction=0;
	thisobj=this;
		
}
