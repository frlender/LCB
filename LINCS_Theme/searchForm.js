var defaultSearchText = "SEARCH THE SITE";

jQuery(function($){
	// Setup search form
	if($('#searchform input#s').val() == "") {
		$('#searchform input#s').val(defaultSearchText);
	}
	
	$('#searchform input#s').focus(function(){
		if($('#searchform input#s').val() == defaultSearchText) {
			$('#searchform input#s').val("");
		}
		$(this).addClass('focused');
		$(this).select();
	});
	$('#searchform input#s').blur(function(){
		if($('#searchform input#s').val() == "") {
			$('#searchform input#s').val(defaultSearchText);
		}
		$(this).removeClass('focused');
	});

})