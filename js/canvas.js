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

//Force to start always on the top
$(document).ready(function(){
	window.scrollTo(0,0); //Avoids crashing when the site is loaded on the map view instead of bein on the top
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
	console.log("speed: " + speed);
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
			//console.log("Plane X: " + plane._x + " / Plane Y: " + plane._y);
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
		
		/*if ($map.hasClass("loaded") && !$map.hasClass("traveling")) {
			$map.addClass("traveling");
			$map.removeClass("open loaded");
			$locator.removeClass("open cuernavaca");
			//start(0); (If you re-draw here, it does not animate the traveling of the locator)
		}*/
		
		animate();
	}
	else if (speed === 0 && isRunning) {
		if ($map.hasClass("traveling")) {
			$map.removeClass("traveling");
			$map.addClass("open");
			//$locator.addClass("open " + $locator.data("location"));
		}
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
	//console.log("enabled");
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
	
	//console.log("Scroll: " + scroll + " / Window Height: " + windowHeight);
	
	//First view of the site (Christian's image)
	if (scroll < windowHeight) {
		// Default Scrollspeed
		//jQuery.scrollSpeed(100, 800);
		
		$locator.css("opacity", 0);
		//This is just to set up a default location when the website is loaded on the first view (We need this to have the map rendered)
		destiny = calcMapViewPort(cuernavaca);		
		$locator.data("location", "cuernavaca").removeClass("open cuernavaca");
		
		//Re-draws the map to the first state (without a morph content)
		if ($("div.map").hasClass("open")) {
			$map.removeClass("open loaded");
			//Sends the width of the morph-content so it is reduced from the canvas width and re-calculated
			isRunning = true; //Enables rendering of the map
			start(0); //The 360 is the value of the morph-content.width()
			
		}
		
	}
	
	//Second view of the site (Located in cuernavaca)
	if (scroll >= windowHeight && scroll < (windowHeight * 2)) {
		console.log("Second view");
		$locator.css("opacity", 1);
		
		//If the screen is loaded, but not traveling, set the class to open
		/*if (!$map.hasClass("traveling")) {
			$map.addClass("open");	
			$locator.data("location", "cuernavaca").addClass("open cuernavaca");
		}*/
		$map.addClass("open");
		$locator.data("location", "cuernavaca").addClass("open cuernavaca");
		
		// Custom Scrolling (Maybe adding custom scrolling on these cases?)
		//jQuery.scrollSpeed(100, 800);
		
		
		//Re-draws the map
		if ($("div.map").hasClass("open") && $("div.morph-content").is(':visible') && !$map.hasClass("loaded")) {
			$map.addClass("loaded");
		
			//Sends the width of the morph-content so it is reduced from the canvas width and re-calculated
			isRunning = true; //Enables rendering of the map
			start(360); //The 360 is the value of the morph-content.width()
			
		}
	}
	
	
	
	//Third view (Going to Norrkoping)
	//if (scroll >= (windowHeight * 3) && scroll <= (windowHeight * 4) && ($locator.data("location") !== "norrkoping")) {
	if (scroll >= (windowHeight * 2) && scroll < (windowHeight * 3)) {
		console.log("Third View");	
		if ($locator.hasClass("cuernavaca")) { 
			speed = 10;
			$locator.removeClass("cuernavaca");
		}
		else if ($locator.hasClass("stockholm")) { //The speed from Stockholm to Norrkoping
			speed = 1;
			$locator.removeClass("stockholm");
		}
		
		$locator.data("location", "norrkoping").addClass("open norrkoping");
		destiny = calcMapViewPort(norrkoping);

		checkStatusOfSpeed();
	}
	
	//Fourth view (Going to Stockholm)
	if (scroll >= (windowHeight * 3) && scroll < (windowHeight * 4)) {
		console.log("Fourth View");	
		if ($locator.hasClass("norrkoping")) {
			speed = 1;
			$locator.removeClass("norrkoping");
		}
		else if ($locator.hasClass("uppsala")) {
			speed = 0.1;
			$locator.removeClass("uppsala");
		}
		
		$locator.data("location", "stockholm").addClass("open stockholm");
		destiny = calcMapViewPort(stockholm);
		checkStatusOfSpeed();
	}
	
	//Fifth view (Going to Uppsala)
	if (scroll >= (windowHeight * 4) && scroll < (windowHeight * 5)) {
		console.log("Fifth View");	
		if ($locator.hasClass("stockholm")) { //If it's going from stockholm to Uppsala
			speed = 0.1;
			$locator.removeClass("stockholm");
		}
		else if ($locator.hasClass("munich")) { //If it's coming from munich to Uppsala
			speed = 1;
			$locator.removeClass("munich");
		}
		
		$locator.data("location", "uppsala").addClass("open uppsala");
		destiny = calcMapViewPort(uppsala);		
		checkStatusOfSpeed();
	}
	
	//Sixth view (Going to Munich)
	if (scroll >= (windowHeight * 5) && scroll <= (windowHeight * 6)) {
		console.log("Sixth View");	
		if ($locator.hasClass("uppsala")) { //If it's going from stockholm to Uppsala
			$locator.removeClass("uppsala");
		}
		
		$locator.data("location", "munich").addClass("open munich");
		destiny = calcMapViewPort(munich);		
		speed = 1;
		checkStatusOfSpeed();
	}
}