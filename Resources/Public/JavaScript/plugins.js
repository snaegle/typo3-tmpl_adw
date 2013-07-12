
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};

// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());


// place any jQuery/helper plugins in here, instead of separate, slower script files.

$(document).ready(function(){
	var thumb = $('.wtdirectory-img img').attr('src');
	var image = $('.wtdirectory-img a').attr('href');
	//console.log('thumb: ' + thumb);
	//console.log('image: ' + image);
	//newimg_arr = $('.wtdirectory-img a').attr('href').split('&');
	//newimg = $('.wtdirectory-img a').attr('href').split('&');
	//console.log('newimg_arr[1]: ' + newimg_arr[1]);
	$('.wtdirectory-img a').remove();
	$('.wtdirectory-img').append('<a href="' + thumb +  '" class="lightbox"><img src="' + thumb + '" /></a>');
});

//jQuery.noConflict(); 
$(document).ready(function() { 
 $('a.lightbox').fancybox({ 
  'titlePosition' : 'inside', 
  'overlayColor' : '#000', 
  'overlayOpacity' : '0.6', 
  'hideOnContentClick' : 'true', 
  'speedIn' : '100', 
  'speedOut' : '100', 
  'transitionIn' : 'fade', 
  'transitionOut' : 'elastic'
 }); 
});