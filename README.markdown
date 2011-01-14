Simple JQuery Validation
===================

Add data-validate with the validation function you want to run

`<input id="name" type="textbox" data-validate="required" />`

Add data-validate with multiple validation functions separated by a ' '

`<input id="email" type="textbox" data-validate="required email" />`

Create a location for error messages to appear

`<div id="errors">&nbsp;</div>`

Include a 'validate' class on the form you want to validate

`<form method="post" action="/some_url" class="validate">`

Wire up the forms you want to validate

		$(document).ready(function () {
			$("form.validate").validate('#errors');
		});

Extend with your own validation functions and messages if you want

		var validation_functions = {
			check: function(element)
			{
				return jQuery.trim(element.value) == "the dude";
			}
		};

		var validation_messages = {
			check: "does not match."
		};

		simple_validation.extend(validation_functions, validation_messages);
