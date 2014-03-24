/**
 * Toggle Login Form with jQuery
 **/

/**
$(document).ready(function() {
	$("h2:contains('Login')").parent().next().css("display", "none");

	$("h2:contains('Login')").hover(function() {
		$(this).parent().next().css("display", "block")
	});

	$("h2:contains('Login')").parent().mouseleave(function() {
		if($(".tx-felogin-pi1").is(":hover")) { } else {
			//$(".tx-felogin-pi1").css("display", "none");
		}
	});

	$(".tx-felogin-pi1").mouseleave(function() {
		$(this).toggle();
	});
});
 **/

/**
 * Am Freitag wieder bearbeiten
$(document).ready(function() {
	$(".tx-felogin-pi1").css("display", "none");

	$("h2:contains('Login')").parent().parent().mouseenter(function() {
		$(".tx-felogin-pi1").css("display", "block");
		$(".tx-felogin-pi1 input").change();
	});
	$("h2:contains('Login')").parent().parent().mouseleave(function() {
		$(".tx-felogin-pi1").css("display", "none");
		$(".tx-felogin-pi1 input").change();
	});
**/

/**
	$(".tx-felogin-pi1 input").change(function() {

		if($(".tx-felogin-pi1 input").val() == "Login"){;
			$("header h2").css("color", "green");
		} else {
			$("h2:contains('Logout')").text("Logout");
		}
	});
	$("header h2").css("color", "blue");
});
 **/