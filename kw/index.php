<?php
/**
 * Created by PhpStorm.
 * User: Bahram
 * Date: 13/06/2018
 * Time: 15:38
 */
error_reporting(E_ALL);
ini_set('display_errors', 'On');
header('Content-Type: text/html; charset=utf-8');
date_default_timezone_set('Asia/Baku');
setlocale(LC_ALL, 'az_AZ');


$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "http://localhost:9393/v2/user/login/start",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "portalId=7",
  CURLOPT_HTTPHEADER => array(
    "Cache-Control: no-cache",
    "Content-Type: application/x-www-form-urlencoded"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);


if ($err) {
	header("Location: /");
} else {
	$status_response = json_decode($response, 1);

	if ($status_response['code'] == 200) {
		//success case; redirect to lp 
		
		header('Location: '.$status_response['redirectUrl']);
		
	} else {
		header("Location: /");
	}

}