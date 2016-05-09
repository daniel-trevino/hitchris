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
	
	
// Project tabbing
	var $link = $('.sc-item-more a');
	var $project = $('.project-details');
	
	$project.hide();
	
	$link.on('click', function(e) {
		e.preventDefault();
		var projectID = $(this).attr('href');
		
		$project.slideUp(250);
		
		$('.project-details' + projectID).delay(250).slideDown(250, function() {
			$('html, body').animate({ scrollTop: $(this).offset().top }, 250);
		});
	});
	
	$project.find('.close-project').on('click', function() {
		$(this).parents('.project-details').slideUp();
	});
    
	
// Back to Top
	var $window = $(window);
	var $toTopLink = $('.back-to-top');
	
	$window.on('scroll resize', function() {
		if ($window.scrollTop() >= $window.height()) {
			$toTopLink.show();
		} else {
			$toTopLink.fadeOut(500);
		}
		if ($window.scrollTop() ) {
			
		}
	});
	$window.trigger('scroll');
	
	$toTopLink.on('click', function() {
		$('html, body').animate({ scrollTop: 0 }, 250);
	});
	
	
	
// CV
	$('.position .description a.showmore').parent().next().addClass('hidden');
	
	$('.position .description a.showmore').on('click', function(e) {
		e.preventDefault();
		if ($(this).parent().next().hasClass('hidden')) {
			$(this).parent().next().slideDown('fast');
			$(this).parents('.position').addClass('show-details');
		} 
	});

	
	
	
// Locator sidebar
	$('.locator').on('click', function() {
		$(this).toggleClass('open');
		$(this).parent().toggleClass('open');
	});

	
});