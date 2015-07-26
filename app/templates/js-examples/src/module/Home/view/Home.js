/**
 * Home view
 */
define([
	'App',
	'text!./template/Home.html'
], function(App, html) {

	App.module('Home', function(Module, a, Backbone, Marionette, $, _) {

		Module.HomeView = Marionette.ItemView.extend({
			template: _.template(html),
			behaviors: {
				FadeBehavior: {},
				AutoLinkBehavior: {
					selector: 'a',
					data: 'href'
				}
			}
		});

	});
});