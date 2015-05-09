//Everything should be under 'kivotos' to avoid conflicts.
//If 'kivotos' is not defined, define it.
if(typeof kivotos=="undefined") {window.kivotos={};}


/** This is the game engine. */
kivotos.Engine=function(elementId) {
	this._STATUS_ENDED=0;
	this._STATUS_RUNNING=1;

	this.container=document.getElementById(elementId);
	this.container.style.position="relative";
	this.titleElem=document.createElement("div");
	this.titleElem.style.cssText="position:absolute;top:10px;left:10px;font-size:2em;color:#fff;z-index:10";
	this.descriptionContainer=document.createElement("div");
	this.descriptionContainer.style.cssText="position:absolute;top:0px;left:0px;width:100%;height:100%;display:none";
	this.descriptionElem=document.createElement("div");
	this.descriptionElem.style.cssText="margin:70px;padding:20px;color:#fff;background-color:rgba(50,50,50,0.8);";
	this.descriptionContainer.appendChild(this.descriptionElem);
	this.canvasElem=document.createElement("canvas");
	this.context=this.canvasElem.getContext("2d");
	this.container.appendChild(this.canvasElem);
	this.container.appendChild(this.titleElem);
	this.container.appendChild(this.descriptionContainer);
	this.canvasWidth=0;
	this.canvasHeight=0;
	this.viewportX=0;
	this.viewportY=0;
	this.stepPeriod=500; //ms
	this.followPlayer=true;
	this.isDragging=false;
	this.dragStart={x:0,y:0};
	this.viewportStart={x:0,y:0};
	this.onExecutionEnd=function() {};
	this.onFollowPlayerChanged=function() {};
	
	this.level;
	
	this.executionTimer;
	this.executionCounter=0;
	this.executionStatus=this._STATUS_ENDED;
		
	this._abort=false;
	var thisobj=this;
	
	this.onresize=function() {
		thisobj.canvasWidth=thisobj.container.clientWidth;
		thisobj.canvasHeight=thisobj.container.clientHeight;
		thisobj.canvasElem.setAttribute("width",thisobj.canvasWidth);
		thisobj.canvasElem.setAttribute("height",thisobj.canvasHeight);
	}
	
	this.loadLevel=function(level) {
		console.log("Initializing level '"+level.name+"'");
		this.level=level;
		this.level.init();
		this.level.height=this.level.terrain.length;
		this.level.width=this.level.terrain[0].length;
		this.level.halfBlock=this.level.blockSize/2;
		//this.titleElem.innerHTML=this.level.name;
		this.descriptionElem.innerHTML=this.level.description;
	}
	
	this.setUserCode=function(source) {
		console.log(this.level.context.run(source));
	}
	
	this.setFollowPlayer=function(value) {
		if(this.onFollowPlayerChanged) {this.onFollowPlayerChanged(value);}
		this.followPlayer=value;
	}
	
	this.start=function() {
		if(this.executionTimer) {clearInterval(this.executionTimer);}
		this.executionTimer=setInterval(thisobj.execute,this.stepPeriod);		
		this.executionStatus=this._STATUS_RUNNING;
	}
	
	this.stop=function() {
		if(this.executionTimer) {clearInterval(this.executionTimer);}
		this.executionStatus=this._STATUS_ENDED;
	}
	
	//this function draws the scene
	this.draw=function() {
		if(!thisobj._abort) {requestAnimationFrame(thisobj.draw);}
		
		var context=thisobj.context;
		var canvasWidth=thisobj.canvasWidth;
		var canvasHeight=thisobj.canvasHeight;
		var level=thisobj.level;
		var now=new Date();
		var time=now.getTime();

		context.fillStyle="#000000";
		context.fillRect(-thisobj.viewportX,-thisobj.viewportY,canvasWidth,canvasHeight);
		context.restore();
		context.save();
		
		if(level) {
			//move viewport
			if(thisobj.followPlayer) {
				//follow player
				var viewportTx=canvasWidth/2-level.player.x-level.blockSize;
				var viewportTy=canvasHeight/2-level.player.y-level.blockSize;
				var viewportAx=Math.pow(Math.abs(thisobj.viewportX-viewportTx),1.5)/700;
				var viewportAy=Math.pow(Math.abs(thisobj.viewportY-viewportTy),1.5)/700;			
				if(viewportAx>0.2) {
					if(thisobj.viewportX<viewportTx) {thisobj.viewportX+=viewportAx;}
					else if(thisobj.viewportX>viewportTx) {thisobj.viewportX-=viewportAx;}
				}
				if(viewportAy>0.2) {
					if(thisobj.viewportY<viewportTy) {thisobj.viewportY+=viewportAy;}
					else if(thisobj.viewportY>viewportTy) {thisobj.viewportY-=viewportAy;}
				}
			}
			context.translate(thisobj.viewportX,thisobj.viewportY);
		
			//draw terrain
			for(var z=level.terrainBlocks.length;z>=0;z--) {
				for(var h=0;h<level.width;h++) {
					for(var v=0;v<level.height;v++) {
						var blockIndex=level.terrain[v][h];
						if(blockIndex==0) {
							//context.fillStyle="#ffaa00";
							//context.strokeStyle="rgba(100,50,10,0.1)";
							//context.strokeRect(h*level.blockSize-level.halfBlock,v*level.blockSize-level.halfBlock,level.blockSize,level.blockSize);
						} else if(blockIndex==z+1) {
							var terrainBlock=level.terrainBlocks[blockIndex-1];
							//console.log(terrainBlock.image);
							thisobj.context.drawImage(terrainBlock.image,h*level.blockSize-terrainBlock.halfSize,v*level.blockSize-terrainBlock.halfSize);
							context.strokeStyle="rgba(255,255,255,0.1)";
							context.strokeRect(h*level.blockSize-level.halfBlock,v*level.blockSize-level.halfBlock,level.blockSize,level.blockSize);
							//context.font="12px sans-serif"
							//context.fillStyle="rgba(255,255,255,0.2)";
							//context.textAlign="left";
							//context.fillText(h+", "+v,h*level.blockSize-level.halfBlock,v*level.blockSize-level.halfBlock+15);
						}
					}
				}
			}
			//draw creatures
			for(var c=0;c<level.creatures.length;c++) {
				var creature=level.creatures[c];
				//creature.currentFrame=Math.floor(time/2)%creature.frames;
				//if(creature.currentFrame>=creature.frames) {creature.currentFrame=0;}
				if(time-creature.lastFrameTime>=creature.framePeriod) {
					creature.currentFrame++;
					if(creature.currentFrame>=creature.frames) {creature.currentFrame=0;}
					creature.lastFrameTime=time;
				}
				
				creature.draw(context);				
			}
		}
	}
	
	this._onMouseDown=function(event) {
		event=event||window.event;
		event.x=event.x||event.pageX;
		event.y=event.y||event.pageY;
		thisobj.setFollowPlayer(false);
		//thisobj.followPlayer=false;
		thisobj.isDragging=true;
		thisobj.dragStart.x=event.x;
		thisobj.dragStart.y=event.y;
		thisobj.viewportStart.x=thisobj.viewportX;
		thisobj.viewportStart.y=thisobj.viewportY;
		thisobj.canvasElem.style.cursor="move";
	}
	this._onMouseUp=function(event) {
		event=event||window.event;
		thisobj.isDragging=false;
		thisobj.canvasElem.style.cursor="default";
	}
	this._onMouseMove=function(event) {
		event=event||window.event;
		event.x=event.x||event.pageX;
		event.y=event.y||event.pageY;
		if(thisobj.isDragging) {
			var dx=event.x-thisobj.dragStart.x;
			var dy=event.y-thisobj.dragStart.y;
			thisobj.viewportX=thisobj.viewportStart.x+dx;
			thisobj.viewportY=thisobj.viewportStart.y+dy;
		}
	}

	this.canvasElem.onmousedown=thisobj._onMouseDown;
	this.canvasElem.onmouseup=thisobj._onMouseUp;
	this.canvasElem.onmousemove=thisobj._onMouseMove;
	
	//this function calls frequently the run function on active level objects
	this.execute=function() {
		thisobj.executionCounter++;
		if(thisobj.level) {
			//execute queues
			var creatures=thisobj.level.creatures;
			for(var i=0;i<creatures.length;i++) {
				//creatures[i].run();

				//reset steps
				creatures[i].steps=0;
				//run the user code
				if(creatures[i].queue.length>0) {
					var action=creatures[i].queue.shift();
					action();
				} else {
					//check if player's queue is empty to end the simulation
					if(thisobj.level.player==creatures[i]) {thisobj.stop();}
				}				
			}
			
			//evaluate state
			if(thisobj.level.evaluate()) {
				thisobj.onExecutionEnd(true); //success
				thisobj.stop();
			} else if(thisobj.executionStatus==thisobj._STATUS_ENDED) {
				thisobj.onExecutionEnd(false); //failure
			}
			thisobj.level.afterEvaluation();
		}
	}
	
	//listen for resize events
	window.addEventListener('resize',thisobj.onresize);
	//compute the initial canvas size
	this.onresize();
	//start drawing
	this.draw();
}

/** Sprite **/
kivotos.Sprite=function(url, width, height, rows, columns) {
	this.image=new Image();
	this.image.src=url;
	this.width=width;
	this.height=height;
	this.rows=rows;
	this.columns=columns;
	this.row=0;
	this.column=0;
	
	this.setFrame=function(row,column) {
		if(row!=null) {this.row=row%this.rows;}
		if(column!=null) {this.column=column%this.columns;}
	}
	
	this.draw=function(context,x,y) {
		context.drawImage(this.image,this.column*this.width,this.row*this.height,this.width,this.height,x,y,this.width,this.height);
	}
}
