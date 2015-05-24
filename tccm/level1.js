Level1.prototype=new kivotos.Level();
Level1.prototype.constructor=Level1;

function Level1() {

	this.name="(I) At The Beginning";
	this.description="<h1>How to play</h1><p>Before you begin you should know some basic JavaScript syntax. Then everything should be straightforward. To play just start coding and then press <em>Run</em>.</p>";
	this.description+="<p>In this level you will learn the basic moves of your character. Your goals are described under the <em>Level Goals</em> section.</p>";
	this.description+="To move arount use the following functions.<br/><br/>";
	this.description+="<em>this.moveUp();<br/>this.moveDown();<br/>this.moveLeft();<br/>this.moveRight();<br/></em>";
	this.defaultCode="//Write your code here!\n";
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
			[3,3,3,3,1,1,1,1,1,3,3,3,3],
			[3,3,3,1,1,1,1,1,1,1,3,3,3],
			[3,3,1,1,1,5,2,2,1,1,1,3,3],
			[3,3,1,1,4,2,2,2,1,1,1,3,3],
			[3,3,1,1,1,2,2,2,1,4,1,3,3],
			[3,3,3,1,1,1,1,1,1,1,3,3,3],
			[3,3,3,3,1,1,1,1,1,3,3,3,3],
			[3,3,3,3,3,3,3,3,3,3,3,3,3],
		];

	this.init=function() {
		this.player.h=6;
		this.player.v=4;
		this.player.energy=10;
		this.player.creatureView.setFrame(0,0);
		this.creatures=[
			new Tree(8,4,this),
			new Tree(6,3,this),
			new Tree(4,5,this),
			new Bone(6,5,this),
			new Bone(7,5,this),
			new Bone(7,4,this),
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
	goal1.description="Collect the bones.";
	goal1.check=function() {
		var counter=0;
		for(var i=0;i<this.level.creatures.length;i++) {
			if(this.level.creatures[i].name=="bone") {counter++;}
		}
		this.score=150-(counter*50);
		if(counter==0) {this.isAchieved=true;}
	}
	var goal2=new kivotos.Goal(this);
	goal2.description="Return to your initial position.";
	goal2.check=function() {
		if(this.level.goals[0].isAchieved&&this.level.player.h==6&&this.level.player.v==4) {this.isAchieved=true;this.score=50;}
	}
	this.goals.push(goal1);
	this.goals.push(goal2);
	
}
