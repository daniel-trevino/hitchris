$(document).ready(function() {	
		
// Show navigation
	var $navigation = $('.navigation');
	
	$('.navigation .burger').on('click', function() {
		$navigation.addClass('visible');
	});

// Smooth scroll
	$('a[href^="#"]').on('click', function (e) {
		e.preventDefault();

		var target = this.hash,
	    $target = $(target);

		if ($target && $target.length > 0) {
			$('html, body').stop().animate({
				'scrollTop': $target.offset().top
			}, 500, 'swing', function () {
				window.location.hash = target;
			});
		}
	});
    
	
// Scrolling effects

	var $window = $(window);
	
	$window.on('scroll resize', function() {
		if ($window.scrollTop() >= $window.height()) {
			$navigation.addClass('visible');
		} else {
			$navigation.removeClass('visible');
		}
		if ($window.scrollTop() >= $window.height() * 6) {
			$navigation.addClass('end');
		} else {
			$navigation.removeClass('end');
		}
	});
	$window.trigger('scroll');
	
});