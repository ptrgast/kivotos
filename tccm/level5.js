Level5.prototype=new kivotos.Level();
Level5.prototype.constructor=Level5;

function Level5() {

	this.name="(V) The Beast";
	this.description="<h1>Conditional Execution</h1><p>A very common need in programming is the conditional execution of code. This can be achieved with an <em>if...else</em> structure. The full form of the structure is as follows but you can omit the parts you don't need.</p>";
	this.description+="<p><em>if(condition1) {<br/>&nbsp;&nbsp;&nbsp;&nbsp;//executed when the condition1 is true<br/>} else if(condition2) {<br/>&nbsp;&nbsp;&nbsp;&nbsp;//executed when the condition1 fails but the condition2 is true<br/>} else {<br/>&nbsp;&nbsp;&nbsp;&nbsp;//executed when all other condition fails<br/>}</em></p>";
	this.description+="<p>For example to move the character one step upwards when <em>i</em> equals to 3. You would write: <em>if(i==3) {this.moveUp();}</em></p>";
	this.description+="<h2>Wait there is more!</h2><p>A new function called <em>wait</em> is available in this level. This function makes the character rest for one time step when it's called.</em></p><p><em>this.wait();</em></p>";
	this.description+="</div>";
	this.defaultCode="//It's a long distance! Make sure you eat something while you are on the go.\n\nfor(var i=0;i<15;i++) {\n\tthis.moveRight();\n}\n\nfor(var i=0;i<15;i++) {\n\tthis.moveLeft();\n}";
	this.player=new Man(0,0,this);
	this.terrainBlocks=[
			new TerrainBlock("assets/grass.png",125,1),
			new TerrainBlock("assets/ground.png",100,1),
			new TerrainBlock("assets/water.png",100,0),
			new TerrainBlock("assets/grass-rock.png",125,0),
			new TerrainBlock("assets/ground-rock.png",100,0),
		];
	this.terrain=[
			[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
			[3,3,3,3,3,3,3,3,3,1,1,1,1,1,3,3,3,3,1,1,1,1,3],
			[3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,1,1,1,3],
			[3,1,1,1,1,1,1,1,1,1,1,1,4,4,1,1,1,1,3,3,3,3,3],
			[3,1,4,4,1,1,1,1,1,1,1,4,4,1,1,1,1,1,1,1,3,3,3],
			[3,1,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,3,3,3],
			[3,1,4,4,1,1,1,1,4,1,1,1,1,1,4,1,1,1,1,1,4,3,3],
			[3,3,1,1,1,1,1,1,1,1,1,3,3,3,1,1,1,1,1,4,4,3,3],
			[3,3,3,3,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,3,3,3,3],
			[3,3,3,3,3,1,1,1,3,3,3,3,1,1,1,3,3,3,3,3,3,3,3],
			[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
		];

	this.init=function() {
		this.player.h=3;
		this.player.v=5;
		this.player.energy=10;
		this.player.creatureView.setFrame(0,0);
		this.bear=new Bear(13,4,this);
		this.bear.queue=[];
		for(var i=0;i<6;i++) {
			this.bear.enqueue(function(){thisobj.bear.moveDown();});
			this.bear.enqueue(function(){thisobj.bear.moveDown();});
			this.bear.enqueue(function(){thisobj.bear.moveUp();});
			this.bear.enqueue(function(){thisobj.bear.wait();});
			this.bear.enqueue(function(){thisobj.bear.moveUp();});
			this.bear.enqueue(function(){thisobj.bear.wait();});
		}
		this.bear.enqueue(function(){thisobj.bear.moveDown();});
		this.bear.enqueue(function(){thisobj.bear.moveDown();});
		this.creatures=[
			new Tree(11,3,this),
			new Tree(6,7,this),
			new Tree(15,6,this),
			new Bone(18,5,this),
			new Pumpkin(10,6,this),
			new Pumpkin(8,4,this),
			this.bear,
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
	goal1.description="Pick up the bone.";
	goal1.check=function() {if(this.level.player.h==18&&this.level.player.v==5) {this.isAchieved=true;this.score=150;}}
	var goal2=new kivotos.Goal(this);
	goal2.description="Avoid the bear.";
	goal2.check=function() {if(this.level.goals[0].isAchieved&&this.level.player.h<13) {this.isAchieved=true;this.score=150;}}
	var goal3=new kivotos.Goal(this);
	goal3.description="Go back to your shelter.";
	goal3.check=function() {if(this.level.goals[0].isAchieved&&this.level.player.h==3&&this.level.player.v==5) {this.isAchieved=true;this.score=200;}}
	this.goals.push(goal1);	
	this.goals.push(goal2);
	this.goals.push(goal3);
	
}
