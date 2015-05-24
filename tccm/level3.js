Level3.prototype=new kivotos.Level();
Level3.prototype.constructor=Level3;

function Level3() {

	this.name="(III) Follow The Path";
	this.description="<h1>More Loop Structures</h1><p>Apart from the <em>while</em> structure, there are some more structures that allow you to create loops. To create a loop especially when you know the number of iteration you will need, you can use the <em>for</em> structure.</p>";
	this.description+="<p><em>for(statements) {/*code to repeat*/}</em></p>";
	this.description+="<p>The <em>for</em> structure expects three statements separated with semicolon to work.<ol><li>The counter initialization</li><li>The loop condition</li><li>The counter increment</li></ol></p>";
	this.description+="<p>For example to repeat a block of code 10 times you could write</p><p><em>for(var i=0; i<10; i=i+1) {/*code to repeat*/}</em></p>";
	this.defaultCode="//It seems that you will need three different loops\nfor(var i=0;i<6;i++) {\n\n}\n";
	this.player=new Man(0,0,this);
	this.terrainBlocks=[
			new TerrainBlock("assets/grass.png",125,1),
			new TerrainBlock("assets/ground.png",100,1),
			new TerrainBlock("assets/water.png",100,0),
			new TerrainBlock("assets/grass-rock.png",125,0),
			new TerrainBlock("assets/ground-rock.png",100,0),
		];
	this.terrain=[
			[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
			[3,3,3,1,1,3,3,3,1,1,1,3,3,3,3],
			[3,1,1,1,1,1,1,1,1,1,1,1,3,3,3],
			[3,1,1,2,2,2,2,2,2,2,1,1,1,1,3],
			[3,3,1,1,1,1,1,1,4,2,1,1,1,3,3],
			[3,3,3,3,1,1,3,1,1,2,1,1,1,3,3],
			[3,3,3,3,3,3,3,3,1,2,4,1,3,3,3],
			[3,3,3,3,3,3,3,1,1,2,1,1,3,3,3],
			[3,3,1,1,1,1,4,4,1,2,1,3,3,3,3],
			[3,3,1,2,2,2,2,2,2,2,1,3,3,3,3],
			[3,1,1,1,1,1,1,1,1,1,1,3,3,3,3],
			[3,3,1,1,1,1,3,3,3,3,3,3,3,3,3],
			[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
		];

	this.init=function() {
		this.player.h=3;
		this.player.v=3;
		this.player.energy=10;
		this.player.creatureView.setFrame(0,0);
		this.creatures=[
			new Tree(4,5,this),
			new Tree(9,2,this),
			new Tree(3,10,this),
			new Pumpkin(9,4,this),
			new Bone(3,9,this),
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
	goal1.description="Eat the pumpkin.";
	goal1.check=function() {
		if(this.level.player.h==9&&this.level.player.v==4) {this.isAchieved=true;this.score=100;}
	}
	var goal2=new kivotos.Goal(this);
	goal2.description="Pick up the bone.";
	goal2.check=function() {
		if(this.level.player.h==3&&this.level.player.v==9) {this.isAchieved=true;this.score=100;}
	}
	this.goals.push(goal1);	
	this.goals.push(goal2);
	
}
