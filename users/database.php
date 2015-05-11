<?php 
class Database {

	var $db;
	
	public function __construct($host,$username,$password,$dbname) {
		$this->db=new mysqli($host,$username,$password,$dbname);
		if($this->db->connect_error) {throw new Exception("Failed to connect to database!");}
	}
	
	//This function return the user ID if the provided credential are valid,
	//-1 if the credentials are wrong and FALSE if the there is a failure in the process
	public function authenticateUser($data) {
		$statement=$this->db->prepare("SELECT * FROM users WHERE (username=? OR email=?) AND password=?");
		if(!$statement) {return false;}
		$username=$data["username"];
		$password=md5($data["password"]);
		$statement->bind_param("sss",$username,$username,$password);
		if(!$statement->execute()) {return false;}
		$result=$statement->get_result();
		if($result===false) {return false;}
		if($row=$result->fetch_assoc()) {
			//found user
			return $row["id"];
		}
		return -1;
	}

	public function putUser($data) {
		$statement=$this->db->prepare("INSERT INTO users(username,email,password) VALUES(?,?,?)");
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
		$statement=$this->db->prepare("SELECT * FROM users WHERE id=?");
		if(!$statement) {return false;}
		$statement->bind_param("i",$userId);
		if(!$statement->execute()) {return false;}
		$result=$statement->get_result();
		if($result===false) {return false;}
		if($row=$result->fetch_assoc()) {$output=$row;}
		
		//achievements
		$output["achievements"]=array();
		$statement=$this->db->prepare("SELECT * FROM achievements WHERE user_id=?");
		if(!$statement) {return false;}
		$statement->bind_param("i",$userId);
		if(!$statement->execute()) {return false;}
		$result=$statement->get_result();
		if($result===false) {return false;}
		while($row=$result->fetch_assoc()) {
			$output["achievements"][]=$row;
		}
		
		return $output;
	}

	public function putAchievement($userId, $data) {
		if(!$this->achievementExists($userId, $data)) {
			//insert
			$statement=$this->db->prepare("INSERT INTO achievements(user_id,level_id,code,score) VALUES(?,?,?,?)");
			if(!$statement) {return false;}
			$levelId=$data["level_id"];
			$code=$data["code"];
			$score=$data["score"];
			$statement->bind_param("iiss",$userId,$levelId,$code,$score);
		} else {
			//update
			$statement=$this->db->prepare("UPDATE achievements SET code=?, score=? WHERE user_id=? AND level_id=?");
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
		$statement=$this->db->prepare("SELECT * FROM achievements WHERE user_id=? AND level_id=?");
		if(!$statement) {return false;}
		$levelId=$data["level_id"];
		$statement->bind_param("ii",$userId,$levelId);
		if(!$statement->execute()) {return false;}
		$result=$statement->get_result();
		if($result===false) {return false;}
		if($row=$result->fetch_assoc()) {return true;}
		return false;
	}
	
}
?>