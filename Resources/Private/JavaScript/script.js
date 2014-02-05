jQuery(function() {
	jQuery("body").removeClass("js-off").addClass("js-on");

	/**
	 * breadcrumb
	 */
	var breadCrumbWidth = 0;
	var breadCrumb = jQuery(".nav-breadcrumb li");
	var curBreadCrumbWidth = jQuery(".nav-breadcrumb li.cur").outerWidth();


	var last = breadCrumb.not(".nav-breadcrumb li.first, .nav-breadcrumb li.cur");
	if (breadCrumb.length >= 5) {
		last.find('a').each(function() {
			$this = jQuery(this)
			if ($this.text().length > 10) {
				$this.text($this.text().substr(0, 10) + '…');
			}
		});
	}

	breadCrumb.each(function() {
		var $this = jQuery(this);
		breadCrumbWidth += $this.outerWidth();

		var limit = breadCrumbWidth - curBreadCrumbWidth

		if (breadCrumbWidth > 820) {
			jQuery(".nav-breadcrumb li.cur").css('width', 820 - limit - 1)
		}
	});
	/* breadcrumb | End */

	jQuery("#searchlink").click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		jQuery(".teaser-head").hide();
		jQuery(".globalsearch").show();
		jQuery(this).addClass('clicked')
	});

	jQuery(".csc-sitemap").prepend('<p><a id="link-compactversion" href="#">Zur Kompaktansicht wechseln</a></p>');

	jQuery("#link-compactversion").click(function(e) {
		e.preventDefault();
		e.stopPropagation();

		if (jQuery(".csc-sitemap").hasClass('compact')) {
			jQuery(".csc-sitemap").removeClass('compact');
			jQuery("#link-compactversion").html('Zur Kompaktansicht wechseln');

			jQuery(".csc-sitemap ul ul ul ul").each(function() {
				$this = jQuery(this)
				$this.removeClass('subset');
				var count = $this.find('li').length;

				if (count > 0) {
					jQuery(".li-count").remove();
					$this.prev('a').css('font-weight', 'normal');
				}
			});
		} else {
			jQuery(".csc-sitemap").addClass('compact');
			jQuery("#link-compactversion").html('Zur vollständigen Ansicht wechseln');

			jQuery(".csc-sitemap ul ul ul ul").each(function() {
				$this = jQuery(this)
				$this.addClass('subset');
				var count = $this.find('li').length;

				if (count > 0) {
					$this.parent().append('<span class="li-count">(' + count + ')</span>');
					$this.prev('a').css('font-weight', 'bold');
				}
			});
		}
	});

	/* hide abc nav from wtdirectory list display */
	jQuery('.wtdirectory_abc_letter_all').hide();

	/* hide a node from wtdirectory filter */
	jQuery('.wtdirectory_filter_abc')
		.contents()
		.filter(function() {
			return this.nodeType == 3;
			})
		.remove();

	/* open pdf links in _blank */
	jQuery('a[href$=".pdf"]').attr('target', '_blank');

	/* open img in news item in lightbox */
	jQuery('.news-single-item a[href$=".jpg"]').attr('class', 'lightbox');

	/* open links with class external-link-new-window in _blank */
	jQuery('.external-link-new-window').attr('target', '_blank');

	/**
	 * Tool mode stuff
	 */

	 /* closes the tool mode menu */
	function closeToolMenu() {
		jQuery('.tool-mode__pagenav ul').hide();
	}

	/** 
	 * opens the tool mode menu if the menu button is clicked
	 * required for mouse and touch devices
	 */
	jQuery('.tool-mode__menubutton').mouseenter(function() {
		jQuery('.tool-mode__pagenav ul').show();
	});

	/**
	 * closes the tool mode menu if the main page content is clicked
	 * required for touch devices
	 */
	jQuery('.main').click(function(){
		closeToolMenu();
	});

	/**
	 * closes the tool mode menu if the breadcrumb is clicked
	 * required for touch devices
	 */
	jQuery('.nav-breadcrumb').click(function(){
		closeToolMenu();
	});	

	/**
	 * closes the tool mode menu if mouse leaves the tool mode menu 
	 * required for mouse devices
	 */
	jQuery('.tool-mode__pagenav ul').mouseleave(function() {
		closeToolMenu();
	});

	/**
	 * open/closes the tool mode menu
	 * required for mouse and touch devices
	 */
	jQuery('.tool-mode__menubutton').click(function() {
		if (jQuery('.tool-mode__pagenav ul').is(':visible')) {
			closeToolMenu();
		} else {
			jQuery('.tool-mode__pagenav ul').show();
		}
	});

	/* Tool mode | End */

});