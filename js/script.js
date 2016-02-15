$(document).ready(function() {	
		
// Show navigation
	var navigation = $('.navigation ul');
	$('.navigation .burger').on('click', function() {
		$(this).toggleClass('active');
		navigation.fadeToggle(500);
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

	var $animation_elements = $('.animation-element');
	var $window = $(window);
	
	function check_if_in_view() {
	  var window_height = $window.height();
	  var window_top_position = $window.scrollTop();
	  var window_bottom_position = (window_top_position + window_height);
	 
	  $.each($animation_elements, function() {
	    var $element = $(this);
	    var element_height = $element.outerHeight();
	    var element_top_position = $element.offset().top;
	    var element_bottom_position = (element_top_position + element_height);
	 
	    //check to see if this current container is within viewport
	    if ((element_bottom_position >= window_top_position) &&
	        (element_top_position <= window_bottom_position)) {
	      $element.addClass('in-view');
	    } else {
	      $element.removeClass('in-view');
	    }
	  });
	}
	
	$window.on('scroll resize', check_if_in_view, function() {
		if ($window.scrollTop() >= $window.height()) {
			$('.map').addClass('fix');
		} else {
			$('.map').removeClass('fix');
		}
		if ($window.scrollTop() >= $window.height() * 5) {
			$('.map').toggleClass('fix bottom');
		}
	});
	$window.trigger('scroll');
	
});