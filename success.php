<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');
header('Content-Type: text/html; charset=utf-8');
date_default_timezone_set('Asia/Tbilisi');
setlocale(LC_ALL, 'az_AZ');

$transaction_id = @$_GET['trans_id'];

?>

<html>
<head>
<title>Please wait...</title>
<link rel="icon" href="https://zunisport.com/style/path/img/favicon.ico">
</head>
<body>
<style>
body{
	background: #000;
	color: #fff;
}
</style>

<div class="container">
<div class="row">
	<div class="col-xs-12">
	<br>
	<div class="alert alert-info alert-block" id="loading">
		Please wait... Logging in...
	</div>
	<br>
	
	
	</div>
</div>
</div>



<script>


var clientToken = localStorage.getItem("clientToken");

clientToken = 'web_'+new Date().getTime();
localStorage.setItem("clientToken",clientToken);


var data = new FormData();
data.append("transactionId", "<?=$transaction_id; ?>");
data.append("clientToken", clientToken);

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
    var json = JSON.parse(this.responseText);

    if(json.login==true){
        localStorage.setItem("userToken",json.token);
        document.getElementById("loading").innerHTML = 'You have successfully logged in <a href="./">Continue to site</a>';
        document.getElementById("loading").className= 'alert alert-success alert-block';
		setTimeout(function(){location.href = './';},500);
    } else {
        document.getElementById("loading").innerHTML = 'Can not login... <a href="./">Back to site</a>';
        document.getElementById("loading").className= 'alert alert-danger alert-block';
    }
  }
});

xhr.open("POST", "https://api.zunisport.com/user/login/end");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);
</script>
</body>
</html>