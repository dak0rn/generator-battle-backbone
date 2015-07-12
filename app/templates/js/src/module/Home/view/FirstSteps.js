/**
 * First steps view
 */
define([
	'App',
	'text!./template/FirstSteps.html'
], function(App, html) {

	App.module('Home', function(Module, a, Backbone, Marionette, $, _) {
		
		Module.FirstStepsView = Marionette.ItemView.extend({
			template: _.template(html),
			behaviors: {
				FadeBehavior: {}
			}
		});


	});
});