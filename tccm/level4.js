Level4.prototype=new kivotos.Level();
Level4.prototype.constructor=Level4;

function Level4() {

	this.name="(IV) Nature Is Complex";
	this.description="<h1>Nested Loops</h1><p>As you should know already, the loop structures allow you to repeat a block of code. The not so obvious here is that this block of code can contain other loop structures. The loops within other loops are called <em>nested loops</em>.</p>";
	this.description+="<p>In the following example your character will move 5 steps right, 1 step up and then again 5 steps right and 1 step up.</p>";
	this.description+="<p><em>for(var a=0; a<2; a++) {<br/>&nbsp;&nbsp;&nbsp;&nbsp;for(b=0; b<5; b++) {<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.moveRight();<br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;&nbsp;&nbsp;this.moveUp();<br/>}</em></p>";
	this.defaultCode="//If you observe the path you will see that it can break down in two patterns which are then repeated twice.\nfor(var r=0;r<2;r++) {\n\n\t//First pattern\n\n\t//Second pattern\n\n}";
	this.player=new Man(0,0,this);
	this.terrainBlocks=[
			new TerrainBlock("assets/grass.png",125,1),
			new TerrainBlock("assets/ground.png",100,1),
			new TerrainBlock("assets/water.png",100,0),
			new TerrainBlock("assets/grass-rock.png",125,0),
			new TerrainBlock("assets/ground-rock.png",100,0),
		];
	this.terrain=[
			[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
			[3,3,3,3,3,3,3,1,1,1,1,3,3,3,3,3,3],
			[3,3,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3],
			[3,3,1,1,2,2,2,1,1,4,2,2,2,1,1,3,3],
			[3,1,1,2,2,4,2,2,4,2,2,4,2,2,1,1,3],
			[3,1,2,2,1,1,4,2,2,2,4,1,1,2,2,1,3],
			[3,1,2,1,1,1,1,4,2,1,1,3,4,1,2,1,3],
			[3,1,1,1,4,1,1,1,1,1,3,3,3,1,1,1,3],
			[3,3,3,1,1,1,1,3,3,3,3,3,3,3,3,3,3],
			[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
		];

	this.init=function() {
		this.player.h=2;
		this.player.v=6;
		this.player.energy=10;
		this.player.creatureView.setFrame(0,0);
		this.creatures=[
			new Tree(4,5,this),
			new Tree(9,2,this),
			new Pumpkin(4,3,this),
			new Pumpkin(7,5,this),
			new Pumpkin(9,4,this),
			new Pumpkin(14,6,this),
			this.player,
		];
	}
	
	var thisobj=this;
	
	this.context.moveLeft=function() {thisobj.player.enqueue(function() {thisobj.player.moveLeft();});}
	this.context.moveRight=function() {thisobj.player.enqueue(function() {thisobj.player.moveRight();});}
	this.context.moveUp=function() {thisobj.player.enqueue(function(){thisobj.player.moveUp();});}
	this.context.moveDown=function() {thisobj.player.enqueue(function(){thisobj.player.moveDown();});}
		
	//level goals
	var goal1=new kivotos.Goal(this);
	goal1.description="Eat the first pumpkin.";
	goal1.check=function() {
		if(this.level.player.h==4&&this.level.player.v==3) {this.isAchieved=true;this.score=100;}
	}
	var goal2=new kivotos.Goal(this);
	goal2.description="Eat the second pumpkin.";
	goal2.check=function() {
		if(this.level.player.h==7&&this.level.player.v==5) {this.isAchieved=true;this.score=100;}
	}
	var goal3=new kivotos.Goal(this);
	goal3.description="Eat the third pumpkin.";
	goal3.check=function() {
		if(this.level.player.h==9&&this.level.player.v==4) {this.isAchieved=true;this.score=100;}
	}
	var goal4=new kivotos.Goal(this);
	goal4.description="Eat the forth pumpkin.";
	goal4.check=function() {
		if(this.level.player.h==14&&this.level.player.v==6) {this.isAchieved=true;this.score=100;}
	}
	this.goals.push(goal1);	
	this.goals.push(goal2);
	this.goals.push(goal3);
	this.goals.push(goal4);
	
}
