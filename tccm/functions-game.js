function getprofile() {
	$.ajax({
		type: "GET",
		url: "users/api.php?action=getprofile",
		success: function(response) {
			try {
				response=JSON.parse(response);
				if(response.status=="ok") {
					var profile=response.body;
					
					$("#profile-username").html(profile.username);
					$("#profile-panel").show();
					updateTotalScore(profile);
					
					var maxLevel=-1;
					for(var i=0;i<profile.achievements.length;i++) {						
						if(profile.achievements[i].score>0&&profile.achievements[i].level_id>maxLevel) {
							maxLevel=profile.achievements[i].level_id;
						}
					}
					
					currentLevel=maxLevel+1;
					user=profile;				
					if(currentLevel<levels.length) {
						loadLevel(currentLevel);
						editor.setValue(profile.achievements[currentLevel].code);
					} else {
						//the user completed the game
						$("#game").hide();
						$("#game-end").show();
					}
					return;
				}
			} catch(ex) {}
			loadLevel(currentLevel);
		},
		error: function() {
			loadLevel(currentLevel);
		}
	});
}

function updateTotalScore(profile) {
	var score=0;
	for(var i=0;i<profile.achievements.length;i++) {score+=profile.achievements[i].score;}
	$("#profile-score").html(score);
}

function getCurrentLevelIndex() {
	for(var i=0;i<levels.length;i++) {
		if(levels[i]==engine.level) {return i;}
	}	
	return 0;
}

function saveProgress(saveScore, handler) {
	var postData={
		action: "setachievement",
		user_id: user.id,
		level_id: getCurrentLevelIndex(),
		code: editor.getValue(),
		score: saveScore==true?engine.level.score:0
	};
	$.ajax({
		type: "POST",
		url: "users/api.php",
		data: postData,
		success: function(response) {
			try {
				var response=JSON.parse(response);
				if(response.status=="ok") {
					handler(true);
					return;
				}
			} catch(ex) {}
			handler(false);
		},
		error: function() {
			handler(false);
		}
	});
}


function logout() {
	$("#game").hide();
	$("#spinner").show();
	$.ajax({
		type: "GET",
		url: "users/api.php?action=logout",
		success: function(response) {
			window.location.href="./";
		},
		error: function(response) {
			window.location.href="./";
		}
	});
}

function program() {
	if(!engine.setUserCode(editor.getValue())) {
		//code failed
		$(".CodeMirror").effect("shake");
		$("#execution-message").html("Please check your code!");
	} else {
		$("#button-run").prop("disabled",true); //disable the run button
		$("#execution-message").html("");
		engine.start();
	}
}

function resize() {
	var width=window.innerWidth;
	var height=window.innerHeight;
	//engine.container.style.width=width+"px";
	engine.container.style.height=height+"px";
	engine.onresize();
}

function loadLevel(index) {
	var newLevel=levels[index];
	engine.loadLevel(newLevel);
	$("#level-title").html(newLevel.name).append(" <a id='button-level-description' href='javascript:showLevelDescription()'><span class='ui-icon ui-icon-info inline-block' title='Level Description'></span></a>");
	$("#execution-message").html("");
	$("#profile-level-score").html(0);
	editor.setValue(newLevel.defaultCode);
	newLevel.afterEvaluation=function() {updateGoals(newLevel);}
	updateGoals(newLevel);
	showLevelDescription();
}

function updateGoals(level) {
	$("#level-goals").empty();
	for(var i=0;i<level.goals.length;i++) {
		if(!level.goals[i].isAchieved) {$("#level-goals").append("<li>"+level.goals[i].description+"</li>");}
		else {$("#level-goals").append("<li class='achieved'>"+level.goals[i].description+" <span class='ui-icon ui-icon-check float-right'></span></li>");}
	}
}

function showLevelDescription() {
	$("#level-description-dialog").html(engine.level.description);
	$("#level-description-dialog").dialog("open");				
}

function retryLevel() {
	engine.setFollowPlayer(true);
	engine.level._init();
	updateGoals(engine.level);
	$("#profile-level-score").html(0);
}