//----------- GLOBAL VARIABLES -----------

//--------------- PLACES -----------------
var cuernavaca = {name:"cuernavaca",x:1042,y:1672};
var norrkoping = {name:"norrkoping",x:2788, y:869};
var stockholm = {name:"stockholm",x:2821, y:847};
var uppsala = {name:"uppsala",x:2817, y:830};
var munich = {name:"munich",x:2726, y:1133};

//------- START PLACE --------
var plane;
var place = cuernavaca;
var destiny;

var viewPort;

var speed = 0;


$(window).load(function () {
	var reqAnimFrame =
    window.requestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame;
    
	var c = document.getElementById('canvas');
	var ctx = c.getContext('2d');
	var ratio = window.devicePixelRatio || 1;
	
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	
  
	// 2. Ensure the element size stays the same. Basically transforms the percentage to pixels
	c.style.width  = c.width + "px";
	c.style.height = c.height + "px";
	
	// 3. Increase the canvas dimensions by the pixel ratio. Removes the pixels like magic.. don't understand it 100% yet
	c.width  *= ratio;
	c.height *= ratio;
	
	plane = new Image();
	plane.onload = animate;
	viewPort = calcMapViewPort(place);
	
	plane._x = viewPort.x;
	plane._y = viewPort.y;
	
	plane.src = "/img/map.svg";
	ctx.scale(ratio, ratio);
	
	//destiny = calcMapViewPort(norrkoping);
	destiny = "";
	
	function animate(){

	    if (plane._x < destiny.x && speed != 0) {
			plane._x += speed;
			plane._y = calcY(plane._x);


			console.log("plane: " + plane._x + "/" + plane._y);
			console.log("Destiny: " + destiny.x + "/" + destiny.y);
			//calcCurrentPlace(plane._x,plane._y);
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
			    disableScroll();
				plane._x += -(speed);
				plane._y = calcY(plane._x);
				console.log("plane: " + plane._x + "/" + plane._y);
				console.log("Destiny: " + destiny.x + "/" + destiny.y);
		    }
		    
	    }
  
	    draw();
	    reqAnimFrame(animate);
	}
	
	function draw(){
	    ctx.clearRect(0, 0, c.width, c.height);
		ctx.drawImage(plane, plane._x, plane._y);
	}
}); 	



$(window).resize(function () {
	var reqAnimFrame =
    window.requestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame;
    
	var c = document.getElementById('canvas');
	var ctx = c.getContext('2d');
	var ratio = window.devicePixelRatio || 1;
	
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	
  
	// 2. Ensure the element size stays the same. Basically transforms the percentage to pixels
	c.style.width  = c.width + "px";
	c.style.height = c.height + "px";
	
	// 3. Increase the canvas dimensions by the pixel ratio. Removes the pixels like magic.. don't understand it 100% yet
	c.width  *= ratio;
	c.height *= ratio;
	
	plane = new Image();
	plane.onload = animate;
	viewPort = calcMapViewPort(place);
	
	plane._x = viewPort.x;
	plane._y = viewPort.y;
	
	plane.src = "/img/map.svg";
	ctx.scale(ratio, ratio);
	
	destiny = calcMapViewPort(norrkoping);
	
	function animate(){

	    if (plane._x < destiny.x && speed != 0) {
			plane._x += speed;
			plane._y = calcY(plane._x);
			
			//calcCurrentPlace(plane._x,plane._y);
			if (plane._x >= destiny.x && speed != 0) {
				//---- Make a proper stop ----
				plane._x = destiny.x;
				plane._y = destiny.y;
				viewPort.x = plane._x;
				viewPort.y = plane._y;
				speed = 0; 
				//calcCurrentPlace(destiny.x,destiny.y);
			}
			
	    }
	    
	    else {
		    if (speed != 0) {
				plane._x += -(speed);
				plane._y = calcY(plane._x);    
		    }
		    
	    }
		
/*
		console.log("plane: " + plane._x + "/" + plane._y);
	    console.log("Destiny: " + destiny.x + "/" + destiny.y);
*/
  
	    draw();
	    reqAnimFrame(animate);
	}
	
	function draw(){
	    ctx.clearRect(0, 0, c.width, c.height);
		ctx.drawImage(plane, plane._x, plane._y);
	}

});

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

