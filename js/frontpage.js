$(document).ready( function() {
	var $window = $(window);
	
// Show navigation
	var $navigation = $(".navigation");
	
	$(".navigation .burger").on("click", function() {
		$navigation.addClass("visible");
	});
	
	


// Smooth scroll
	$("a[href^='#']").on("click", function (e) {
		e.preventDefault();

		var target = this.hash,
	    $target = $(target);

		if ($target && $target.length > 0) {
			$("html, body").stop().animate({
				"scrollTop": $target.offset().top
			}, 500, "swing");
		}
	});
	
	
// Locator sidebar
	var $morphContent = $(".map .locator .morph-content");
	
	$window.resize( function() {
		var windowWidth = $window.width();
		var windowHeight = $window.height();
		
		$morphContent.css({
			top : (windowHeight / 2) - 5 + "px",
			right : (windowWidth / 2) - 5 + "px"
		});
	});
	
// Scrolling effects
	var $map = $("#main .map");
	var $scrollIcon = $(".scroll-icon");
	
	$window.on("scroll resize", function() {
		if ($window.scrollTop() >= $window.height()) {
			$navigation.addClass("visible");
			$map.addClass("fixed");
			$scrollIcon.fadeIn("fast");
		} else {
			$navigation.removeClass("visible");
			$map.removeClass("fixed");
			$scrollIcon.fadeOut("fast");
		}
		if ($window.scrollTop() >= $window.height() * 6) {
			$navigation.addClass("end");
		} else {
			$navigation.removeClass("end");
		}
	});
	
	
// Show nice splash
	var scroll = $(window).scrollTop();
	
	if (scroll !== 0) {
		$(".nicer-splash").hide();
	}
	
	
	
});