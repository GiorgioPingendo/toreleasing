
function scroll_to(clicked_link, nav_height) {
	var element_class = clicked_link.attr('href').replace('#', '.');
	var scroll_to = 0;
	if(element_class != '.top-content') {
		element_class += '-container';
		scroll_to = $(element_class).offset().top - nav_height;
	}
	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 1000);
	}
}


jQuery(document).ready(function() {
	
	/*
	    Navigation
	*/	
	$('a.scroll-link').on('click', function(e) {

		e.preventDefault();
		scroll_to($(this), $('nav').height());
	});
	// toggle "navbar-no-bg" class
	$('.c-form-1-box').waypoint(function() {
		$('nav').toggleClass('navbar-no-bg');
	});
	
    /*
        Background slideshow
    */
    $('.top-content').backstretch("/assets/img/backgrounds/1.jpg");
    $('.how-it-works-container').backstretch("/assets/img/backgrounds/2.jpg");
    $('.testimonials-container').backstretch("/assets/img/backgrounds/1.jpg");
    // $('.call-to-action-container').backstretch("assets/img/backgrounds/2.jpg");
    $('footer').backstretch("/assets/img/backgrounds/1.jpg");
    
    $('#top-navbar-1').on('shown.bs.collapse', function(){
    	$('.top-content').backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function(){
    	$('.top-content').backstretch("resize");
    });
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(){
    	$('.testimonials-container').backstretch("resize");
    });
    
    /*
        Wow
    */
    new WOW().init();
    
    /*
	    Modals
	*/
	$('.launch-modal').on('click', function(e){
		e.preventDefault();
		$( '#' + $(this).data('modal-id') ).modal();
	});
	
	/*
	    Contact form
	*/
	$('.c-form-1-box form input').on('focus', function() {
		$(this).removeClass('contact-error');
	});

	$('.c-form-1-box form').submit(function(e) {
		e.preventDefault();
		var $form = $(this);
		var $button = $form.find('button[type="submit"]');
		var originalText = $button.text();

		$button.prop('disabled', true).text('Invio...');
		$form.find('input').removeClass('contact-error');

		var postdata = $form.serialize();
		$.ajax({
			type: 'POST',
			url: '/.netlify/functions/send',
			data: postdata,
			dataType: 'json',
			success: function(json) {
				$form.fadeOut('fast', function() {
					$('.c-form-1-bottom').append('<p>GRAZIE PER IL TUO CONTATTO!</p>');
					$('.top-content').backstretch("resize");
				});
			},
			error: function(error) {
				console.log("ERROR ", error )
				$button.prop('disabled', false).text(originalText);
				alert('Errore durante l\'invio. Riprova più tardi.');
			}
		});
	});
	
});


jQuery(window).load(function() {
	
	/*
		Hidden images
	*/
	$(".modal-body img, .testimonial-image img").attr("style", "width: auto !important; height: auto !important;");
	
});
