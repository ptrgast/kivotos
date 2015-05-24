Level6.prototype=new kivotos.Level();
Level6.prototype.constructor=Level6;

function Level6() {

	this.name="(VI) Food For Thought";
	this.description="<h1>Functions</h1><p>Very often you will find yourself writing again and again similar or even worse the same code. In such occasions you can declare your code as a <em>function</em> and then execute it on demand. The syntax of a function is the following:</p>";
	this.description+="<p><em>function functionName(arguments) {/*function's code*/}</em></p>";
	this.description+="<p>The arguments let you pass values to the function's code every time it is called.</p>";
	this.description+="<h2>Example</h2><p><em>function upAndDown(who) {<br/>&nbsp;&nbsp;&nbsp;&nbsp;who.moveUp();<br/>&nbsp;&nbsp;&nbsp;&nbsp;who.moveDown();<br/>}</em></p>";
	this.description+="<p>Then you could move your character up and down by writing <em>upAndDown(this);</em></p>";
	this.defaultCode="//Here is a small function that will help you eat the pumpkins\n\nfunction goEat(who) {\n\twho.moveUp();\n\twho.moveUp();\n\twho.moveRight();\n\twho.moveLeft();\n\twho.moveDown();\n\twho.moveDown();\n}\n\nfor(var i=0;i<10;i++) {\n\tif(i==6) {goEat(this);}\n\tthis.moveRight();\n}\n";
	this.player=new Man(0,0,this);
	this.terrainBlocks=[
			new TerrainBlock("assets/grass.png",125,1),
			new TerrainBlock("assets/grass-rock.png",125,0),
			new TerrainBlock("assets/ground.png",100,1),
			new TerrainBlock("assets/ground-rock.png",100,0),
			new TerrainBlock("assets/shallow.png",100,0),
			new TerrainBlock("assets/water.png",100,0),
		];
	this.terrain=[
			[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
			[6,6,6,6,6,6,6,1,1,1,1,6,6,6,6,6,6,6,6,6],
			[6,6,6,6,6,6,1,1,3,3,1,1,6,6,6,6,6,6,6,6],
			[6,1,1,1,1,1,1,2,3,2,1,1,1,1,6,6,6,6,6,6],
			[6,1,3,3,3,3,3,3,3,3,3,3,3,1,1,6,6,6,6,6],
			[6,1,1,1,1,1,1,5,5,1,1,1,3,1,1,6,1,1,6,6],
			[6,6,1,1,2,2,5,5,5,2,2,1,3,1,1,6,1,1,1,6],
			[6,6,6,6,1,1,5,5,4,3,3,2,3,1,6,6,1,1,1,6],
			[6,6,6,6,6,1,1,1,1,3,2,1,3,1,6,6,1,1,6,6],
			[6,6,6,6,6,1,3,3,3,3,3,3,3,1,6,6,1,1,1,6],
			[6,6,6,6,6,1,3,1,1,1,1,2,1,1,6,6,6,1,1,6],
			[6,6,6,6,1,1,3,1,5,5,5,1,2,2,1,6,6,6,6,6],
			[6,6,6,1,1,1,3,1,5,5,5,5,3,3,2,1,1,6,6,6],
			[6,6,6,1,1,1,3,2,1,1,1,1,3,2,1,1,1,1,1,6],
			[6,6,6,6,1,1,3,3,3,3,3,3,3,3,3,3,3,1,1,6],
			[6,6,6,6,6,1,1,1,1,1,1,1,1,1,1,1,1,1,6,6],
			[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
		];

	this.init=function() {
		this.player.h=2;
		this.player.v=4;
		this.player.energy=10;
		this.player.creatureView.setFrame(0,0);
		this.creatures=[
			new Tree(13,5,this),
			new Tree(8,8,this),
			new Tree(5,12,this),
			new Tree(15,13,this),
			new Bone(5,4,this),
			new Bone(6,12,this),
			new Bone(16,14,this),
			new Pumpkin(9,2,this),
			new Pumpkin(10,7,this),
			new Pumpkin(13,12,this),
			this.player,
		];
	}
	
	var thisobj=this;
	
	this.context.moveLeft=function() {thisobj.player.enqueue(function() {thisobj.player.moveLeft();});}
	this.context.moveRight=function() {thisobj.player.enqueue(function() {thisobj.player.moveRight();});}
	this.context.moveUp=function() {thisobj.player.enqueue(function(){thisobj.player.moveUp();});}
	this.context.moveDown=function() {thisobj.player.enqueue(function(){thisobj.player.moveDown();});}
	this.context.wait=function() {thisobj.player.enqueue(function(){thisobj.player.wait();});}

	//level goals
	var goal1=new kivotos.Goal(this);
	goal1.description="Pick up the first bone.";
	goal1.check=function() {if(this.level.player.h==5&&this.level.player.v==4) {this.isAchieved=true;this.score=50;}}
	var goal2=new kivotos.Goal(this);
	goal2.description="Pick up the second bone.";
	goal2.check=function() {if(this.level.player.h==6&&this.level.player.v==12) {this.isAchieved=true;this.score=100;}}
	var goal3=new kivotos.Goal(this);
	goal3.description="Pick up the third bone.";
	goal3.check=function() {if(this.level.player.h==16&&this.level.player.v==14) {this.isAchieved=true;this.score=150;}}
	this.goals.push(goal1);	
	this.goals.push(goal2);
	this.goals.push(goal3);
	
}
