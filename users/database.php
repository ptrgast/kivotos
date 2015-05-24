<?php 
class Database {

	var $db;
	var $prefix;
	
	public function __construct($host,$username,$password,$dbname,$prefix="") {
		$this->db=new mysqli($host,$username,$password,$dbname);
		if($this->db->connect_error) {throw new Exception("Failed to connect to database!");}
		$this->prefix=$prefix;
	}
	
	//This function return the user ID if the provided credential are valid,
	//-1 if the credentials are wrong and FALSE if the there is a failure in the process
	public function authenticateUser($data) {
		$statement=$this->db->prepare("SELECT id FROM ".$this->prefix."users WHERE (username=? OR email=?) AND password=?");
		if(!$statement) {return false;}
		$username=$data["username"];
		$password=md5($data["password"]);
		$statement->bind_param("sss",$username,$username,$password);
		if(!$statement->execute()) {return false;}
		if(!$statement->bind_result($userId)) {return false;}
		if($statement->fetch()==true) {
			//found user
			return $userId;
		}
		return -1;
	}

	public function putUser($data) {
		$statement=$this->db->prepare("INSERT INTO ".$this->prefix."users(username,email,password) VALUES(?,?,?)");
		if(!$statement) {return false;}
		$username=$data["username"];
		$email=$data["email"];
		$password=md5($data["password"]);
		$statement->bind_param("sss",$username,$email,$password);
		if(!$statement->execute()) {return false;}
		return true;
	}
	
	//This function returns the user's profile or FALSE on failure
	public function getProfile($userId, $data) {
		$output=array();
		
		//user
		$statement=$this->db->prepare("SELECT username, email, registration_date  FROM ".$this->prefix."users WHERE id=?");
		if(!$statement) {return false;}
		$statement->bind_param("i",$userId);
		if(!$statement->execute()) {return false;}
		if(!$statement->bind_result($username,$email,$registration_date)) {return false;}
		if($statement->fetch()!=true) {return false;}
		$output["username"]=$username;
		$output["email"]=$email;
		$output["registration_date"]=$registration_date;
		$statement->close();

		//achievements
		$output["achievements"]=array();
		$statement=$this->db->prepare("SELECT level_id, code, score FROM ".$this->prefix."achievements WHERE user_id=?");
		if(!$statement) {return false;}
		$statement->bind_param("i",$userId);
		if(!$statement->execute()) {return false;}
		if(!$statement->bind_result($level_id,$code,$score)) {return false;}
		while($statement->fetch()) {
			$achievement=array("level_id"=>$level_id,"code"=>$code,"score"=>$score);
			$output["achievements"][]=$achievement;
		}
		
		return $output;
	}

	public function putAchievement($userId, $data) {
		if(!$this->achievementExists($userId, $data)) {
			//insert
			$statement=$this->db->prepare("INSERT INTO ".$this->prefix."achievements(user_id,level_id,code,score) VALUES(?,?,?,?)");
			if(!$statement) {return false;}
			$levelId=$data["level_id"];
			$code=$data["code"];
			$score=$data["score"];
			$statement->bind_param("iiss",$userId,$levelId,$code,$score);
		} else {
			//update
			$statement=$this->db->prepare("UPDATE ".$this->prefix."achievements SET code=?, score=? WHERE user_id=? AND level_id=?");
			if(!$statement) {return false;}
			$levelId=$data["level_id"];
			$code=$data["code"];
			$score=$data["score"];
			$statement->bind_param("ssii",$code,$score,$userId,$levelId);
		}
		if(!$statement->execute()) {return false;}
		return true;	
	}
	
	public function getLastInsertId() {
		return $this->db->insert_id;
	}

	private function achievementExists($userId, $data) {
		//achievements
		$output["achievements"]=array();
		$statement=$this->db->prepare("SELECT level_id FROM ".$this->prefix."achievements WHERE user_id=? AND level_id=?");
		if(!$statement) {return false;}
		$levelId=$data["level_id"];
		$statement->bind_param("ii",$userId,$levelId);
		if(!$statement->execute()) {return false;}
		if(!$statement->bind_result($level_id)) {return false;}
		if($statement->fetch()==true) {
			return true;
		}
		return false;
	}
	
}
?>