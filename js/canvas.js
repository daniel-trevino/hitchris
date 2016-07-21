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

//------- START PLACE --------
var place = cuernavaca;
var speed = 0, isRunning = true;

var c, ctx, reqAnimFrame, plane, destiny, viewPort;



function preventDefault(e) {
	e = e || window.event;
	if (e.preventDefault) {
    	e.preventDefault();
    	e.returnValue = false;
    }
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

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function enableScroll() {
    if (window.removeEventListener) {
		window.removeEventListener('DOMMouseScroll', preventDefault, false);
    }
    
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}

function disableScroll() {
	if (window.addEventListener) { // older FF
		window.addEventListener('DOMMouseScroll', preventDefault, false);
	}
	
	window.onwheel = preventDefault; // modern standard
	window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
	window.ontouchmove  = preventDefault; // mobile
	document.onkeydown  = preventDefaultForScrollKeys;
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

function animate() {
    if (plane._x < destiny.x && speed !== 0) {
		plane._x += speed;
		plane._y = calcY(plane._x);

		if (plane._x >= destiny.x && speed !== 0) {
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
	    if (speed !== 0) {
		    disableScroll();
			plane._x += -(speed);
			plane._y = calcY(plane._x);
	    }
	    
    }
	draw();

	if (isRunning) {
		checkStatusOfSpeed();
		reqAnimFrame(animate);
	}
    
}

//---- Avoids the over-rendering of the map,
//---- It only renders when the speed is != 0
function checkStatusOfSpeed() {
	if (speed !== 0 && !isRunning) {
		isRunning = true;
		animate();
	}
	else if (speed === 0 && isRunning) {
		isRunning = false;
	}
}


function checkWhichLocation () {
	var scroll = $(window).scrollTop();
	
	var windowHeight = $(window).height();
	
	console.log("Scroll: " + scroll + " / Window Height: " + windowHeight);
	
	if (scroll < windowHeight) {
		$locator.css("opacity", 0);
	}
	
	if (scroll >= windowHeight) {
		$locator.css("opacity", 1);
	}
	
	if (scroll < (windowHeight * 1.5)) {
		destiny = calcMapViewPort(cuernavaca);
		$map.removeClass("open");
		$locator.data("location", "cuernavaca").removeClass("open cuernavaca");	
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
		speed = 1;
		checkStatusOfSpeed();
	}
	
	if (scroll > 1800 && scroll < 2400 && ($locator.data("location") !== "uppsala")) {
		$locator.data("location", "uppsala");
		destiny = calcMapViewPort(uppsala);
		speed = 1;
		checkStatusOfSpeed();
	}

	if (scroll > 2400 && ($locator.data("location") !== "munich")) {
		$locator.data("location", "munich");	
		destiny = calcMapViewPort(munich);
		speed = 1;
		checkStatusOfSpeed();
	}
}

$(window).scroll(function () {
	checkWhichLocation();
});

$(window).load(function () {
	
	$window.trigger("scroll");
	$window.trigger("resize");

}); 	

$(window).resize(function () {
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
	
	//ctx.canvas.width  = window.innerWidth;
	//ctx.canvas.height = window.innerHeight;
		console.log("Canvas Width: " + $map.innerHeight + " / Canvas Height: " + $map.innerHeight );
	ctx.canvas.width  = $map.innerWidth;
	ctx.canvas.height = $map.innerHeight;
	
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

});




