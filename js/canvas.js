//----------- GLOBAL VARIABLES -----------

//--------------- PLACES -----------------
var cuernavaca = {x:1042,y:1672};
var norrkoping = {x:2788, y:869};
var stockholm = {x:2821, y:847};
var uppsala = {x:2817, y:830};
var munich = {x:2726, y:1133};

//------- START PLACE --------
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
	
	var car = new Image();
	car.onload = animate;
	viewPort = calcMapViewPort(place);
	
	car._x = viewPort.x;
	car._y = viewPort.y;
	car.src = "/img/map.svg";
	ctx.scale(ratio, ratio);
	
	destiny = calcMapViewPort(uppsala);
	
	function animate(){

	    if (car._x < destiny.x) {
			car._x += speed;
			car._y = calcY(car._x);
	    }
	    else {
		    car._x += -(speed);
		    car._y = calcY(car._x);
	    }
	    
		if (Math.round(car._y) == destiny.y) {
			speed = 0;
		}
		
/*
		console.log("Car: " + car._x + "/" + car._y);
	    console.log("Destiny: " + destiny.x + "/" + destiny.y);
*/

    
	    draw();
	    reqAnimFrame(animate);
	}
	
	function draw(){
	    ctx.clearRect(0, 0, c.width, c.height);
		ctx.drawImage(car, car._x, car._y);
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
	
	var car = new Image();
	car.onload = animate;
	viewPort = calcMapViewPort(place);
	
	car._x = viewPort.x;
	car._y = viewPort.y;
	car.src = "/img/map.svg";
	ctx.scale(ratio, ratio);
	
	
	function animate(){
	    
	    car._y += (speed);
	    car._x += -(speed);
	    
	    draw();
	    reqAnimFrame(animate);
	}
	
	function draw(){
	    ctx.clearRect(0, 0, c.width, c.height);
	    ctx.drawImage(car, car._x, car._y);
	}

});

function calcY(x) {
	//Get the slope
	var m = calcSlope(viewPort, destiny);
	var y;
	
	return y = (m * x) - (m * viewPort.x) + viewPort.y;;
	
}

function calcSlope(origin, destiny) {
	return (origin.y-destiny.y) / (origin.x-destiny.x);;
}


// Calculates the center of the canvas so it positions the viewport
function calcMapViewPort(place) {
	var values;
	var valX, valY;

	valX = (canvas.width / 2) - place.x; //1440-688 = 752
	valX = valX - place.x; //752 - 688 = 64
	valX = valX / 2;
	
	
	valY =  place.y - (canvas.height / 2); // 1104 - 778 = 326
	
	//According to the formula.. The difference plus (778/2) = 715
	valY = valY + (canvas.height / 4);
	
	//Make it negative
	valY = -valY; //-715
	
	//Rest the difference to the proportinal variable
	values = {x:valX, y:valY};

	
	return values;
}


$(window).scroll(function () {

	var scroll = $(window).scrollTop();
/*
	
	if (scroll < 1000) {
		place = cuernavaca;
		destiny = calcMapViewPort(norrkoping);
		speed = 10;
	}
	if (scroll > 1000 && scroll < 1200) {	
		place = norrkoping;
		destiny = calcMapViewPort(stockholm);
		speed = 10;
	}
	if (scroll > 1200 && scroll < 1800) {
		place = stockholm;
		destiny = calcMapViewPort(uppsala);
		speed = 10;
	}
	if (scroll > 1800 && scroll < 2400) {
		place = uppsala;	
		destiny = calcMapViewPort(munich);
		speed = 10;
	}
	if (scroll > 2400) {
		place = munich;
		destiny = calcMapViewPort(uppsala);
		speed = 10;
	}	
*/

});


// ------------ OLD RENDERING METHOD ------------

/*

var render = function drawMap() {
	
	// Create the image object
	var image   = new Image();
	// Set the image object's image file path
	image.src = "/img/map.svg";
	
	//--- Hack to remove the pixels
	var ratio = window.devicePixelRatio || 1;
	
	if( canvas.getContext ) {
		
		// Grab the context to draw to.
		context = canvas.getContext("2d");
		
		// 1. The canvas width should be generated from script, not from inline styling, so it is generated by the window size
		context.canvas.width  = window.innerWidth;
		context.canvas.height = window.innerHeight;
	  
		// 2. Ensure the element size stays the same. Basically transforms the percentage to pixels
		canvas.style.width  = canvas.width + "px";
		canvas.style.height = canvas.height + "px";
		
		// 3. Increase the canvas dimensions by the pixel ratio. Removes the pixels like magic.. don't understand it 100% yet
		canvas.width  *= ratio;
		canvas.height *= ratio;
		
		viewPort = calcMapViewPort(place);
		
		image.onload = function() {
			// 4. Scale the context by the pixel ratio. 
			context.scale(ratio, ratio);
			context.drawImage(image, viewPort.x, viewPort.y);
			
			//requestAnimationFrame(render);
		};
		
	}
};
*/







