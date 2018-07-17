<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');
header('Content-Type: text/html; charset=utf-8');
date_default_timezone_set('Asia/Tbilisi');
setlocale(LC_ALL, 'az_AZ');

$transaction_id = @$_GET['trans_id'];


header("Location: /");
die();
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
	<div class="alert alert-danger alert-block" id="loading">
		There was an error while logging in... 
	</div>
	<a class="btn btn-success" href="./">Back to site</a>
	
	
	</div>
</div>
</div>

<script>
setTimeout(function(){location.href = './';},1000);
</script>



</body>
</html>