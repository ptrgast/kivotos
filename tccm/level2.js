Level2.prototype=new kivotos.Level();
Level2.prototype.constructor=Level2;

function Level2() {

	this.name="(II) Traveling Far";
	this.description="<h1>The Loop Structures</h1><p>In the previous level you learned how to move around. Practically, you can't go far by typing every single step. In order to travel longer distances you will need to use some kind of repetition in your code. This can be achieved with the loop structures.</p>";
	this.description+=""; //<p>To execute repeatedly a block of code use one of the following structures.</p>";
	this.description+="<p>For example to move the character 5 steps upwards you could write the following.</p><p><em>var i=0;<br/>while(i<5) {<br/>&nbsp;&nbsp;&nbsp;&nbsp;i=i+1;<br/>&nbsp;&nbsp;&nbsp;&nbsp;this.moveUp();<br/>}</em></p>";
	this.description+="<p>Everything you write between the curly brackets <em>{...}</em> will be executed repeatedly. This should be enough to help you complete this level.</p>";
	this.defaultCode="//create a loop around the following line of code\nthis.moveUp();\nthis.moveRight();\n";
	this.player=new Man(0,0,this);
	this.terrainBlocks=[
			new TerrainBlock("assets/grass.png",125,1),
			new TerrainBlock("assets/ground.png",100,1),
			new TerrainBlock("assets/water.png",100,0),
			new TerrainBlock("assets/grass-rock.png",125,0),
			new TerrainBlock("assets/ground-rock.png",100,0),
		];
	this.terrain=[
			[3,3,3,3,3,3,3,3,3,3,3,3,3],
			[3,3,3,3,3,3,3,1,1,1,1,3,3],
			[3,3,3,3,3,3,1,1,2,2,1,1,3],
			[3,3,3,1,1,1,1,2,2,4,1,1,3],
			[3,3,1,4,1,1,2,2,4,1,1,1,3],
			[3,3,1,1,1,2,2,4,4,1,1,1,3],
			[3,3,1,1,2,2,4,4,1,1,1,3,3],
			[3,1,1,2,2,4,1,1,4,1,1,3,3],
			[3,1,2,2,4,1,1,1,1,1,3,3,3],
			[3,1,2,4,1,1,1,3,3,3,3,3,3],
			[3,1,1,1,1,3,3,3,3,3,3,3,3],
			[3,3,3,3,3,3,3,3,3,3,3,3,3],
		];

	this.init=function() {
		this.player.h=2;
		this.player.v=9;
		this.player.energy=10;
		this.player.creatureView.setFrame(0,0);
		this.creatures=[
			new Tree(9,2,this),
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
	goal1.description="Go to the tree at the end of the road.";
	goal1.check=function() {
		if(this.level.player.h==9&&this.level.player.v==2) {this.isAchieved=true;this.score=100;}
	}
	var goal2=new kivotos.Goal(this);
	goal2.description="Complete the level with as less code as you can.";
	goal2.check=function() {
		if(this.level.goals[0].isAchieved) {
			this.isAchieved=true;
			if(this.level.currentCode.length<130) {this.score=100;}
		}
	}
	this.goals.push(goal1);
	this.goals.push(goal2);
	
}
