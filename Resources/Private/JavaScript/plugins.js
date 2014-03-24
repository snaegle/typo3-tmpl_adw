/**
 * usage: log('inside coolFunc', this, arguments);
 * paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
 */
window.log = function() {
    log.history = log.history || [];   /* store logs to an array for reference */
    log.history.push(arguments);
    if (this.console) {
        arguments.callee = arguments.callee.caller;
        var newarr = [].slice.call(arguments);
        (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
    }
};

/**
 * make it safe to use console.log always
 */
(function(b) {
    function c() {}
    for (var d = "assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","), a; a = d.pop();) {
        b[a] = b[a] || c
    }
    })((function() {
    try {
        console.log();
        return window.console;
    } catch (err) {
        return window.console = {};
    }
})());


/**
 * place any jQuery/helper plugins in here, instead of separate, slower script files.
 */
jQuery(document).ready(function() {
    var thumb = jQuery('.wtdirectory-img img').attr('src');
    var image = jQuery('.wtdirectory-img a').attr('href');
    jQuery('.wtdirectory-img a').remove();
    jQuery('.wtdirectory-img').append('<a href="' + thumb + '" class="lightbox"><img src="' + thumb + '" /></a>');
});

/**
 * Lightbox related
 */
jQuery(document).ready(function() {
    jQuery('a.lightbox').fancybox({
        'titlePosition': 'inside',
        'overlayColor': '#000',
        'overlayOpacity': '0.6',
        'hideOnContentClick': 'true',
        'speedIn': '100',
        'speedOut': '100',
        'transitionIn': 'fade',
        'transitionOut': 'elastic'
    });
});