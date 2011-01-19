(function($) {
	$.fn.validate = function(error_console) {
		var error_console = $(error_console);
		return this.each(function() {
			$(this).submit(function (e) {
				clear_validation_messages(error_console);
				
				var inputs = $(this).find("input,textarea")
				var inputs_to_validate = jQuery.grep(inputs, function (i) { return !!($(i).attr("data-validate")); })
				
				jQuery.each(inputs_to_validate, function() { this.valid = true } );
				jQuery.each(inputs_to_validate, function() { validate(this, error_console) });
				jQuery.each(inputs_to_validate, function() { set_or_remove_error_class(this) });
				
				var has_errors = false;
				jQuery.each(inputs_to_validate, function() { if(!this.valid) has_errors = true; });
				
				hide_or_show_error_messages(has_errors, error_console);
				
				return !has_errors;
			});
		});
	};
	
	function clear_validation_messages(error_console)
	{
		error_console.text('');
	};
	
	function hide_or_show_error_messages(has_errors, error_console)
	{
		has_errors ? error_console.fadeIn() : error_console.fadeOut();
	};
	
	function add_validation_message(message, error_console)
	{
		error_console.append(message + "<br />");
	};
	
	function set_or_remove_error_class(element)
	{
		if(element.valid)
			$(element).removeClass("error");
		else if(!($(element).hasClass("error")))
			$(element).addClass("error");
	};
	
	function validate(element, error_console)
	{	
		var validations = $(element).attr("data-validate").split(" ");
		
		jQuery.each(validations, function() 
		{
			eval("var temp = simple_validation.functions." + this);
			if(!temp) alert("there is no validation function for '" + this + "'");
			if(!temp(element)) validation_failed(element, this, error_console);
		});
	};

	function get_element_name(element)
	{
		var labels = $("label[for='" + element.id + "']:first");
		if (labels.length == 0) return element.name;
		return labels.text();
	};

	function validation_failed(element, validation_type, error_console)
	{
		element.valid = false;
		var name = get_element_name(element);

		eval("var message = simple_validation.messages." + validation_type);
		if(!message) 
			add_validation_message(name + ' is invalid', error_console);
		else
			add_validation_message(name + ' ' + message, error_console);
	};

})(jQuery);


var simple_validation = {

	messages:
	{
		required: "is required.",
		money: "needs to be a dollar amount.",
		email: "must be an email address.",
		zip: "must be a valid ZIP or ZIP + 4 code.",
		digits: "must contain only numeric characters.",
		url: "",
		isbn13: "must be a valid isbn13"
	},
	
	functions: 
	{
		required: function(element)
		{
			return jQuery.trim(element.value) != "";
		},
		money: function(element)
		{
			return simple_validation.validate_regex(element.value, /^\d*(\.\d{1,2})?$/);
		},
		email: function(element)
		{
			return simple_validation.validate_regex(element.value, /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
		},
		url: function(element)
		{
			return simple_validation.validate_regex(element.value, /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/+?%&=]*)?$/);
		},
		zip: function(element)
		{
			return simple_validation.validate_regex(element.value, /^\d{5}(-\d{4})?$/);
		},
		digits: function(element)
		{
			return simple_validation.validate_regex(element.value, /^\d+$/);
		},
		isbn13: function(element)
		{
		  return simple_validation.validate_regex(element.value, /^\d{13}$/);
		}
	},
	
	validate_regex: function(value, pattern)
	{
		value = jQuery.trim(value);
		if(value == '') return true;
		return value.match(pattern);
	},
	
	extend: function(funcs, msgs)
	{
		if(funcs) jQuery.extend(simple_validation.functions, funcs);
		if(msgs) jQuery.extend(simple_validation.messages, msgs);
	}
};