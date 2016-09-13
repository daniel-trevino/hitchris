//----------- GLOBAL VARIABLES -----------
var $window = $(window);
var $locator = $(".locator");
var $map = $(".map");

//--------------- PLACES -----------------
var cuernavaca = {name:"cuernavaca",x:1042,y:1672};
var norrkoping = {name:"norrkoping",x:2788, y:869};
var stockholm = {name:"stockholm",x:2821, y:847};
var uppsala = {name:"uppsala",x:2817, y:830};
var munich = {name:"munich",x:2726, y:1133};

//------- START STATUS --------
var speed = 0, isRunning = true;

var c, ctx, reqAnimFrame, plane, destiny, viewPort;

function preventDefault(e) {
	e = e || window.event;
	if (e.preventDefault) {
    	e.preventDefault();
    	e.returnValue = false;
    }
}

$(window).load(function () {
	$window.trigger("scroll");
	$window.trigger("resize");
});

$(window).ready(function () {
	//checkForChanges();
}); 	

$(window).scroll(function () {
	checkWhichLocation();
});


//Every half a second checks if the map has being changed (This means, if the morph-content is open or not)
//This needs to be done since the map should be re-drawn when the morph-content is open
function checkForChanges() {
    if ($("div.map").hasClass("open")) {
		console.log("Draws the map again since the morph-content is open");
		//Sends the width of the morph-content so it is reduced from the canvas width and re-calculated
		start($("div.morph-content").width());
	}
	else {
		console.log("The morph-content is closed, it should re-draw the map");
		start(0);
		//setTimeout(checkForChanges, 500);
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

function calcSlope(origin, destiny) {
	return (origin.y-destiny.y) / (origin.x-destiny.x);
}


//---- Gets the ecuation between two points so it goes straight when it "travels"
function calcY(x) {
	//Get the slope
	var m = calcSlope(viewPort, destiny);
	var y;
	
	return y = (m * x) - (m * viewPort.x) + viewPort.y;
}

//---- Avoids the over-rendering of the map,
//---- It only renders when the speed is != 0
function checkStatusOfSpeed() {
	if (speed !== 0 && !isRunning) {
		isRunning = true;
		
		//Closes the morph next to the map
		//$("div.map").removeClass("open");
		//$("div.locator.active").removeClass("open " + location);
		animate();
	}
	else if (speed === 0 && isRunning) {
		isRunning = false;
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

//Do not touch this
/*var lastScrollTop = 0;
$(window).scroll(function(event){
	var st = $(this).scrollTop();
	if (st > lastScrollTop){
		if ($locator.data("location") == "cuernavaca" && $map.hasClass("loaded")) {
		   $map.removeClass("loaded");
		   $map.addClass("open");
		   $locator.removeClass("cuernavaca");
		   $locator.data("location", "norrkoping").addClass("open norrkoping");
		   destiny = calcMapViewPort(norrkoping);
		   speed = 10;
		   checkStatusOfSpeed();
	   }
	   else if ($locator.data("location") == "norrkoping" && $map.hasClass("loaded")) {
		   setTimeout(function() {
		   	$map.addClass("loaded"); 
		   }, 2000);
			console.log("Send to stockholm")
		}
	   // downscroll code
	} else {
	  // upscroll code
	}
	lastScrollTop = st;
});*/

//If the website is loaded in the middle of the window height, then it should render the map on that specific location
function checkWhichLocation () {
	var scroll = $(window).scrollTop();
	
	var windowHeight = $(window).height();
	
	console.log("Scroll: " + scroll + " / Window Height: " + windowHeight);
	
	if (scroll < windowHeight) {
		// Default Scrollspeed
		//jQuery.scrollSpeed(100, 800);
		
		$locator.css("opacity", 0);
		$map.removeClass("open");
	}
	
	if (scroll < (windowHeight * 1.5)) {
		destiny = calcMapViewPort(cuernavaca);
		//$map.removeClass("open");
		$locator.data("location", "cuernavaca");
		
		/* Testing with the new scroll algorithm
		if ($map.hasClass("open")) {
			setTimeout(function() {
				$map.addClass("loaded"); 
			}, 2000);
		}*/
		
		$locator.data("location", "cuernavaca").removeClass("open cuernavaca");	
	}
	
	if (scroll >= windowHeight) {
		$locator.css("opacity", 1);
		$map.addClass("open");
		$locator.data("location", "cuernavaca").addClass("open cuernavaca");
		
		// Custom Scrolling (Maybe adding custom scrolling on these cases?)
		//jQuery.scrollSpeed(100, 800);
		
		
		
		//Re-draws the map
		/*if ($("div.map").hasClass("open")) {
			console.log("Draws the map again since the morph-content is open");
			//Sends the width of the morph-content so it is reduced from the canvas width and re-calculated
			//start($("div.morph-content").width());
		}*/
	}
	

	if ( scroll >= (windowHeight * 1.5) && scroll <= (windowHeight * 2.5)) {
		destiny = calcMapViewPort(cuernavaca);
		speed = 10;
		checkStatusOfSpeed();
		$map.addClass("open");
		$locator.data("location", "cuernavaca").addClass("open cuernavaca");
	}
	
	if (scroll >= (windowHeight * 3) && scroll <= (windowHeight * 4) && ($locator.data("location") !== "norrkoping")) {
		$map.addClass("open");
		$locator.data("location", "norrkoping").addClass("open norrkoping");
		destiny = calcMapViewPort(norrkoping);
		speed = 10;
		checkStatusOfSpeed();
	}

	if (scroll > 1200 && scroll < 1800 && ($locator.data("location") !== "stockholm")) {
		$locator.data("location", "stockholm");
		destiny = calcMapViewPort(stockholm);
		speed = 10;
		checkStatusOfSpeed();
	}
	
	if (scroll > 1800 && scroll < 2400 && ($locator.data("location") !== "uppsala")) {
		$locator.data("location", "uppsala");
		destiny = calcMapViewPort(uppsala);
		speed = 10;
		checkStatusOfSpeed();		
	}

	if (scroll > 2400 && ($locator.data("location") !== "munich")) {
		$locator.data("location", "munich");	
		destiny = calcMapViewPort(munich);
		speed = 10;
		checkStatusOfSpeed();
	}
}