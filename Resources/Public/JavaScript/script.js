/* Author:

*/

/**
 * jquery stuff
 */
$(function () {
	$("body").removeClass("js-off").addClass("js-on");
	
	/*
	$(".csc-default p.bodytext").each(function() {
		$this = $(this);
		if ($this.height() > 24) {
			$this.css('text-indent','2em');
		}
	});
	*/
	
	/**
	 * breadcrumb
	 */
	var breadCrumbWidth = 0;
	var breadCrumb = $(".nav-breadcrumb li");
	var curBreadCrumbWidth = $(".nav-breadcrumb li.cur").outerWidth();

	
	var last = breadCrumb.not(".nav-breadcrumb li.first, .nav-breadcrumb li.cur");
	if (breadCrumb.length >= 5) {
		last.find('a').each(function(){
			$this = $(this)
			if ($this.text().length > 10) {
				$this.text($this.text().substr(0,10) + '…');
			}
		});
	}
	
	breadCrumb.each(function(){
		var $this = $(this);
		breadCrumbWidth += $this.outerWidth();
		
		var limit = breadCrumbWidth - curBreadCrumbWidth
		
		if (breadCrumbWidth > 820) {
			$(".nav-breadcrumb li.cur").css('width',820 - limit - 1)
		}
	});

	
	$("#searchlink").click(function(e){
		e.preventDefault();
		e.stopPropagation();
		$(".teaser-head").hide();
		$(".globalsearch").show();
		$(this).addClass('clicked')
	});

/*	
	$(document).bind('click', function(e){
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("globalsearch")) {
			$(".teaser-head").show();
			$(".globalsearch").hide();
			$("#searchlink").removeClass("clicked");
		}
	});
*/
	$(".csc-sitemap").prepend('<p><a id="link-compactversion" href="#">Zur Kompaktansicht wechseln</a></p>');
	
	$("#link-compactversion").click(function(e){
		e.preventDefault();
		e.stopPropagation();
		
		if ($(".csc-sitemap").hasClass('compact')) {
			$(".csc-sitemap").removeClass('compact');
			$("#link-compactversion").html('Zur Kompaktansicht wechseln');
		
			$(".csc-sitemap ul ul ul ul").each(function() {
				$this = $(this)
				$this.removeClass('subset');
				var count = $this.find('li').length;
				
				if (count > 0) {
					$(".li-count").remove();
					$this.prev('a').css('font-weight','normal');
				}
			});
		} else {
			$(".csc-sitemap").addClass('compact');
			$("#link-compactversion").html('Zur vollständigen Ansicht wechseln');
			
			$(".csc-sitemap ul ul ul ul").each(function() {
				$this = $(this)
				$this.addClass('subset');
				var count = $this.find('li').length;
				
				if (count > 0) {
					$this.parent().append('<span class="li-count">(' + count + ')</span>');
					$this.prev('a').css('font-weight','bold');
				}
			});
		}
	});


	$('.wtdirectory_abc_letter_all').hide();

	$('.wtdirectory_filter_abc')
		.contents()
		.filter(function(){
			return this.nodeType == 3;
			})
		.remove();

	$('a[href$=".pdf"]').attr('target', '_blank');

	$('.news-single-item a[href$=".jpg"]').attr('class', 'lightbox');
	
	$('.external-link-new-window').attr('target', '_blank');

/**
 * end of $(function) // document ready
 */
});
