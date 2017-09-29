<!DOCTYPE html>
<html lang="en-US">		
	<head>	
		<title>randoMusica by Ali Kutluozen</title>
		<link href='https://fonts.googleapis.com/css?family=Josefin+Sans' rel='stylesheet' type='text/css'>
		<link href="style.css" rel='stylesheet' type='text/css'>		
		<meta name="randomusica" content="Randomly generated music with piano sounds">	
	</head>	
	<body onload="initialize()">		
		<img id="logo" src="img/randomusicaLogo2.png"/>		
		<p id="logoText">unlimited, unheard of, composed only for you...</p>
		<div id="main">
			<hr>			
			<p id="status">Status: EMPTY</p>
			<div id="musicBoard">
				<canvas id="musicCanvas" width="10000" height="240">No good</canvas>
			</div>
			<div id="buttonCase">				
				<input type="number" min="125" max="2000" name="name" id="uniqueID" placeholder="Enter the speed (Must be between 125 and 2000)" value="500"/>
				<button onclick="randoMusica.generate()">Generate</button>
				<button id="playPause" onclick="randoMusica.play()">Play</button>
			</div>
		</div>		
		<div id="footerText">Created by Ali Kutluozen - 2016</div>		
		<p style="text-align: center; font-size:12px; color:#FFFFFF;"><?php include("counter.php"); ?></p>
	</body>		
	<script type="text/javascript" src="lib/soundjs-NEXT.combined.js"></script>
	<script type="text/javascript" src="lib/code.js"></script>
</html>