function calcCurrentPlace(planeX, planeY) {
	var coorCuernavaca = calcMapViewPort(cuernavaca);
	var coorNorrkoping = calcMapViewPort(norrkoping);
	var coorStockholm = calcMapViewPort(stockholm);
	var coorUppsala = calcMapViewPort(uppsala);
	var coorMunich = calcMapViewPort(munich);
	
	if (planeX == coorCuernavaca.x && planeY == coorCuernavaca.y) {
		place = cuernavaca;
	}
	if (planeX == coorNorrkoping.x && planeY == coorNorrkoping.y) {
		place = norrkoping;
	}
	if (planeX == coorStockholm.x && planeY == coorStockholm.y) {
		place = stockholm;
	}
	if (planeX == coorUppsala.x && planeY == coorUppsala.y) {
		place = uppsala;
	}
	if (planeX == coorMunich.x && planeY == coorMunich.y) {
		place = munich;
	}
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
	if (window.addEventListener) { // older FF
		window.addEventListener('DOMMouseScroll', preventDefault, false);
	}
	
	window.onwheel = preventDefault; // modern standard
	window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
	window.ontouchmove  = preventDefault; // mobile
	document.onkeydown  = preventDefaultForScrollKeys;
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


// Calculates the center of the canvas so it positions the viewport
function calcMapViewPort(placeVP) {
	var values;
	var valX, valY;
	var c = document.getElementById('canvas');

	valX = (c.width / 2) - placeVP.x; //1440-688 = 752
	valX = valX - placeVP.x; //752 - 688 = 64
	valX = valX / 2;
	
	valY =  placeVP.y - (c.height / 2); // 1104 - 778 = 326
	
	//According to the formula.. The difference plus (778/2) = 715
	valY = valY + (c.height / 4);
	
	//Make it negative
	valY = -valY; //-715
	
	//Rest the difference to the proportinal variable
	values = {name:placeVP.name,x:valX, y:valY};

	place = placeVP;
	
	return values;
}


$(window).scroll(function () {

	var scroll = $(window).scrollTop();
	$div = $("div.locator");
	
	if (scroll < 1000 && ($div.data("location") != "cuernavaca")) {
		$div.data("location", "cuernavaca");
		$div.removeClass("norrkoping");
		
		destiny = calcMapViewPort(cuernavaca);
		speed = 10;
	}
	
	if (scroll > 1000 && scroll < 1200 && ($div.data("location") != "norrkoping")) {
		$div.data("location", "norrkoping");
		$div.removeClass("cuernavaca");
		$div.removeClass("stockholm");
		
		destiny = calcMapViewPort(norrkoping);
		speed = 10;
	}

	if (scroll > 1200 && scroll < 1800 && ($div.data("location") != "stockholm")) {
		$div.data("location", "stockholm");
		$div.removeClass("norrkoping");
		$div.removeClass("munnich");
		
		destiny = calcMapViewPort(stockholm);
		speed = 1;

	}
	
	if (scroll > 1800 && scroll < 2400 && ($div.data("location") != "uppsala")) {
		console.log("enters");
		$div.data("location", "uppsala");
		$div.removeClass("stockholm");
		$div.removeClass("munnich");
		
		destiny = calcMapViewPort(uppsala);
		speed = 1;
	}

	if (scroll > 2400 && ($div.data("location") != "munich")) {
		$div.data("location", "munich");
		$div.removeClass("uppsala");		
		
		destiny = calcMapViewPort(munich);
		speed = 1;
	}	

});




