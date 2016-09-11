//----------- GLOBAL VARIABLES -----------

//--------------- PLACES -----------------
var cuernavaca = {name:"cuernavaca",x:1042,y:1672};
var norrkoping = {name:"norrkoping",x:2788, y:869};
var stockholm = {name:"stockholm",x:2821, y:847};
var uppsala = {name:"uppsala",x:2817, y:830};
var munich = {name:"munich",x:2726, y:1133};

//------- START STATUS --------
var speed = 0, isRunning = true;

var c, ctx, reqAnimFrame, plane, destiny, viewPort;

$(window).load(function () {
	if ($("div.map").hasClass("open")) {
		//Sends the width of the morph-content so it is reduced from the canvas width and re-calculated
		start($("div.morph-content").width());
	}
	else {
		start(0);
	}
});

$(window).ready(function () {
	checkForChanges();
}); 	

function checkForChanges() {
    if ($("div.map").hasClass("open")) {
		console.log("entra");
		//Sends the width of the morph-content so it is reduced from the canvas width and re-calculated
		start($("div.morph-content").width());
	}
	else {
		start(0);
		setTimeout(checkForChanges, 500);
	}
}
 	

$(window).resize(function () {
	if ($("div.map").hasClass("open")) {
		start($("div.morph-content").width());
	}
	else {
		start(0);
	}
});

function start(param) {
	checkWhichLocation();
	speed = 0;	
	
	reqAnimFrame =
    window.requestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame;
    
	c = document.getElementById('canvas');
	ctx = c.getContext('2d');
	var ratio = window.devicePixelRatio || 1;
	
	ctx.canvas.width  = window.innerWidth - param;
	ctx.canvas.height = window.innerHeight;
	
	// 2. Ensure the element size stays the same. Basically transforms the percentage to pixels
	c.style.width  = c.width + "px";
	c.style.height = c.height + "px";
	
	// 3. Increase the canvas dimensions by the pixel ratio. Removes the pixels like magic.. don't understand it 100% yet
	c.width  *= ratio;
	c.height *= ratio;
	
	plane = new Image();
	plane.onload = animate;
	loaded = true;
	
	viewPort = calcMapViewPort(window[$("div.locator").data("location")]);
	
	plane._x = viewPort.x;
	plane._y = viewPort.y;
	
	plane.src = "/img/map.svg";
	ctx.scale(ratio, ratio);
	
	animate();
	
	checkStatusOfSpeed();
}

function animate() {
	//Going backwards (norrkoping to cuernavaca)
    if (plane._x < destiny.x && speed != 0) {
		plane._x += speed;
		plane._y = calcY(plane._x);
		
		if (plane._x >= destiny.x && speed != 0) {
			//---- Make a proper stop ----
			plane._x = destiny.x;
			plane._y = destiny.y;
			speed = 0; 
			enableScroll();
			//Sets the viewport (destiny) -- window converts the string to a variable value
			viewPort = calcMapViewPort(window[$("div.locator").data("location")]);
		}
		
    }
    
    else {
	    if (speed != 0) {
		    //disableScroll();
			plane._x += -(speed);
			plane._y = calcY(plane._x);
			console.log("Plane X: " + plane._x + " / Plane Y: " + plane._y);
	    }
	    
    }
	draw();

	if (isRunning) {
		checkStatusOfSpeed();
		reqAnimFrame(animate);
	}
    
}

function draw(){
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.drawImage(plane, plane._x, plane._y);
    
}

//---- Avoids the over-rendering of the map,
//---- It only renders when the speed is != 0
function checkStatusOfSpeed() {
	if (speed != 0 && !isRunning) {
		isRunning = true;
		
		//Closes the morph next to the map
		//$("div.map").removeClass("open");
		//$("div.locator.active").removeClass("open " + location);
		animate();
	}
	else if (speed == 0 && isRunning) {
		isRunning = false;
	}
}

//---- Gets the ecuation between two points so it goes straight when it "travels"
function calcY(x) {
	//Get the slope
	var m = calcSlope(viewPort, destiny);
	var y;
	
	return y = (m * x) - (m * viewPort.x) + viewPort.y;;
}

function calcSlope(origin, destiny) {
	return (origin.y-destiny.y) / (origin.x-destiny.x);;
}

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
	console.log("disabled");
	if (window.addEventListener) { // older FF
		window.addEventListener('DOMMouseScroll', preventDefault, false);
	}
	
	window.onwheel = preventDefault; // modern standard
	window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
	window.ontouchmove  = preventDefault; // mobile
	document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
	console.log("enabled");
    if (window.removeEventListener) {
		window.removeEventListener('DOMMouseScroll', preventDefault, false);
    }
    
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}


// Calculates the center of the canvas so it positions the viewport
function calcMapViewPort(placeVP) {
	var values;
	var valX, valY;
	var element = document.getElementById('canvas');

	valX = (element.width / 2) - placeVP.x; //1440-688 = 752
	valX = valX - placeVP.x; //752 - 688 = 64
	valX = valX / 2;
	
	valY =  placeVP.y - (element.height / 2); // 1104 - 778 = 326
	
	//According to the formula.. The difference plus (778/2) = 715
	valY = valY + (element.height / 4);
	
	//Make it negative
	valY = -valY; //-715
	
	//Rest the difference to the proportinal variable
	values = {name:placeVP.name,x:valX, y:valY};

	place = placeVP;
	
	return values;
}


$(window).scroll(function () {
	checkWhichLocation();
});

function checkWhichLocation () {
	var scroll = $(window).scrollTop();
	$div = $("div.locator");
	
	//Missing - Also check on the condition if the canvas map is visible (if they are going to start navigating on the map)
	if (scroll < 1000 && ($div.data("location") != "cuernavaca")) {
		$div.data("location", "cuernavaca");
		destiny = calcMapViewPort(cuernavaca);
		speed = 1;
		//checkStatusOfSpeed("cuernavaca");
		checkStatusOfSpeed();
	}
	
	if (scroll > 1000 && scroll < 1200 && ($div.data("location") != "norrkoping")) {
		$div.data("location", "norrkoping");
		destiny = calcMapViewPort(norrkoping);
		speed = 10;
		//checkStatusOfSpeed("norrkoping");
		checkStatusOfSpeed();
	}

	if (scroll > 1200 && scroll < 1800 && ($div.data("location") != "stockholm")) {
		$div.data("location", "stockholm");
		destiny = calcMapViewPort(stockholm);
		speed = 1;
		//checkStatusOfSpeed("stockholm");
		checkStatusOfSpeed();
	}
	
	if (scroll > 1800 && scroll < 2400 && ($div.data("location") != "uppsala")) {
		$div.data("location", "uppsala");
		destiny = calcMapViewPort(uppsala);
		speed = 1;
		//checkStatusOfSpeed("uppsala");
		checkStatusOfSpeed();		
	}

	if (scroll > 2400 && ($div.data("location") != "munich")) {
		$div.data("location", "munich");	
		destiny = calcMapViewPort(munich);
		speed = 1;
		//checkStatusOfSpeed("munich");
		checkStatusOfSpeed();
	}	
}




