Tree.prototype=new kivotos.Creature(0,0,"assets/tree.png",100,3,1,400);
Tree.prototype.constructor=Tree;

function Tree(h,v,level) {

	this.h=h;
	this.v=v;
	this.level=level;
	this.name="tree";
	this.maxFood=20;
	this.food=this.maxFood;
	this.foodProduction=0.1;
	this.energy=0;
	this.energyReduction=0;
	thisobj=this;
		
}
