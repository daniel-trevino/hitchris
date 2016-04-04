$(document).ready( function() {
	
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