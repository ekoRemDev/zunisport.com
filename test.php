<?php

$portal_id= intval(@$_GET['portal']);
?>

<script>

localStorage.setItem("portalId", <?=$portal_id;?>);

setTimeout(
function(){
	
	window.location.href = '/';
	
}, 2000
	)
</script>