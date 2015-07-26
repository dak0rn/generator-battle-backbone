/**
 * Error view
 */
define([
	'App',
	'text!./template/Error.html'
], function(App, html) {

	App.module('Error', function(Module, a, Backbone, Marionette, $, _) {

		Module.Error = Marionette.ItemView.extend({

			template: _.template(html),

			behaviors: {
				FadeBehavior: {}
			}

		});

	});

});