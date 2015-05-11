<?php
require_once("settings.php");
require_once("database.php");
session_start();

$response=new ApiResponse();

//connect to database
try {
	$database=new Database($dbHost, $dbUser, $dbPassword, $dbName);
} catch(Exception $ex) {
	$response->setAll("error","database");
	$response->respond();
}


if(!isset($_REQUEST["action"])) {$response->setAll("error","noaction");$response->respond();}
$action=$_REQUEST["action"];

if(strcmp($action,"login")==0) {login();}
elseif(strcmp($action,"register")==0) {register();}

//Deny access to any other action if the user is not logged in
if(getUserId()===null) {
	$response->setAll("error","unauthorized");
	$response->respond();
}

if(strcmp($action,"logout")==0) {logout();}
elseif(strcmp($action,"getprofile")==0) {getprofile();}
elseif(strcmp($action,"setachievement")==0) {setachievement();}

//if none responded so far, respond with an error
$response->setAll("error","action");
$response->respond();

//---------- API End-points ----------

function login() {
	global $database, $response;
	$params=requireParams(array("username","password"));
	if($params==null) {$response->setAll("error","params"); $response->respond();}
	$result=$database->authenticateUser($params);
	
	if($result===false) { //function failed
		$response->setAll("error","database"); $response->respond();		
	} else if($result>=0) { //success
		$_SESSION["user-id"]=$result;
		$response->setBody("Welcome!"); $response->respond();				
	} else { //authentication failed
		$response->setAll("error","credentials"); $response->respond();
	}
}

function logout() {
	global $response;
	unset($_SESSION["user-id"]);
	$response->setBody("Goodbye!");
	$response->respond();		
}

function register() {
	global $database, $response, $recaptchaSecretKey;
	$params=requireParams(array("username","email","password","g-recaptcha-response"));
	if($params==null) {$response->setAll("error","params"); $response->respond();}
	//check the captcha
	$requestData="secret=$recaptchaSecretKey&response=".$params["g-recaptcha-response"];
	$request=curl_init();
	curl_setopt($request,CURLOPT_URL,"https://www.google.com/recaptcha/api/siteverify");
	curl_setopt($request,CURLOPT_POST,true);
	curl_setopt($request,CURLOPT_SSL_VERIFYPEER,false);
	curl_setopt($request,CURLOPT_POSTFIELDS,$requestData);
	curl_setopt($request,CURLOPT_RETURNTRANSFER,true);
	$result=curl_exec($request);
	if($result===false) { //the request failed! we cannot verify the captcha.
		//echo curl_error($request);
		$response->setAll("error","captcha-verification"); $response->respond();
	}
	$jsonResult=json_decode($result,true);
	if($jsonResult===null||!isset($jsonResult["success"])) { //failed to read the response! we cannot verify the captcha.
		$response->setAll("error","captcha-verification"); $response->respond();
	}
	if($jsonResult["success"]===false) { //it's a robot!
		$response->setAll("error","robot"); $response->respond();
	}
	//check params
	if(strlen($params["password"])<8) { //password too short
		$response->setAll("error","password"); $response->respond();
	}
	
	//store user
	if(!$database->putUser($params)) { //failed to store user
		$response->setAll("error","store"); $response->respond();
	}
	
	$_SESSION["user-id"]=$database->getLastInsertId();
	$response->setBody("Welcome ".$params["username"]."!");
	$response->respond();
}

function getprofile() {
	global $database, $response;
	$profile=$database->getProfile(getUserId(),null);
	if($profile!==false) {
		$response->setBody($profile);
		$response->respond();		
	} else {
		$response->setAll("error","database"); $response->respond();	
	}
}

function setachievement() {
	global $database, $response;
	$params=requireParams(array("level_id","code","score"));
	if($params==null) {$response->setAll("error","params"); $response->respond();}

	//store achievement
	if(!$database->putAchievement(getUserId(), $params)) { //failed to store achievement
		$response->setAll("error","store"); $response->respond();
	}
	$response->setBody("Achievement stored!");
	$response->respond();	
}

//---------- Other Functions ----------

//check that the required parameters are present and sanitize their values
function requireParams($params) {
	$output=array();
	foreach($params as $param) {
		if(!isset($_REQUEST[$param])) {return null;}
		$value=$_REQUEST[$param];
		$value=str_replace(array("'","\r"),array("&apos;",""),$value);
		$output[$param]=$value;
	}
	return $output;
}

//returns the user's id (if the user is logged in)
function getUserId() {
	if(isset($_SESSION["user-id"])) {
		$userId=$_SESSION["user-id"];
		if(!empty($userId)) {return $userId;}
	}
	return null;
}

class ApiResponse {
	
	var $responseStatus;
	var $responseBody;

	public function __construct() {
		$this->responseStatus="ok"; //the default status is 'ok'
	}

	public function setStatus($status) {
		$this->responseStatus=$status;
	}	

	public function setBody($body) {
		$this->responseBody=$body;
	}	
	
	public function setAll($status,$body) {
		$this->responseStatus=$status;
		$this->responseBody=$body;
	}
	
	public function respond() {
		$response=array("status"=>$this->responseStatus,"body"=>$this->responseBody);
		$response=json_encode($response);
		echo $response;
		exit();
	}
	
}

?>