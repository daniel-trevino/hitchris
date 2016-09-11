$(document).ready(function() {	
		
	
	
// Project tabbing
	var $link = $('.sc-item-more a');
	var $project = $('.project-details');
	
	$project.hide();
	
	$link.on('click', function(e) {
		e.preventDefault();
		var projectID = $(this).attr('href');
		
		$project.slideUp(250);
		
		$('.project-details' + projectID).delay(250).fadeIn(250, function() {
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
	$('.position .description a.showmore').on('click', function(e) {
		e.preventDefault();
		if ($(this).parent().next().hasClass('hidden')) {
			
			$(this).slideUp('fast').parent().next().slideDown('fast');
			$(this).parents('.position').addClass('show-details');
		} 
	});



// Showcase

    $('.chart').easyPieChart({
        scaleColor: "#ecf0f1",
	    lineWidth: 20,
	    lineCap: 'butt',
	    barColor: '#353d4d',
	    trackColor:	"#ecf0f1",
	    size: 160,
	    animate: 1500
    });

	
});